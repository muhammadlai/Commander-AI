import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session, AuthProvider } from '../types';
import { apiService } from '../services/apiService';
import { APP_CONFIG } from '../config/appConfig';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (provider: AuthProvider, name?: string, email?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProviderComponent: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(APP_CONFIG.defaultUser as User);
  const [session, setSession] = useState<Session | null>({
    id: 'sess_default_01',
    userId: APP_CONFIG.defaultUser.id,
    token: 'jwt_cmdr_default',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
    device: 'Chrome on macOS (Apple Silicon)',
    ipAddress: '192.168.1.104',
    active: true,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    async function loadSession() {
      try {
        const data = await apiService.getSession();
        if (data && data.user) {
          setUser(data.user);
          setSession(data.session);
        }
      } catch (err) {
        console.warn('Backend server session fallback initialized:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSession();
  }, []);

  const login = async (provider: AuthProvider, name?: string, email?: string) => {
    setIsLoading(true);
    try {
      const data = await apiService.login(provider === 'guest' ? 'google' : provider, name, email);
      setUser(data.user);
      setSession(data.session);
    } catch (err) {
      console.error('Login error:', err);
      // Fallback local update if server delayed
      const mockUser: User = {
        id: 'usr_' + Math.random().toString(36).substring(2, 8),
        name: name || (provider === 'github' ? 'Octocat Developer' : 'Google Cloud Engineer'),
        email: email || (provider === 'github' ? 'octocat@github.com' : 'engineer@google.com'),
        avatar: provider === 'github' 
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        provider,
        role: 'Architect',
        createdAt: new Date().toISOString(),
        status: 'active',
      };
      setUser(mockUser);
    } finally {
      setIsLoading(false);
      setAuthModalOpen(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser(null);
    setSession(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    try {
      const updated = await apiService.updateUserProfile(updates);
      setUser(updated);
    } catch (err) {
      console.error('Update profile error:', err);
      setUser(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        login,
        logout,
        updateUser,
        isAuthModalOpen,
        setAuthModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProviderComponent');
  }
  return context;
};
