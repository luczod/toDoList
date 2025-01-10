import { useState } from "react";
import { TTodo, TUseTodo } from "../utils/typing";

export default function FormAdd({ setTodos }: Pick<TUseTodo, "setTodos">) {
  const [newTodo, setNewTodo] = useState<string>("");

  // Função para adicionar um novo todo
  const addTodo = (text: string) => {
    const newTodo: TTodo = { id: self.crypto.randomUUID(), text, done: false };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
    setNewTodo(""); // Limpa o campo de input
  };

  // Função para adicionar usando a tecla enter
  const handlerEnter = (key: string) => {
    if (key === "Enter") {
      addTodo(newTodo);
    }
  };

  return (
    <div className="form-control">
      <input
        id="todo-input"
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="O que você vai fazer?"
        onKeyUp={(e) => handlerEnter(e.key)}
      />
      <button onClick={() => addTodo(newTodo)} disabled={!newTodo}>
        <span className="visually-hidden">Submit</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          width={20}
          height={20}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
    </div>
  );
}
