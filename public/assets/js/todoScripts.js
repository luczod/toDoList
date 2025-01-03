// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const editInputId = document.querySelector("#edit-id");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;

// inicio Funções
const saveTodo = async (text, done = 0, save = 1) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(deleteBtn);

  // Utilizando dados da localStorage
  if (done) {
    todo.classList.add("done");
  }

  if (save) {
    const req = await fetch("todo/save", {
      method: "POST",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        text,
      }),
    });
    // messagem de error
    if (!req.ok) {
      try {
        let resTemp = await req.json();
        Swal.fire({
          title: "Erro!",
          text: resTemp.msg,
          icon: "error",
        });

        return;
      } catch (error) {
        console.log(error.message);
        Swal.fire({
          title: "Erro!",
          text: req.status,
          icon: "error",
        });
        return;
      }
    }

    const res = await req.json();

    saveTodoLocalStorage({ id: res.id, text, done: false });

    todo.setAttribute("data-id", res.id);
  }

  todoList.appendChild(todo);

  todoInput.value = "";
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

const updateTodo = async (text, taskId) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");

    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = text;

      // Utilizando dados da localStorage
      updateTodoLocalStorage(oldInputValue, text);
    }
  });

  const req = await fetch("todo/edit", {
    method: "POST",
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify({
      text,
      taskId,
    }),
  });
  // messagem de error
  if (!req.ok) {
    try {
      const res = await req.json();
      Swal.fire({
        title: "Erro!",
        text: res.msg,
        icon: "error",
      });

      return;
    } catch (error) {
      console.log(error.message);

      Swal.fire({
        title: "Erro!",
        text: req.status,
        icon: "error",
      });
      return;
    }
  }
};

const getSearchedTodos = (search) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    const todoTitle = todo.querySelector("h3").innerText.toLowerCase();

    todo.style.display = "flex";

    console.log(todoTitle);

    if (!todoTitle.includes(search)) {
      todo.style.display = "none";
    }
  });
};

const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo");

  switch (filterValue) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));
      break;

    case "done":
      todos.forEach((todo) =>
        todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );

      break;

    case "todo":
      todos.forEach((todo) =>
        !todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;

    default:
      break;
  }
};
// fim Funções

// inicio Eventos
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;

  if (inputValue) {
    saveTodo(inputValue);
  }
});

document.addEventListener("click", async (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerText || "";
  }

  if (targetEl.classList.contains("finish-todo")) {
    parentEl.classList.toggle("done");
    let taskId = parentEl.dataset.id;

    updateTodoStatusLocalStorage(taskId);
  }

  if (targetEl.classList.contains("remove-todo")) {
    let taskId = parentEl.dataset.id;
    const req = await fetch("todo/delete", {
      method: "POST",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        taskId,
      }),
    });
    // messagem de error
    if (!req.ok) {
      try {
        const res = await req.json();
        Swal.fire({
          title: "Erro!",
          text: res.msg,
          icon: "error",
        });

        return;
      } catch (error) {
        console.log(error.message);

        Swal.fire({
          title: "Erro!",
          text: req.status,
          icon: "error",
        });
        return;
      }
    }

    parentEl.remove();

    // Utilizando dados da localStorage
    removeTodoLocalStorage(todoTitle);
  }

  if (targetEl.classList.contains("edit-todo")) {
    let task = parentEl.dataset.id;
    editInputId.value = task;

    toggleForms();

    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const editInputValue = editInput.value;

  if (editInputValue) {
    updateTodo(editInputValue, editInputId.value);
  }

  toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;

  getSearchedTodos(search);
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();

  searchInput.value = "";

  searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;

  filterTodos(filterValue);
});
// fim Eventos

// inicio Local Storage
const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  return todos;
};

const loadTodos = () => {
  // const todos = getTodosLocalStorage();
  const todoList = document.getElementById("todo-list");
  const todoContent = JSON.parse(todoList.dataset.content);

  todoContent.forEach((todo) => {
    let done = todo.completed;
    saveTodoLocalStorage({ id: todo.id, text: todo.title, done });
  });
};

const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage();
  const exists = todos.some(
    (item) => item.id === todo.id && item.text === todo.text
  );

  if (exists) return;

  todos.push(todo);

  localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTodoLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  const filteredTodos = todos.filter((todo) => todo.text != todoText);

  localStorage.setItem("todos", JSON.stringify(filteredTodos));
};

const updateTodoStatusLocalStorage = async (taskId) => {
  const todos = getTodosLocalStorage();
  let completed = false;

  todos.map((todo) => {
    if (todo.id === +taskId) {
      todo.done = !todo.done;
      completed = todo.done;
    }
  });

  let req = await fetch("todo/complate", {
    method: "POST",
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify({
      taskId,
      completed,
    }),
  });
  // messagem de error
  if (!req.ok) {
    try {
      const res = await req.json();
      Swal.fire({
        title: "Erro!",
        text: res.msg,
        icon: "error",
      });

      return;
    } catch (error) {
      console.log(error.message);

      Swal.fire({
        title: "Erro!",
        text: req.status,
        icon: "error",
      });
      return;
    }
  }

  localStorage.setItem("todos", JSON.stringify(todos));
};

const updateTodoLocalStorage = (todoOldText, todoNewText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoOldText ? (todo.text = todoNewText) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};
// fim Local Storage
loadTodos();
