import {v1} from 'uuid';
import {AddTodolistACType, RemoveTodolistACType, setTodolists, SetTodolistsType} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistApi} from "../api/todolist-api";
import {Dispatch} from "redux";

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
        case 'SET-TODOLISTS': {
            const copyState = {...state}
            action.todolists.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case 'SET-TASKS': {
            const copyState = {...state}
            copyState[action.todolistId] = action.tasks
            return copyState
        }
        default:
            return state
    }
}

type ActionsType =
    RemoveTaskActionType
    | AddTaskActionType
    | changeTaskStatusACType
    | changeTaskTitleACType
    | AddTodolistACType
    | RemoveTodolistACType
    | SetTodolistsType
    | SetTasksType

type SetTasksType = ReturnType<typeof setTasks>
export const setTasks = (todolistId: string, tasks: Array<TaskType>) => {
    return {type: 'SET-TASKS', todolistId, tasks} as const
}

type RemoveTaskActionType = ReturnType<typeof removeTask>
export const removeTask = (taskId: string, todolistId: string) => {
    return {type: 'REMOVE-TASK', taskId, todolistId} as const
}
type AddTaskActionType = ReturnType<typeof addTask>
export const addTask = (title: string, todolistId: string) => {
    return {type: 'ADD-TASK', title, todolistId} as const
}
type changeTaskStatusACType = ReturnType<typeof changeTaskStatus>
export const changeTaskStatus = (taskId: string, status: TaskStatuses, todolistId: string) => {
    return {type: 'CHANGE-TASK-STATUS', taskId, status, todolistId} as const
}

type changeTaskTitleACType = ReturnType<typeof changeTaskTitle>
export const changeTaskTitle = (taskId: string, title: string, todolistId: string) => {
    return {type: 'CHANGE-TASK-TITLE', taskId, title, todolistId} as const
}

// Thunk

export const setTasksThunk = (todolistId: string) => (disptach: Dispatch) => {
    todolistApi.getTasks(todolistId)
        .then(res => {
            disptach(setTasks(todolistId, res.data.items))
        })
}
