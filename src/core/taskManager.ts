export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    dueDate: string;
    priority: "low" | "medium" | "high";  
    tags: string[];
}