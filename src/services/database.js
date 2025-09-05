import { supabase, isSupabaseAvailable, TABLES, handleSupabaseError, handleSupabaseSuccess } from '../lib/supabase';

// Fallback to localStorage when Supabase is not available
const STORAGE_KEYS = {
  SUBSCRIPTIONS: 'pocket_legal_subscriptions',
  EXPENSES: 'pocket_legal_expenses',
  USER_INTERACTIONS: 'pocket_legal_interactions',
  PREMIUM_UNLOCKS: 'pocket_legal_premium'
};

// Helper function to get user ID
const getCurrentUserId = () => {
  const user = JSON.parse(localStorage.getItem('pocket_legal_user') || '{}');
  return user.id || user.fid || 'demo_user';
};

// Subscription Management
export const subscriptionService = {
  async getAll(userId = null) {
    const currentUserId = userId || getCurrentUserId();
    
    if (isSupabaseAvailable()) {
      try {
        const { data, error } = await supabase
          .from(TABLES.SUBSCRIPTIONS)
          .select('*')
          .eq('user_id', currentUserId)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) return handleSupabaseError(error);
        return handleSupabaseSuccess(data);
      } catch (error) {
        return handleSupabaseError(error);
      }
    } else {
      // Fallback to localStorage
      const subscriptions = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS) || '[]');
      return handleSupabaseSuccess(subscriptions);
    }
  },

  async create(subscription, userId = null) {
    const currentUserId = userId || getCurrentUserId();
    
    const newSubscription = {
      ...subscription,
      user_id: currentUserId,
      id: Date.now().toString(),
      start_date: new Date().toISOString(),
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseAvailable()) {
      try {
        const { data, error } = await supabase
          .from(TABLES.SUBSCRIPTIONS)
          .insert(newSubscription)
          .select()
          .single();

        if (error) return handleSupabaseError(error);
        return handleSupabaseSuccess(data);
      } catch (error) {
        return handleSupabaseError(error);
      }
    } else {
      // Fallback to localStorage
      const subscriptions = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS) || '[]');
      subscriptions.push(newSubscription);
      localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subscriptions));
      return handleSupabaseSuccess(newSubscription);
    }
  },

  async delete(subscriptionId, userId = null) {
    const currentUserId = userId || getCurrentUserId();

    if (isSupabaseAvailable()) {
      try {
        const { error } = await supabase
          .from(TABLES.SUBSCRIPTIONS)
          .update({ is_active: false })
          .eq('id', subscriptionId)
          .eq('user_id', currentUserId);

        if (error) return handleSupabaseError(error);
        return handleSupabaseSuccess({ id: subscriptionId });
      } catch (error) {
        return handleSupabaseError(error);
      }
    } else {
      // Fallback to localStorage
      const subscriptions = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS) || '[]');
      const filteredSubscriptions = subscriptions.filter(sub => sub.id !== subscriptionId);
      localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(filteredSubscriptions));
      return handleSupabaseSuccess({ id: subscriptionId });
    }
  }
};

// Daily Expenses Management
export const expenseService = {
  async getAll(userId = null, limit = 100) {
    const currentUserId = userId || getCurrentUserId();

    if (isSupabaseAvailable()) {
      try {
        const { data, error } = await supabase
          .from(TABLES.DAILY_EXPENSES)
          .select('*')
          .eq('user_id', currentUserId)
          .order('timestamp', { ascending: false })
          .limit(limit);

        if (error) return handleSupabaseError(error);
        return handleSupabaseSuccess(data);
      } catch (error) {
        return handleSupabaseError(error);
      }
    } else {
      // Fallback to localStorage
      const expenses = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPENSES) || '[]');
      return handleSupabaseSuccess(expenses.slice(0, limit));
    }
  },

  async create(expense, userId = null) {
    const currentUserId = userId || getCurrentUserId();

    const newExpense = {
      ...expense,
      user_id: currentUserId,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    if (isSupabaseAvailable()) {
      try {
        const { data, error } = await supabase
          .from(TABLES.DAILY_EXPENSES)
          .insert(newExpense)
          .select()
          .single();

        if (error) return handleSupabaseError(error);
        return handleSupabaseSuccess(data);
      } catch (error) {
        return handleSupabaseError(error);
      }
    } else {
      // Fallback to localStorage
      const expenses = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPENSES) || '[]');
      expenses.unshift(newExpense);
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
      return handleSupabaseSuccess(newExpense);
    }
  },

  async getByDateRange(startDate, endDate, userId = null) {
    const currentUserId = userId || getCurrentUserId();

    if (isSupabaseAvailable()) {
      try {
        const { data, error } = await supabase
          .from(TABLES.DAILY_EXPENSES)
          .select('*')
          .eq('user_id', currentUserId)
          .gte('timestamp', startDate)
          .lte('timestamp', endDate)
          .order('timestamp', { ascending: false });

        if (error) return handleSupabaseError(error);
        return handleSupabaseSuccess(data);
      } catch (error) {
        return handleSupabaseError(error);
      }
    } else {
      // Fallback to localStorage
      const expenses = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPENSES) || '[]');
      const filtered = expenses.filter(expense => {
        const expenseDate = new Date(expense.timestamp);
        return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
      });
      return handleSupabaseSuccess(filtered);
    }
  }
};

