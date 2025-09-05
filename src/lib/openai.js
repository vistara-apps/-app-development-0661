import OpenAI from 'openai';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Initialize OpenAI client
const openai = OPENAI_API_KEY ? new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
}) : null;

// Check if OpenAI is available
export const isOpenAIAvailable = () => {
  return !!OPENAI_API_KEY;
};

// Simplify legal text for better understanding
export const simplifyLegalText = async (legalText, userContext = '') => {
  try {
    if (!isOpenAIAvailable()) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = `
Please simplify the following legal information for a general audience. 
Make it easy to understand while keeping all important details.
${userContext ? `Context: ${userContext}` : ''}

Legal text to simplify:
${legalText}

Please provide:
1. A simple summary
2. Key points in plain English
3. What this means for the average person
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful legal assistant that explains complex legal concepts in simple, accessible language. Always emphasize that this is educational information and not legal advice.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.3
    });

    return {
      success: true,
      data: response.choices[0].message.content
    };
  } catch (error) {
    console.error('Error simplifying legal text:', error);
    return {
      success: false,
      error: error.message || 'Failed to simplify legal text'
    };
  }
};

// Generate personalized legal advice based on user situation
export const generateLegalGuidance = async (situation, category = 'general') => {
  try {
    if (!isOpenAIAvailable()) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = `
A user is asking for guidance about: ${situation}
Category: ${category}

Please provide:
1. Immediate steps they should take
2. Their key rights in this situation
3. What to avoid doing
4. When to seek professional legal help

Keep the advice practical, actionable, and emphasize this is educational information only.
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a knowledgeable legal education assistant. Provide helpful, accurate information while always emphasizing that users should consult with qualified attorneys for specific legal advice. Focus on general rights and procedures.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 600,
      temperature: 0.4
    });

    return {
      success: true,
      data: response.choices[0].message.content
    };
  } catch (error) {
    console.error('Error generating legal guidance:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate legal guidance'
    };
  }
};

// Categorize and analyze expenses for budget insights
export const analyzeBudgetExpenses = async (expenses, subscriptions) => {
  try {
    if (!isOpenAIAvailable()) {
      throw new Error('OpenAI API key not configured');
    }

    const expenseData = {
      daily_expenses: expenses.slice(-30), // Last 30 expenses
      subscriptions: subscriptions,
      total_monthly_subscriptions: subscriptions.reduce((total, sub) => {
        if (sub.frequency === 'monthly') return total + parseFloat(sub.cost);
        if (sub.frequency === 'yearly') return total + (parseFloat(sub.cost) / 12);
        return total;
      }, 0)
    };

    const prompt = `
Analyze this user's spending data and provide insights:
${JSON.stringify(expenseData, null, 2)}

Please provide:
1. Spending patterns and trends
2. Areas where they could save money
3. Budget recommendations
4. Subscription optimization suggestions

Keep advice practical and actionable.
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful financial advisor assistant. Analyze spending data and provide practical, actionable budget advice. Be encouraging and focus on realistic improvements.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.3
    });

    return {
      success: true,
      data: response.choices[0].message.content
    };
  } catch (error) {
    console.error('Error analyzing budget:', error);
    return {
      success: false,
      error: error.message || 'Failed to analyze budget'
    };
  }
};

// Mock AI responses for development
export const mockAIResponse = (type) => {
  const responses = {
    simplify: "This legal concept means you have the right to remain silent and ask for a lawyer. In simple terms: don't say anything that might hurt your case, and always ask for legal help if you're in trouble.",
    guidance: "Based on your situation, here are the key steps: 1) Document everything, 2) Know your rights, 3) Seek professional help if needed. Remember, this is educational information only.",
    budget: "Your spending shows you could save about $50/month by reviewing your subscriptions. Consider canceling services you don't use regularly and look for better deals on essentials."
  };
  
  return {
    success: true,
    data: responses[type] || "AI analysis would appear here in production."
  };
};
