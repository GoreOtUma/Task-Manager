import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../core/taskManager';
import { loadTasks, saveTasks } from '../storage/storage';

interface TasksState {
  tasks: Task[];
  editingTask: Task | null;
}

const initialState: TasksState = {
  tasks: loadTasks(),
  editingTask: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
      saveTasks(state.tasks);
    },
    editTask: (state, action: PayloadAction<Task>) => {
      state.editingTask = action.payload;
    },
    saveTask: (state, action: PayloadAction<Task>) => {
      state.tasks = state.tasks.map(task =>
        task.id === action.payload.id ? action.payload : task
      );
      state.editingTask = null;
      saveTasks(state.tasks);
    },
    deleteTask: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      saveTasks(state.tasks);
    },
    toggleCompleted: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.map(task =>
        task.id === action.payload ? { ...task, completed: !task.completed } : task
      );
      saveTasks(state.tasks);
    },
    cancelEditing: (state) => {
      state.editingTask = null;
    },
  },
});

export const { addTask, editTask, saveTask, deleteTask, toggleCompleted, cancelEditing } = tasksSlice.actions;
export default tasksSlice.reducer;