export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    dueDate: string;
    priority: "low" | "medium" | "high";  
    tags: string[];
}

// Создание задачи
export const createTask = (
    title: string,
    description: string,
    dueDate: string,
    priority: "low" | "medium" | "high",  
    tags: string[]
): Task => {
    return {
        id: Date.now(),
        title,
        description,
        completed: false,
        dueDate,
        priority,  
        tags,
    };
};

// Редактирование задачи
export const editTask = (
    taskId: number,
    updatedTask: Task,
    tasks: Task[]
): Task[] => {
    return tasks.map((task) =>
        task.id === taskId ? { ...task, ...updatedTask } : task
    );
};

// Удаление задачи
export const deleteTask = (taskId: number, tasks: Task[]): Task[] => {
    return tasks.filter((task) => task.id !== taskId);
};

// Изменение статуса выполнения
export const toggleTaskCompletion = (taskId: number, tasks: Task[]): Task[] => {
    return tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
    );
};
