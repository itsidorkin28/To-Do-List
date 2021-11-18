import {v1} from 'uuid';
import {AddTodolistACType, RemoveTodolistACType, todolistID1, todolistID2} from "./todolists-reducer";
import {TaskType} from "../Todolist";

type ActionsType =
    RemoveTaskActionType
    | AddTaskActionType
    | changeTaskStatusACType
    | changeTaskTitleACType
    | AddTodolistACType
    | RemoveTodolistACType

export type TasksType = { [key: string]: Array<TaskType> }

const initialState: TasksType = {
    [todolistID1]: [
        {id: v1(), title: "HTML&CSS", isDone: true},
        {id: v1(), title: "JS", isDone: true},
        {id: v1(), title: "ReactJS", isDone: false},
    ],
    [todolistID2]: [
        {id: v1(), title: "HTML&CSS2", isDone: true},
        {id: v1(), title: "JS2", isDone: true},
        {id: v1(), title: "ReactJS2", isDone: false},
    ]
}

export const tasksReducer = (state = initialState, action: ActionsType): TasksType => {
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
                [action.todolistId]: [{id: v1(), title: action.title, isDone: false}, ...state[action.todolistId]]
            }
        case 'CHANGE-TASK-STATUS':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(m => m.id === action.taskId ? {
                    ...m,
                    isDone: action.isDone
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
export const changeTaskStatusAC = (taskId: string, isDone: boolean, todolistId: string) => {
    return {type: 'CHANGE-TASK-STATUS', taskId, isDone, todolistId} as const
}

type changeTaskTitleACType = ReturnType<typeof changeTaskTitleAC>
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => {
    return {type: 'CHANGE-TASK-TITLE', taskId, title, todolistId} as const
}
