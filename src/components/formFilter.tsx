import { useMemo, useState } from "react";
import { TUseTodo } from "../utils/typing";
import { ListToDo } from "./listToDo";

export function FormFilter({ todos, setTodos }: TUseTodo) {
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");

  // Filtrando os todos com base no filtro e na busca
  const filteredTodos = useMemo(() => {
    return todos
      .filter((todo) => {
        if (filter === "done") return todo.done;
        if (filter === "todo") return !todo.done;
        return true;
      })
      .filter((todo) => todo.text.toLowerCase().includes(search.toLowerCase()));
  }, [todos, search, filter]);

  return (
    <>
      <div id="toolbar">
        {/* Filtro de pesquisa */}
        <div id="search">
          <h4>Pesquisar:</h4>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
          />
        </div>

        {/* Filtro de status */}
        <div id="filter">
          <h4>Filtrar:</h4>
          <select
            id="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="done">Feitos</option>
            <option value="todo">A fazer</option>
          </select>
        </div>
      </div>
      {/* lista de todos  */}
      <ListToDo filteredTodos={filteredTodos} setTodos={setTodos} />
    </>
  );
}
