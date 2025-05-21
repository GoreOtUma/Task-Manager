// src/ui/AddTask.tsx
import React, { useState } from "react";
import { Task } from "../core/taskManager";

interface AddTaskProps {
    onAdd: (task: Task) => void; // Передаем функцию для добавления задачи
}

const AddTask: React.FC<AddTaskProps> = ({ onAdd }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
    const [tags, setTags] = useState<string[]>([]);

    // Функция для добавления задачи
    const handleAdd = () => {
        const currentDate = new Date().toISOString().split("T")[0];
        // Валидация: проверяем, что длина title не меньше 3 символов
        if (title.length >= 3) {
            if (dueDate && dueDate < currentDate) {
                alert("Due date must not be earlier than today.");
                return;
            }

            const newTask: Task = {
                id: Date.now(),
                title,
                description,
                completed: false,
                dueDate,
                priority,
                tags,
            };

            onAdd(newTask); // Передаем новую задачу в родительский компонент
            resetForm(); // Сброс формы после добавления задачи
        } else {
            alert("Title must be at least 3 characters long.");
        }
    };

    // Сброс значений формы после добавления задачи
    const resetForm = () => {
        setTitle("");
        setDescription("");
        setDueDate("");
        setPriority("low");
        setTags([]);
    };
    

    return (
        <div>
            <h2>Add New Task</h2>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
            />
            <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
            />
            <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
            >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
            <button onClick={handleAdd}>Add Task</button>
        </div>
    );
};

export default AddTask;
