import axios from 'axios';

const NEYNAR_API_KEY = import.meta.env.VITE_NEYNAR_API_KEY;
const NEYNAR_BASE_URL = 'https://api.neynar.com/v2';

// Create axios instance for Neynar API
const neynarApi = axios.create({
  baseURL: NEYNAR_BASE_URL,
  headers: {
    'api_key': NEYNAR_API_KEY,
    'Content-Type': 'application/json'
  }
});

// Check if Neynar is available
export const isNeynarAvailable = () => {
  return !!NEYNAR_API_KEY;
};

// Get user by FID (Farcaster ID)
export const getUserByFid = async (fid) => {
  try {
    if (!isNeynarAvailable()) {
      throw new Error('Neynar API key not configured');
    }

    const response = await neynarApi.get(`/user/bulk?fids=${fid}`);
    return {
      success: true,
      data: response.data.users[0]
    };
  } catch (error) {
    console.error('Error fetching user by FID:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

// Verify Farcaster signature
export const verifyFarcasterSignature = async (message, signature, fid) => {
  try {
    if (!isNeynarAvailable()) {
      throw new Error('Neynar API key not configured');
    }

    const response = await neynarApi.post('/auth/verify', {
      message,
      signature,
      fid
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error verifying Farcaster signature:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

// Get user's casts (posts)
export const getUserCasts = async (fid, limit = 10) => {
  try {
    if (!isNeynarAvailable()) {
      throw new Error('Neynar API key not configured');
    }

    const response = await neynarApi.get(`/casts?fid=${fid}&limit=${limit}`);
    return {
      success: true,
      data: response.data.casts
    };
  } catch (error) {
    console.error('Error fetching user casts:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

// Create a cast (post)
export const createCast = async (text, signerUuid) => {
  try {
    if (!isNeynarAvailable()) {
      throw new Error('Neynar API key not configured');
    }

    const response = await neynarApi.post('/casts', {
      text,
      signer_uuid: signerUuid
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error creating cast:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

// Mock authentication for development
export const mockFarcasterAuth = () => {
  return {
    success: true,
    data: {
      fid: 12345,
      username: 'demo_user',
      display_name: 'Demo User',
      pfp_url: 'https://via.placeholder.com/150',
      bio: 'Demo user for development',
      follower_count: 100,
      following_count: 50
    }
  };
};
