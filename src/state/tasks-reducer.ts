import {v1} from 'uuid';
import {AddTodolistACType, RemoveTodolistACType} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType} from "../api/todolist-api";

type ActionsType =
    RemoveTaskActionType
    | AddTaskActionType
    | changeTaskStatusACType
    | changeTaskTitleACType
    | AddTodolistACType
    | RemoveTodolistACType

export type TasksStateType = { [key: string]: Array<TaskType> }

const initialState: TasksStateType = {}

export const tasksReducer = (state = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            let newState = {...state}
            delete newState[action.id]
            return newState
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(f => f.id !== action.taskId)}
        case 'ADD-TASK':
            return {
                ...state,
                [action.todolistId]: [
                    {
                        id: v1(),
                        title: action.title,
                        status: TaskStatuses.New,
                        todoListId: action.todolistId,
                        startDate: '',
                        deadline: '',
                        addedDate: '',
                        order: 0,
                        priority: TaskPriorities.Low,
                        description: '',
                    },
                    ...state[action.todolistId]
                ]
            }
        case 'CHANGE-TASK-STATUS':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(m => m.id === action.taskId ? {
                    ...m,
                    status: action.status
                } : m)
            }
        case 'CHANGE-TASK-TITLE':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(m => m.id === action.taskId ? {
                    ...m,
                    title: action.title
                } : m)
            }
        case 'ADD-TODOLIST':
            return {...state, [action.todolistId]: []}
        default:
            return state
    }
}

type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {type: 'REMOVE-TASK', taskId, todolistId} as const
}
type AddTaskActionType = ReturnType<typeof addTaskAC>
export const addTaskAC = (title: string, todolistId: string) => {
    return {type: 'ADD-TASK', title, todolistId} as const
}
type changeTaskStatusACType = ReturnType<typeof changeTaskStatusAC>
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string) => {
    return {type: 'CHANGE-TASK-STATUS', taskId, status, todolistId} as const
}

type changeTaskTitleACType = ReturnType<typeof changeTaskTitleAC>
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => {
    return {type: 'CHANGE-TASK-TITLE', taskId, title, todolistId} as const
}
