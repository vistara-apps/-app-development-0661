import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';
import Card from './Card';
import { User, LogOut, Settings, Wallet } from 'lucide-react';

const AuthButton = () => {
  const { user, loading, loginWithDemo, logout, isAuthenticated } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogin = async () => {
    // For now, use demo login. In production, this would trigger Farcaster auth
    await loginWithDemo();
  };

  const handleLogout = async () => {
    await logout();
    setShowProfile(false);
  };

  if (loading) {
    return (
      <Button variant="secondary" disabled>
        Loading...
      </Button>
    );
  }

  if (!isAuthenticated) {
    return (
      <Button variant="primary" onClick={handleLogin}>
        <User size={16} />
        Connect Farcaster
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="secondary"
        onClick={() => setShowProfile(!showProfile)}
        className="flex items-center gap-2"
      >
        <img
          src={user.pfp_url}
          alt={user.display_name}
          className="w-6 h-6 rounded-full"
        />
        <span className="hidden sm:inline">{user.display_name}</span>
      </Button>

      {showProfile && (
        <div className="absolute right-0 top-full mt-2 z-50">
          <Card className="w-64 p-4 bg-white shadow-lg border">
            {/* User Info */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={user.pfp_url}
                alt={user.display_name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary">{user.display_name}</h3>
                <p className="text-sm text-text-secondary">@{user.username}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-lg font-semibold text-text-primary">{user.follower_count}</p>
                <p className="text-xs text-text-secondary">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-text-primary">{user.following_count}</p>
                <p className="text-xs text-text-secondary">Following</p>
              </div>
            </div>

            {/* Wallet Address */}
            {user.wallet_address && (
              <div className="mb-4 p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Wallet size={14} />
                  <span className="text-xs font-medium text-text-secondary">Wallet</span>
                </div>
                <p className="text-xs font-mono text-text-primary">
                  {user.wallet_address.slice(0, 6)}...{user.wallet_address.slice(-4)}
                </p>
              </div>
            )}

            {/* Bio */}
            {user.bio && (
              <div className="mb-4">
                <p className="text-sm text-text-primary">{user.bio}</p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              <Button
                variant="secondary"
                className="w-full justify-start"
                onClick={() => {
                  // TODO: Implement settings modal
                  console.log('Settings clicked');
                }}
              >
                <Settings size={16} />
                Settings
              </Button>
              
              <Button
                variant="secondary"
                className="w-full justify-start text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Overlay to close profile */}
      {showProfile && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowProfile(false)}
        />
      )}
    </div>
  );
};

export default AuthButton;
