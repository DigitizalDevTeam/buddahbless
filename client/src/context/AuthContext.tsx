import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (provider: string, userData?: Partial<User>) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (provider: string, userData?: Partial<User>) => {
    // Mock login functionality
    const mockUser: User = {
      name: userData?.name || "Guest User",
      email: userData?.email || "guest@example.com",
      avatar: userData?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Buddah" 
    };
    
    setUser(mockUser);
    console.log(`Logged in with ${provider}`);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
