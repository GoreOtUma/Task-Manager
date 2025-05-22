import { Task } from "../core/taskManager";

// Функция для загрузки задач из localStorage
export const loadTasks = (): Task[] => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
};

// Функция для сохранения задач в localStorage
export const saveTasks = (tasks: Task[]): void => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};
