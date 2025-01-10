import { useState, useEffect } from "react";
import { TTodo } from "../../utils/typing";
import FormAdd from "../../components/formAdd";
import { FormFilter } from "../../components/formFilter";
import { useAuth } from "../../hooks/auth";

export default function Home() {
  const [todos, setTodos] = useState<TTodo[]>(
    () => JSON.parse(localStorage.getItem("todos") || "[]") as TTodo[]
  );
  const [username] = useState<string>(() => localStorage.getItem("User") || "");
  const { signOut } = useAuth();

  // Salvar todos no localStorage sempre que o estado mudar
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  return (
    <div className="todo-container">
      <header>
        <h1>Lista de Tarefas</h1>
        <h4>&#40;{username}&#41;</h4>
        <span className="signout" onClick={signOut}>
          Sair
        </span>
      </header>
      <br />
      {/* Formulário para adicionar novo todo */}
      <h4>Adicione sua tarefa:</h4>
      <FormAdd setTodos={setTodos} />
      {/* Filtragem e lista de todos  */}
      <FormFilter todos={todos} setTodos={setTodos} />
    </div>
  );
}
