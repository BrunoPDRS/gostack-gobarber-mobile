/* eslint-disable @typescript-eslint/ban-types */
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-community/async-storage';
import api from "../services/api";

interface AuthState {
  token: string;
  user: object;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: object;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);

  useEffect(() => {
    const loadStoragedData = async (): Promise<void> => {
      const [[,token], [,user]] = await AsyncStorage.multiGet([
        "@GoBarber:token",
        "@GoBarber:user",
      ]);

      if (token && user) {
        setData({
          token,
          user: JSON.parse(user)
        });
      }
    }
    loadStoragedData();
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post("sessions", {
      email,
      password,
    });

    const { token, user } = response.data;

    await AsyncStorage.multiSet([
      ["@GoBarber:token", token],
      ["@GoBarber:user", JSON.stringify(user)],
    ]);

    setData({ token, user });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove([
      "@GoBarber:token",
      "@GoBarber:user",
    ]);

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider!");
  }

  return context;
};