// Legal Guides Management
export const legalGuideService = {
  async getAll() {
    if (isSupabaseAvailable()) {
      try {
        const { data, error } = await supabase
          .from(TABLES.LEGAL_GUIDES)
          .select('*')
          .order('created_at', { ascending: false });

        if (error) return handleSupabaseError(error);
        return handleSupabaseSuccess(data);
      } catch (error) {
        return handleSupabaseError(error);
      }
    } else {
      // Fallback to hardcoded guides
      const guides = [
        {
          id: 'police_stop',
          title: 'Police Stop Rights',
          category: 'police_stop',
          is_premium: false,
          content: {
            summary: "Know your rights during a police traffic stop or encounter",
            rights: [
              "You have the right to remain silent",
              "You have the right to refuse searches (except pat-downs for weapons)",
              "You have the right to ask if you're free to leave",
              "You have the right to record the interaction",
              "You have the right to an attorney if arrested"
            ]
          }
        },
        {
          id: 'tenant',
          title: 'Tenant Rights',
          category: 'tenant',
          is_premium: false,
          content: {
            summary: "Understand your rights as a tenant regarding evictions and repairs",
            rights: [
              "Right to proper notice before eviction (usually 30 days)",
              "Right to a habitable living space",
              "Right to privacy and advance notice for inspections",
              "Right to return of security deposit",
              "Right to organize with other tenants"
            ]
          }
        }
      ];
      return handleSupabaseSuccess(guides);
    }
  },

  async getById(guideId) {
    if (isSupabaseAvailable()) {
      try {
        const { data, error } = await supabase
          .from(TABLES.LEGAL_GUIDES)
          .select('*')
          .eq('id', guideId)
          .single();

        if (error) return handleSupabaseError(error);
        return handleSupabaseSuccess(data);
      } catch (error) {
        return handleSupabaseError(error);
      }
    } else {
      // Fallback logic would go here
      return handleSupabaseError(new Error('Guide not found'));
    }
  }
};

// User Interactions Management
export const interactionService = {
  async create(guideId, interactionType, metadata = {}, userId = null) {
    const currentUserId = userId || getCurrentUserId();

    const interaction = {
      user_id: currentUserId,
      guide_id: guideId,
      interaction_type: interactionType,
      metadata,
      created_at: new Date().toISOString()
    };

    if (isSupabaseAvailable()) {
      try {
        const { data, error } = await supabase
          .from(TABLES.USER_INTERACTIONS)
          .insert(interaction)
          .select()
          .single();

        if (error) return handleSupabaseError(error);
        return handleSupabaseSuccess(data);
      } catch (error) {
        return handleSupabaseError(error);
      }
    } else {
      // Fallback to localStorage
      const interactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_INTERACTIONS) || '[]');
      interaction.id = Date.now().toString();
      interactions.push(interaction);
      localStorage.setItem(STORAGE_KEYS.USER_INTERACTIONS, JSON.stringify(interactions));
      return handleSupabaseSuccess(interaction);
    }
  },

  async getSavedGuides(userId = null) {
    const currentUserId = userId || getCurrentUserId();

    if (isSupabaseAvailable()) {
      try {
        const { data, error } = await supabase
          .from(TABLES.USER_INTERACTIONS)
          .select(`
            *,
            legal_guides (*)
          `)
          .eq('user_id', currentUserId)
          .eq('interaction_type', 'save')
          .order('created_at', { ascending: false });

        if (error) return handleSupabaseError(error);
        return handleSupabaseSuccess(data);
      } catch (error) {
        return handleSupabaseError(error);
      }
    } else {
      // Fallback to localStorage
      const interactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_INTERACTIONS) || '[]');
      const saved = interactions.filter(i => i.interaction_type === 'save');
      return handleSupabaseSuccess(saved);
    }
  }
};

// Premium Features Management
export const premiumService = {
  async getUserUnlocks(userId = null) {
    const currentUserId = userId || getCurrentUserId();

    if (isSupabaseAvailable()) {
      try {
        const { data, error } = await supabase
          .from(TABLES.PREMIUM_UNLOCKS)
          .select('*')
          .eq('user_id', currentUserId)
          .eq('is_active', true);

        if (error) return handleSupabaseError(error);
        return handleSupabaseSuccess(data);
      } catch (error) {
        return handleSupabaseError(error);
      }
    } else {
      // Fallback to localStorage
      const unlocks = JSON.parse(localStorage.getItem(STORAGE_KEYS.PREMIUM_UNLOCKS) || '[]');
      return handleSupabaseSuccess(unlocks);
    }
  },

  async createUnlock(feature, transactionHash, amountPaid, userId = null) {
    const currentUserId = userId || getCurrentUserId();

    const unlock = {
      user_id: currentUserId,
      feature,
      transaction_hash: transactionHash,
      amount_paid: amountPaid,
      currency: 'ETH',
      unlocked_at: new Date().toISOString(),
      is_active: true
    };

    if (isSupabaseAvailable()) {
      try {
        const { data, error } = await supabase
          .from(TABLES.PREMIUM_UNLOCKS)
          .insert(unlock)
          .select()
          .single();

        if (error) return handleSupabaseError(error);
        return handleSupabaseSuccess(data);
      } catch (error) {
        return handleSupabaseError(error);
      }
    } else {
      // Fallback to localStorage
      const unlocks = JSON.parse(localStorage.getItem(STORAGE_KEYS.PREMIUM_UNLOCKS) || '[]');
      unlock.id = Date.now().toString();
      unlocks.push(unlock);
      localStorage.setItem(STORAGE_KEYS.PREMIUM_UNLOCKS, JSON.stringify(unlocks));
      return handleSupabaseSuccess(unlock);
    }
  }
};
