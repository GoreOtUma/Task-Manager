import React from 'react';
import { Task } from '../core/taskManager';
import { FiEdit3, FiX, FiCalendar, FiTag, FiFlag } from 'react-icons/fi';
import './TaskList.css';

interface TaskListProps {
    tasks: Task[];
    onEdit: (task: Task) => void;
    onDelete: (taskId: number) => void;
    onToggleCompleted: (taskId: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete, onToggleCompleted }) => {
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'red';
            case 'medium': return 'orange';
            case 'low': return 'green';
            default: return 'gray';
        }
    };

    return (
        <div className="task-cards-container">
            {tasks.map((task) => (
                <div 
                    key={task.id} 
                    className={`task-card ${task.completed ? 'completed' : ''}`}
                >
                    <div className="task-card-header">
                        <h3 
                            className="task-title"
                            onClick={() => onToggleCompleted(task.id)}
                        >
                            {task.title}
                        </h3>
                        <div className="task-actions">
                            <button 
                                onClick={() => onEdit(task)}
                                className="edit-button"
                            >
                                <FiEdit3 />
                            </button>
                            <button 
                                onClick={() => onDelete(task.id)}
                                className="delete-button"
                            >
                                <FiX />
                            </button>
                        </div>
                    </div>

                    {task.description && (
                        <p className="task-description">{task.description}</p>
                    )}

                    <div className="task-meta">
                        {task.dueDate && (
                            <div className="task-due-date">
                                <FiCalendar />
                                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                        )}

                        <div className="task-priority">
                            <FiFlag color={getPriorityColor(task.priority)} />
                            <span>{task.priority}</span>
                        </div>
                    </div>

                    {task.tags.length > 0 && (
                        <div className="task-tags">
                            <FiTag />
                            {task.tags.map((tag) => (
                                <span key={tag} className="tag">{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TaskList;