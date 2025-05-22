import React, { useState } from "react";
import { Task } from "../core/taskManager";
import "./AddTask.css";
import { HiOutlineDocumentAdd   } from "react-icons/hi"; 
interface AddTaskProps {
    onAdd: (task: Task) => void; // Передаем функцию для добавления задачи
}

const predefinedTags = ["Работа", "Личное", "Срочное", "Дом", "Учеба"];

const AddTask: React.FC<AddTaskProps> = ({ onAdd }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const handleTagToggle = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };
    // Функция для добавления задачи
    const handleAdd = () => {
        const currentDate = new Date().toISOString().split("T")[0];
        // Валидация
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
                tags: selectedTags,
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
        setSelectedTags([]);
    };
    

    return (
        <div>
            <h2>Добавить новую задачу</h2>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Название"
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Описание"
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
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
            </select>
            <div>
                <label>Tags:</label>
                {predefinedTags.map((tag) => (
                    <label key={tag} style={{ marginRight: "10px" }}>
                        <input
                            type="checkbox"
                            checked={selectedTags.includes(tag)}
                            onChange={() => handleTagToggle(tag)}
                        />
                        {tag}
                    </label>
                ))}
            </div>
            <button onClick={handleAdd}>
                <HiOutlineDocumentAdd  size={24} />
                Добавить задачу
            </button>
        </div>
    );
};

export default AddTask;
