import React, { createContext, useState, ReactNode } from 'react';

export interface User {
    first_name: string;
    last_name: string;
    email: string;
    colorPref: string;
    avatar: string; // 'cat', 'dog'...
  }

interface UserContextProps {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
}

const defaultUser: User = {
  first_name: 'default',
  last_name: 'default',
  email: 'default',
  colorPref: 'light',
  avatar: 'default', // 'cat', 'dog'...
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