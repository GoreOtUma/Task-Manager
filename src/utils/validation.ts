import { Task } from '../core/taskManager';

export const validateTask = (task: Partial<Task>) => {
  const errors: string[] = [];
  
  if (!task.title || task.title.length < 3) {
    errors.push('Title must be at least 3 characters long');
  }

  if (task.dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    
    if (dueDate < today) {
      errors.push('Due date cannot be in the past');
    }
  }

  return errors;
};