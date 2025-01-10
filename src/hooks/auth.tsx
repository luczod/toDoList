import React, { createContext, useState, useContext } from "react";
import md5 from "md5";
import { handlerToast } from "./msg";

type TAuthContext = {
  logged: boolean;
  signIn(email: string, password: string): void;
  registerIn(
    username: string,
    email: string,
    password: string,
    confirmpassword: string
  ): void;
  signOut(): void;
};

const AuthContext = createContext<TAuthContext>({} as TAuthContext);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [logged, setLogged] = useState<boolean>(() => {
    const isLogged = localStorage.getItem("@my-list:logged");
    return !!isLogged;
  });

  const registerIn = (
    username: string,
    email: string,
    password: string,
    confirmpassword: string
  ) => {
    if (password !== confirmpassword) {
      return handlerToast("Senha e confimar senha, não são iguais!", "error");
    }

    localStorage.setItem("User", username);
    localStorage.setItem("Email", email);
    localStorage.setItem("Password", md5(password));
    handlerToast("Usuario Cadastrado com sucesso!", "success");
  };

  const signIn = (email: string, password: string) => {
    const userEmail = localStorage.getItem("Email");
    const pass = localStorage.getItem("Password");

    if (userEmail === email && pass === md5(password)) {
      localStorage.setItem("@my-list:logged", "true"); // verificar autenticação
      setLogged(true);
    } else {
      handlerToast("Senha ou usuário inválidos!", "error");
    }
  };

  // limpar sessão do usuário
  const signOut = () => {
    localStorage.removeItem("@my-list:logged");
    localStorage.removeItem("User");
    localStorage.removeItem("Email");
    localStorage.removeItem("Password");
    localStorage.removeItem("todos");
    setLogged(false);
  };

  return (
    <AuthContext.Provider value={{ logged, registerIn, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth(): TAuthContext {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth };
