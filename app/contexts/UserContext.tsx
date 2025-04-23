import React, { createContext, useState, ReactNode } from 'react';

export interface User {
    email: number;
    avatar: string; // 'cat', 'dog'...
    themePreference: string; //'light', 'dark'
  }

interface UserContextProps {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
}

const defaultUser: User = {
    email: 1,
    avatar: 'default',
    themePreference: 'light',
}

export const UserContext = createContext<UserContextProps>({
    user: defaultUser,
    setUser: () => {},
});

interface UserProviderProps {
    children: ReactNode;
  }


export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
  );
};