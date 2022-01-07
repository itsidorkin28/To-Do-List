import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '1e90b645-3ab8-4f0b-b1bb-01b70c47396d',
    },
});

export const todolistApi = {
    getTodolists() {
        return instance.get<Array<TodolistType>>('todo-lists');
    },
    addTodolist(title: string) {
        return instance.post<CommonResponseType<{ item: TodolistType }>>(
            'todo-lists',
            { title }
        );
    },
    removeTodolist(todolistId: string) {
        return instance.delete<CommonResponseType<{}>>(
            `todo-lists/${todolistId}`
        );
    },
    changeTodolistTitle(todolistId: string, title: string) {
        return instance.put<CommonResponseType<{}>>(
            `todo-lists/${todolistId}`,
            { title }
        );
    },
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponseType>(
            `todo-lists/${todolistId}/tasks`
        );
    },
    removeTask(todolistId: string, taskId: string) {
        return instance.delete<CommonResponseType<{}>>(
            `todo-lists/${todolistId}/tasks/${taskId}`
        );
    },
    addTask(todolistId: string, title: string) {
        return instance.post<CommonResponseType<{ item: TaskType }>>(
            `todo-lists/${todolistId}/tasks/`,
            { title }
        );
    },
    changeTask(todolistId: string, taskId: string, model: ChangeTaskModelType) {
        return instance.put<CommonResponseType<{}>>(
            `todo-lists/${todolistId}/tasks/${taskId}`,
            model
        );
    },
};

// Types

export type CommonResponseType<T> = {
    resultCode: number;
    messages: Array<string>;
    fieldErrors: Array<string>;
    data: T;
};

export type TodolistType = {
    id: string;
    title: string;
    addedDate: string;
    order: number;
};

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3,
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4,
}

export type TaskType = {
    description: string;
    title: string;
    status: TaskStatuses;
    priority: TaskPriorities;
    startDate: string;
    deadline: string;
    id: string;
    todoListId: string;
    order: number;
    addedDate: string;
};

export type ChangeTaskModelType = {
    description: string;
    title: string;
    status: TaskStatuses;
    priority: TaskPriorities;
    startDate: string;
    deadline: string;
};

type GetTasksResponseType = {
    items: Array<TaskType>;
    totalCount: number;
    error: string;
};
