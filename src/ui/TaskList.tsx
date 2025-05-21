// src/ui/TaskList.tsx
import React from "react";
import { Task } from "../core/taskManager";

interface TaskListProps {
    tasks: Task[];
    onEdit: (task: Task) => void;
    onDelete: (taskId: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete }) => {
    return (
        <div>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <div>
                            <span
                                style={{
                                    textDecoration: task.completed ? "line-through" : "none",
                                }}
                            >
                                {task.title}
                            </span>
                            <button onClick={() => onEdit(task)}>Edit</button>
                            <button onClick={() => onDelete(task.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;
