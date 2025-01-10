import React from "react";

// Definindo tipos
export type TTodo = {
  id: string;
  text: string;
  done: boolean;
};

export type TUseTodo = {
  todos: TTodo[];
  setTodos: React.Dispatch<React.SetStateAction<TTodo[]>>;
};

export type TList = {
  filteredTodos: TTodo[];
  setTodos: React.Dispatch<React.SetStateAction<TTodo[]>>;
};
