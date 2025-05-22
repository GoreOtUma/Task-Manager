import React from "react";
import { Task } from "../core/taskManager";

interface TaskItemProps {
    task: Task;
    onDelete: (id: number) => void;
    onToggleComplete: (id: number) => void;
    onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onDelete, onToggleComplete, onEdit }) => {
    return (
        <div>
            <div style={{ textDecoration: task.completed ? "line-through" : "none" }} onClick={() => onToggleComplete(task.id)}>
                {task.title}
            </div>
        </div>
    );
};

export default TaskItem;
