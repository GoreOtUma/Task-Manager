import React from "react";
import { Task } from "../core/taskManager";

interface TaskListProps {
    tasks: Task[];
    onEdit: (task: Task) => void;
    onDelete: (taskId: number) => void;
    onToggleCompleted: (taskId: number) => void; // Функция для изменения статуса задачи
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete, onToggleCompleted }) => {
    return (
        <div>
            {tasks.map((task) => (
                <div key={task.id} style={{ marginBottom: "10px" }}>
                    <div
                        style={{
                            textDecoration: task.completed ? "line-through" : "none", // Если задача выполнена, перечеркиваем
                        }}
                        onClick={() => onToggleCompleted(task.id)} // Клик на задаче меняет статус
                    >
                        {task.title}
                    </div>
                    <button onClick={() => onEdit(task)}>Edit</button>
                    <button onClick={() => onDelete(task.id)}>Delete</button>
                </div>
            ))}
        </div>
    );
};

export default TaskList;
