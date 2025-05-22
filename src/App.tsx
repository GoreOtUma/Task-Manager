import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './store';
import { Task } from './core/taskManager';
import AddTask from './ui/AddTask';
import TaskList from './ui/TaskList';
import { createDebouncedFunc, getToday, getStartOfWeek, getEndOfWeek, getStartOfMonth, isSameDay, validateTask } from './utils';
import './App.css';

import {
  addTask,
  editTask,
  saveTask,
  deleteTask,
  toggleCompleted,
  cancelEditing,
} from './store/tasksSlice';
import { setFilter, setGroupBy } from "./store/filterSlice";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, editingTask } = useSelector((state: RootState) => state.tasks);
  const filters = useSelector((state: RootState) => state.filters);

  // Функция для фильтрации задач
  const filteredTasks = tasks.filter((task) => {
    if (filters.status !== "all" && (
      (filters.status === "completed" && !task.completed) || 
      (filters.status === "incomplete" && task.completed)
    )) {
      return false;
    }
    
    if (filters.priority !== "all" && task.priority !== filters.priority) {
      return false;
    }
    
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    if (filters.dueDate !== "all") {
    const taskDueDate = new Date(task.dueDate);
    const today = getToday(); // Используем утилиту
    
    if (filters.dueDate === "today") {
      if (!isSameDay(taskDueDate, today)) return false;
    }
    else if (filters.dueDate === "this-week") {
      const startOfWeek = getStartOfWeek(today);
      const endOfWeek = getEndOfWeek(startOfWeek);
      if (taskDueDate < startOfWeek || taskDueDate > endOfWeek) return false;
    }
    else if (filters.dueDate === "this-month") {
      const startOfMonth = getStartOfMonth(today);
      if (taskDueDate < startOfMonth || taskDueDate > today) return false;
    }
    else if (filters.dueDate === "overdue") {
      if (taskDueDate >= today) return false;
    }
  }
    
    if (filters.tags && !task.tags.some((tag: string) => 
      tag.toLowerCase().includes(filters.tags.toLowerCase()))
    ) {
      return false;
    }

    return true;
  });

  // Функция для группировки задач
  const groupTasks = () => {
    if (filters.groupBy === "priority") {
      const priorities = ["high", "medium", "low"] as const;
      return priorities.map((p) => ({
        group: p,
        tasks: filteredTasks.filter((task) => task.priority === p),
      }));
    } else if (filters.groupBy === "tag") {
      const tagMap: Record<string, Task[]> = {};
      filteredTasks.forEach((task) => {
        task.tags.forEach((tag: string) => {
          if (!tagMap[tag]) tagMap[tag] = [];
          tagMap[tag].push(task);
        });
      });
      return Object.entries(tagMap).map(([tag, tasks]) => ({ group: tag, tasks }));
    } else {
      return [{ group: "All Tasks", tasks: filteredTasks }];
    }
  };

  // debounce для поиска
  const handleSearchChange = createDebouncedFunc((value: string) => {
    dispatch(setFilter({ type: 'search', value }));
  }, 300);
  
  const handleSave = () => {
    if (!editingTask) return;
    
    const errors = validateTask(editingTask);
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }
    dispatch(saveTask(editingTask));
  };

  return (
    <div className="task-manager-container">
      <h1 className="app-title">Task Manager</h1>
      
      <AddTask onAdd={(task) => dispatch(addTask(task))} />
      
      <div className="filters-container">
        <select
          onChange={(e) => dispatch(setFilter({ type: 'status', value: e.target.value }))}
          value={filters.status}
          className={`filter-select ${filters.status !== 'all' ? 'active-filter' : ''}`}
        >
          <option value="all">—</option>
          <option value="completed">Завершенные</option>
          <option value="incomplete">В процессе</option>
        </select>
        
        <select
          onChange={(e) => dispatch(setFilter({ type: 'priority', value: e.target.value }))}
          value={filters.priority}
          className={`filter-select ${filters.priority !== 'all' ? 'active-filter' : ''}`}
        >
          <option value="all">—</option>
          <option value="low">Низкий</option>
          <option value="medium">Средний</option>
          <option value="high">Высокий</option>
        </select>
        
        <select
          onChange={(e) => dispatch(setFilter({ type: 'dueDate', value: e.target.value }))}
          value={filters.dueDate}
          className={`filter-select ${filters.dueDate !== 'all' ? 'active-filter' : ''}`}
        >
          <option value="all">—</option>
          <option value="today">Сегодня</option>
          <option value="this-week">На этой неделе</option>
          <option value="this-month">В этом месяце</option>
          <option value="overdue">Просроченные</option>
        </select>
        
        <select
          value={filters.groupBy}
          onChange={(e) => dispatch(setGroupBy(e.target.value as 'none' | 'priority' | 'tag'))}
          className="group-select"
        >
          <option value="none"></option>
          <option value="priority">Группировать по приоритету</option>
          <option value="tag">Группировать по тегам</option>
        </select>

        <input
          type="text"
          placeholder="Search tasks..."
          onChange={(e) => handleSearchChange(e.target.value)}
          value={filters.search}
          className="search-input"
        />
      </div>
        {editingTask && (
            <div className="modal-overlay">
                <div className="modal-content">
                <div className="modal-header">
                    <h2>Редактирование задачи</h2>
                    <button 
                    onClick={() => dispatch(cancelEditing())}
                    className="modal-close-button"
                    >
                    &times;
                    </button>
                </div>
                
                <div className="modal-body">
                    <div className="form-group">
                    <label>Название:</label>
                    <input
                        type="text"
                        value={editingTask.title}
                        onChange={(e) => dispatch(editTask({ ...editingTask, title: e.target.value }))}
                        className="form-input"
                    />
                    </div>
                    
                    <div className="form-group">
                    <label>Описание:</label>
                    <textarea
                        value={editingTask.description}
                        onChange={(e) => dispatch(editTask({ ...editingTask, description: e.target.value }))}
                        className="form-textarea"
                        rows={4}
                    />
                    </div>
                    
                    <div className="form-group">
                    <label>Срок выполнения:</label>
                    <input
                        type="date"
                        value={editingTask.dueDate}
                        onChange={(e) => dispatch(editTask({ ...editingTask, dueDate: e.target.value }))}
                        className="form-input"
                    />
                    </div>
                    
                    <div className="form-group">
                    <label>Приоритет:</label>
                    <select
                        value={editingTask.priority}
                        onChange={(e) => dispatch(editTask({ 
                        ...editingTask, 
                        priority: e.target.value as "low" | "medium" | "high" 
                        }))}
                        className="form-select"
                    >
                        <option value="low">Низкий</option>
                        <option value="medium">Средний</option>
                        <option value="high">Высокий</option>
                    </select>
                    </div>
                </div>
                
                <div className="modal-footer">
                    <button 
                    onClick={handleSave}
                    className="btn btn-primary"
                    >
                    Сохранить
                    </button>
                    <button 
                    onClick={() => dispatch(cancelEditing())}
                    className="btn btn-secondary"
                    >
                    Отменить
                    </button>
                </div>
                </div>
            </div>
        )}
      <div className="task-groups">
        {groupTasks().map(({ group, tasks }) => (
          <div key={group} className="task-group">
            <h2 className="group-title">{group.toUpperCase()}</h2>
            <TaskList
              tasks={tasks}
              onEdit={(task) => dispatch(editTask(task))}
              onDelete={(id) => dispatch(deleteTask(id))}
              onToggleCompleted={(id) => dispatch(toggleCompleted(id))}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;