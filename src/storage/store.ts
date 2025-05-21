import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Тип задачи
interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
    tags: string[];
}

// Структура состояния задач
interface TasksState {
    tasks: Task[];
}

// Изначальное состояние
const initialState: TasksState = {
    tasks: [],
};

// Создание слайса задач (состояние и действия)
const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<Task>) => {
            state.tasks.push(action.payload);
        },
        deleteTask: (state, action: PayloadAction<number>) => {
            state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        },
        updateTask: (state, action: PayloadAction<Task>) => {
            const index = state.tasks.findIndex((task) => task.id === action.payload.id);
            if (index !== -1) {
                state.tasks[index] = action.payload;
            }
        },
        setTasks: (state, action: PayloadAction<Task[]>) => {
            state.tasks = action.payload;
        },
    },
});

// Экспортируем действия
export const { addTask, deleteTask, updateTask, setTasks } = tasksSlice.actions;

// Создаем store
export const store = configureStore({
    reducer: {
        tasks: tasksSlice.reducer,
    },
});

