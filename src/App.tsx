// src/ui/App.tsx
import React, { useState, useEffect } from "react";
import { Task } from "../src/core/taskManager";
import { loadTasks, saveTasks } from "../src/storage/storage";
import AddTask from "../src/ui/AddTask";
import TaskList from "../src/ui/TaskList";
import { debounce } from "lodash";

const App: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [filters, setFilters] = useState({
        status: "all",
        priority: "all",
        search: "",
        dueDate: "all",
    });

    // Загрузка задач из localStorage при монтировании компонента
    useEffect(() => {
        const storedTasks = loadTasks();
        setTasks(storedTasks);
    }, []);

    // Обновление статуса задачи
    const handleToggleCompleted = (taskId: number) => {
        const updatedTasks = tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);
        saveTasks(updatedTasks);
    };

    // Функция для фильтрации задач
    const filteredTasks = tasks.filter((task) => {
      if (filters.status !== "all" && (filters.status === "completed" && !task.completed || filters.status === "incomplete" && task.completed)) {
            return false;
        }
        if (filters.priority !== "all" && task.priority !== filters.priority) {
            return false;
        }
        if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) {
            return false;
        }
if (filters.dueDate !== "all") {
    const taskDueDate = new Date(task.dueDate); // Преобразуем строку в объект Date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Очищаем время для корректного сравнения с датами

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Начало текущей недели (понедельник)

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Конец текущей недели (воскресенье)

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Начало текущего месяца

    // Фильтр "Сегодня"
    if (filters.dueDate === "today" && taskDueDate.toDateString() !== today.toDateString()) {
        return false;
    }

    // Фильтр "Эта неделя"
    if (filters.dueDate === "this-week" && (taskDueDate < startOfWeek || taskDueDate > endOfWeek)) {
        return false;
    }

    // Фильтр "Этот месяц"
    if (filters.dueDate === "this-month" && (taskDueDate < startOfMonth || taskDueDate > today)) {
        return false;
    }

    // Фильтр "Просроченные"
    if (filters.dueDate === "overdue" && taskDueDate >= today) {
        return false;
    }
}


        return true;
    });

    // Функции для обновления фильтров
    const handleFilterChange = (filterType: string, value: string) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterType]: value,
        }));
    };

    // Функция для добавления новой задачи
    const handleAddTask = (newTask: Task) => {
        const updatedTasks = [...tasks, newTask];
        setTasks(updatedTasks);
        saveTasks(updatedTasks); // Сохраняем задачи в localStorage
    };

    // Функция для редактирования задачи
    const handleEditTask = (task: Task) => {
        setEditingTask(task);
    };

    // Функция для сохранения отредактированной задачи
    const handleSaveTask = (updatedTask: Task) => {
        const updatedTasks = tasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
        );
        setTasks(updatedTasks);
        saveTasks(updatedTasks); // Сохраняем обновленные задачи в localStorage
        setEditingTask(null); // Сброс редактирования
    };

    // Функция для удаления задачи
    const handleDeleteTask = (taskId: number) => {
        const updatedTasks = tasks.filter((task) => task.id !== taskId);
        setTasks(updatedTasks);
        saveTasks(updatedTasks); // Сохраняем обновленные задачи в localStorage
    };

    // debounce для поиска
    const handleSearchChange = debounce((value: string) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            search: value,
        }));
    }, 300);

    // Пример добавления сохранения фильтров в localStorage
useEffect(() => {
    const savedFilters = localStorage.getItem("filters");
    if (savedFilters) {
        setFilters(JSON.parse(savedFilters));
    }
}, []);

useEffect(() => {
    localStorage.setItem("filters", JSON.stringify(filters));
}, [filters]);


    return (
        <div>
            <h1>Task Manager</h1>
            <AddTask onAdd={handleAddTask} />

            {/* Фильтры */}
            <div>
                <select onChange={(e) => handleFilterChange("status", e.target.value)} value={filters.status} style={{ backgroundColor: filters.status !== 'all' ? '#d3f9d8' : 'transparent' }}>
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="incomplete">Incomplete</option>
                </select>
                <select onChange={(e) => handleFilterChange("priority", e.target.value)} value={filters.priority}>
                    <option value="all">All</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <select onChange={(e) => handleFilterChange("dueDate", e.target.value)} value={filters.dueDate}>
                    <option value="all">All</option>
                    <option value="today">Today</option>
                    <option value="this-week">This Week</option>
                    <option value="this-month">This Month</option>
                    <option value="overdue">Overdue</option>
                </select>
                <input
                    type="text"
                    placeholder="Search tasks"
                    onChange={(e) => handleSearchChange(e.target.value)} // Добавили debounce
                    value={filters.search}
                />
            </div>

            {editingTask && (
                <div>
                    <h2>Edit Task</h2>
                    <input
                        type="text"
                        value={editingTask.title}
                        onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    />
                    <textarea
                        value={editingTask.description}
                        onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                    />
                    <input
                        type="date"
                        value={editingTask.dueDate}
                        onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                    />
                    <select
                        value={editingTask.priority}
                        onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as "low" | "medium" | "high" })}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <button onClick={() => handleSaveTask(editingTask)}>Save</button>
                    <button onClick={() => setEditingTask(null)}>Cancel</button>
                </div>
            )}

            {/* Список задач */}
            <TaskList
                tasks={filteredTasks}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onToggleCompleted={handleToggleCompleted}
            />
        </div>
    );
};

export default App;
