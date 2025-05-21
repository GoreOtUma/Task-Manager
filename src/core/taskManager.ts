// src/core/taskManager.ts

export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    dueDate: string;
    priority: "low" | "medium" | "high";  // Убедитесь, что priority строго типизировано
    tags: string[];
}

// Функция создания задачи
export const createTask = (
    title: string,
    description: string,
    dueDate: string,
    priority: "low" | "medium" | "high",  // Убедитесь, что приоритет передается с корректным типом
    tags: string[]
): Task => {
    return {
        id: Date.now(),
        title,
        description,
        completed: false,
        dueDate,
        priority,  // Приоритет здесь должен быть строго одного из значений
        tags,
    };
};

// Пример редактирования задачи
export const editTask = (
    taskId: number,
    updatedTask: Task,
    tasks: Task[]
): Task[] => {
    return tasks.map((task) =>
        task.id === taskId ? { ...task, ...updatedTask } : task
    );
};

// Пример удаления задачи
export const deleteTask = (taskId: number, tasks: Task[]): Task[] => {
    return tasks.filter((task) => task.id !== taskId);
};

// Пример изменения статуса выполнения
export const toggleTaskCompletion = (taskId: number, tasks: Task[]): Task[] => {
    return tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
    );
};
