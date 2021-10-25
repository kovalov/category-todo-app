const categoryForm = document.querySelector(".card__form--category");
const categoryInput = document.querySelector(".card__control--category");
const grid = document.querySelector(".card-grid");
const clearButton = document.querySelector(".button--clear");

function loadEventListeners() {
  addNewCategory();
  addNewTask();
  clearSavedTasks();
  deleteCard();
  deleteCurrentTask();
}

loadEventListeners();

function deleteCurrentTask() {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("button--delete-task")) {
      const taskId = e.target.parentElement.dataset.id;
      const categoryId =
        e.target.parentElement.parentElement.parentElement.parentElement.dataset
          .id;
      deleteTask(categoryId, taskId);
    }
  });
}

function deleteCard() {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("button--delete")) {
      const tasksArray = loadLocalTasks();
      const categoryId =
        e.target.parentElement.parentElement.parentElement.dataset.id;
      const categoryIndex = Array.from(grid.children).findIndex(
        (el) => el.dataset.id === categoryId
      );
      grid.children[categoryIndex].remove();
      deleteCategory(categoryId);
    }
  });
}

function clearSavedTasks() {
  clearButton.addEventListener("click", () => {
    const confirmation = confirm("Do you want to clear all tasks?");
    if (confirmation) {
      clearTasks();
      initLocalTasks();
      clearCards();
    }
  });
}

function addNewCategory() {
  categoryForm.addEventListener("submit", (e) => {
    if (categoryInput.value) {
      initCategory(categoryInput.value);
    }

    categoryInput.value = "";
    e.preventDefault();
  });
}

function addNewTask() {
  document.addEventListener("submit", (e) => {
    if (e.target.classList.contains("card__form--task")) {
      const taskValue = e.target.children[0].value;
      if (taskValue) {
        const categoryId = Number(
          e.target.parentElement.parentElement.dataset.id
        );
        initTask(categoryId, taskValue);
      }
    }

    e.target.children[0].value = "";
    e.preventDefault();
  });
}

function initCategory(title) {
  const newCategory = createCategory(title);
  saveCategory(newCategory);
  const newCard = createCategoryCard(newCategory);
  appendCard(newCard);
}

function initTask(categoryId, value) {
  const newTask = createTask(value);
  saveTask(categoryId, newTask);
  createListElement(categoryId, newTask);
}

function createCategoryCard(category) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.id = category.id;
  card.innerHTML = `<div class="card__header">
               <span class="card__title">${category.title}</span>
             <span class="card__counter">0/0</span>
            </div>
            <div class="card__body">
              <form class="card__form card__form--task">
                 <input
                 type="text"
                  class="card__control"
                   placeholder="Create new task"
                />
                <input
                  type="submit"
                  value="Add"
                  class="card__submit button card__button button--submit"
                />
              </form>
              <ul class="card__list"></ul>
              <div class="card__action">
              <button class="card__button card__button--delete button button--delete">Delete card</button>
              </div>
            </div>`;
  return card;
}

function appendCard(element) {
  grid.appendChild(element);
}

function appendListElement(list, element) {
  list.appendChild(element);
}

function createListElement(categoryId, task) {
  const li = document.createElement("li");
  li.textContent = task.desc;
  li.classList.add("card__item");
  li.dataset.id = task.id;
  li.innerHTML += `<button class="button card__button button--delete-task">Delete</button>`;

  const card = document.querySelector(`.card[data-id="${categoryId}"]`);
  const list = card.children[1].children[1];
  appendListElement(list, li);
}

function createCategory(title) {
  return {
    title,
    id: generateId(),
    tasks: [],
  };
}

function createTask(desc) {
  return {
    desc,
    id: generateId(),
    isCompleted: false,
  };
}

function loadLocalTasks() {
  let tasks;
  if (localStorage.getItem("tasks") === null) tasks = [];
  else tasks = JSON.parse(localStorage.getItem("tasks"));
  return tasks;
}

function updateLocalTasks(array) {
  localStorage.setItem("tasks", JSON.stringify(array));
}

function generateId() {
  return Number(String(Math.floor(Math.random() * Date.now())).slice(0, 5));
}

function saveCategory(categoryName) {
  const tasksArray = loadLocalTasks();
  tasksArray.push(categoryName);
  updateLocalTasks(tasksArray);
}

function saveTask(categoryId, task) {
  const tasksArray = loadLocalTasks();
  const index = tasksArray.findIndex((c) => c.id === categoryId);
  tasksArray[index].tasks.push(task);
  updateLocalTasks(tasksArray);
}

function deleteCategory(categoryId) {
  const tasksArray = loadLocalTasks();
  const categoryIndex = tasksArray.findIndex((c) => c.id === categoryId);
  tasksArray.splice(categoryIndex, 1);
  localStorage.setItem("tasks", JSON.stringify(tasksArray));
}

function deleteTask(categoryId, taskId) {
  const tasksArray = loadLocalTasks();
  const categoryIndex = tasksArray.findIndex(
    (c) => c.id === Number(categoryId)
  );
  const taskIndex = tasksArray[categoryIndex].tasks.findIndex(
    (t) => t.id === Number(taskId)
  );
  tasksArray[categoryIndex].tasks.splice(taskIndex, 1);
  const list =
    grid.children[Number(categoryIndex)].children[1].children[1].children[0];
  list.children[Number(taskIndex)].parentElement.remove();
  updateLocalTasks(tasksArray);
}

function completeTask(categoryId, taskId) {
  const tasksArray = loadLocalTasks();
  const categoryIndex = tasksArray.findIndex((c) => c.id === categoryId);
  const taskIndex = tasksArray[categoryIndex].tasks.findIndex(
    (t) => t.id === taskId
  );
  tasksArray[categoryIndex].tasks[taskIndex].isCompleted = true;
  updateLocalTasks(tasksArray);
}

function clearTasks() {
  const tasksArray = loadLocalTasks();
  tasksArray.length = 0;
  updateLocalTasks(tasksArray);
}

function clearCards() {
  Array.from(grid.children).forEach((el) => {
    el.remove();
  });
}

function initLocalTasks() {
  const tasksArray = loadLocalTasks();
  tasksArray.forEach((elem) => {
    const category = elem;
    const newCard = createCategoryCard(category);
    appendCard(newCard);

    if (elem.tasks.length) {
      elem.tasks.forEach((t) => {
        const li = document.createElement("li");
        li.textContent = t.desc;
        li.classList.add("card__item");
        li.dataset.id = t.id;

        const list = newCard.children[1].children[1];
        appendListElement(list, li);
      });
    }
  });
}

initLocalTasks();
