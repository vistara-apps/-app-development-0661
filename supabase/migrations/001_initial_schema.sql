-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    fid BIGINT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    display_name TEXT NOT NULL,
    pfp_url TEXT,
    bio TEXT,
    follower_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    wallet_address TEXT,
    preferences JSONB DEFAULT '{"notifications": true, "currency": "USD"}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    frequency TEXT NOT NULL CHECK (frequency IN ('monthly', 'yearly')),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_expenses table
CREATE TABLE daily_expenses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create legal_guides table (for storing guide content and interactions)
CREATE TABLE legal_guides (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    content JSONB NOT NULL,
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_interactions table (for tracking guide views, saves, shares)
CREATE TABLE user_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    guide_id UUID REFERENCES legal_guides(id) ON DELETE CASCADE,
    interaction_type TEXT NOT NULL CHECK (interaction_type IN ('view', 'save', 'share', 'unsave')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create premium_unlocks table (for tracking premium feature purchases)
CREATE TABLE premium_unlocks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    feature TEXT NOT NULL,
    transaction_hash TEXT,
    amount_paid DECIMAL(10,2),
    currency TEXT DEFAULT 'ETH',
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- Create indexes for better performance
CREATE INDEX idx_users_fid ON users(fid);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_active ON subscriptions(user_id, is_active);
CREATE INDEX idx_daily_expenses_user_id ON daily_expenses(user_id);
CREATE INDEX idx_daily_expenses_timestamp ON daily_expenses(user_id, timestamp);
CREATE INDEX idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX idx_user_interactions_guide_id ON user_interactions(guide_id);
CREATE INDEX idx_premium_unlocks_user_id ON premium_unlocks(user_id);
CREATE INDEX idx_premium_unlocks_active ON premium_unlocks(user_id, is_active);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_legal_guides_updated_at BEFORE UPDATE ON legal_guides
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial legal guides data
INSERT INTO legal_guides (title, category, content, is_premium) VALUES
(
    'Police Stop Rights',
    'police_stop',
    '{
        "summary": "Know your rights during a police traffic stop or encounter",
        "rights": [
            "You have the right to remain silent",
            "You have the right to refuse searches (except pat-downs for weapons)",
            "You have the right to ask if you are free to leave",
            "You have the right to record the interaction",
            "You have the right to an attorney if arrested"
        ],
        "dos": [
            "Keep your hands visible",
            "Stay calm and polite",
            "Provide required documents when driving",
            "Clearly state if you are exercising your rights",
            "Remember details for later"
        ],
        "donts": [
            "Do not resist, even if you believe the stop is unfair",
            "Do not argue or become confrontational",
            "Do not consent to searches",
            "Do not lie or provide false information",
            "Do not reach for items without permission"
        ]
    }',
    false
),
(
    'Tenant Rights',
    'tenant',
    '{
        "summary": "Understand your rights as a tenant regarding evictions and repairs",
        "rights": [
            "Right to proper notice before eviction (usually 30 days)",
            "Right to a habitable living space",
            "Right to privacy and advance notice for inspections",
            "Right to return of security deposit",
            "Right to organize with other tenants"
        ],
        "eviction": [
            "Landlord must provide written notice",
            "You have the right to contest the eviction in court",
            "Landlord cannot change locks or shut off utilities",
            "You may have right to cure violations",
            "Emergency financial assistance may be available"
        ],
        "repairs": [
            "Document all repair requests in writing",
            "Landlord has reasonable time to make repairs",
            "You may have right to withhold rent for major issues",
            "You may have right to make repairs and deduct costs",
            "Report health and safety violations to authorities"
        ]
    }',
    false
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_unlocks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see and modify their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth.uid()::text = id::text));

CREATE POLICY "Users can insert own subscriptions" ON subscriptions
    FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE auth.uid()::text = id::text));

CREATE POLICY "Users can update own subscriptions" ON subscriptions
    FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE auth.uid()::text = id::text));

CREATE POLICY "Users can delete own subscriptions" ON subscriptions
    FOR DELETE USING (user_id IN (SELECT id FROM users WHERE auth.uid()::text = id::text));

-- Daily expenses policies
CREATE POLICY "Users can view own expenses" ON daily_expenses
    FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth.uid()::text = id::text));

CREATE POLICY "Users can insert own expenses" ON daily_expenses
    FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE auth.uid()::text = id::text));

CREATE POLICY "Users can update own expenses" ON daily_expenses
    FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE auth.uid()::text = id::text));

CREATE POLICY "Users can delete own expenses" ON daily_expenses
    FOR DELETE USING (user_id IN (SELECT id FROM users WHERE auth.uid()::text = id::text));

-- Legal guides are public for reading
CREATE POLICY "Anyone can view legal guides" ON legal_guides
    FOR SELECT USING (true);

-- User interactions policies
CREATE POLICY "Users can view own interactions" ON user_interactions
    FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth.uid()::text = id::text));

CREATE POLICY "Users can insert own interactions" ON user_interactions
    FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE auth.uid()::text = id::text));

-- Premium unlocks policies
CREATE POLICY "Users can view own premium unlocks" ON premium_unlocks
    FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth.uid()::text = id::text));

CREATE POLICY "Users can insert own premium unlocks" ON premium_unlocks
    FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE auth.uid()::text = id::text));
