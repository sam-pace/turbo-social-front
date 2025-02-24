import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from 'app/hooks/useAuth';
import { ApolloProvider } from '@apollo/client';
import client from 'backend/apolloClient';

const AuthContext = createContext({
  isAuthenticated: false,
  loading: true,
  loginUser: async (username: string, password: string) => {},
  logoutUser: async () => {},
});

export const AuthProvider = ({ children }) => {
  const auth = useAuth();

  return (
    <ApolloProvider client={client}>
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
    </ApolloProvider>
);
};

export const useAuthContext = () => useContext(AuthContext);