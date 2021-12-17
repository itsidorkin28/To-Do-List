import {
    AddTodolistType, RemoveTodolistType,
    SetTodolistType
} from "./todolists-reducer";
import {TaskStatuses, TaskType, todolistApi} from "../../api/todolist-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "../../app/store";

export type TasksStateType = { [key: string]: Array<TaskType> }

const initialState: TasksStateType = {}

export const tasksReducer = (state = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            const newState = {...state}
            delete newState[action.id]
            return newState
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(f => f.id !== action.taskId)}
        case 'ADD-TASK':
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
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
            // const copyState = {...state}
            // action.todolists.forEach(tl => {
            //     copyState[tl.id] = []
            // })
            // return copyState
            return action.todolists.reduce((acc, tl) => ({...acc, [tl.id]:[]}), {...state})
        }
        case 'SET-TASKS':
            return {...state, [action.todolistId]: action.tasks}
        default:
            return state
    }
}

type ActionsType =
    ReturnType<typeof removeTask>
    | ReturnType<typeof addTask>
    | ReturnType<typeof changeTaskStatus>
    | ReturnType<typeof changeTaskTitle>
    | AddTodolistType
    | RemoveTodolistType
    | SetTodolistType
    | ReturnType<typeof setTasks>

export const setTasks = (todolistId: string, tasks: Array<TaskType>) => {
    return {type: 'SET-TASKS', todolistId, tasks} as const
}

export const removeTask = (taskId: string, todolistId: string) => {
    return {type: 'REMOVE-TASK', taskId, todolistId} as const
}
export const addTask = (task: TaskType) => {
    return {type: 'ADD-TASK', task} as const
}
export const changeTaskStatus = (taskId: string, status: TaskStatuses, todolistId: string) => {
    return {type: 'CHANGE-TASK-STATUS', taskId, status, todolistId} as const
}

export const changeTaskTitle = (taskId: string, title: string, todolistId: string) => {
    return {type: 'CHANGE-TASK-TITLE', taskId, title, todolistId} as const
}

// Thunk

export const setTasksThunk = (todolistId: string) =>
    (disptach: Dispatch<ActionsType>) => {
        todolistApi.getTasks(todolistId)
            .then(res => {
                disptach(setTasks(todolistId, res.data.items))
            })
    }

export const removeTaskThunk = (todolistId: string, taskId: string) =>
    (dispatch: Dispatch<ActionsType>) => {
        todolistApi.deleteTask(todolistId, taskId)
            .then(() => {
                dispatch(removeTask(taskId, todolistId))
            })
    }

export const createTaskThunk = (todolistId: string, title: string) =>
    (dispatch: Dispatch<ActionsType>) => {
        todolistApi.createTask(todolistId, title)
            .then(res => {
                dispatch(addTask(res.data.data.item))
            })
    }

export const changeTaskStatusThunk = (taskId: string, status: TaskStatuses, todolistId: string) =>
    (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
        const allTasks = getState().tasks
        const tasksForCurrentTodolists = allTasks[todolistId]
        const task = tasksForCurrentTodolists.find(t => t.id === taskId)

        task && todolistApi.updateTask(todolistId, taskId, {
            description: task.description,
            title: task.title,
            status: status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
        })
            .then(() => {
                dispatch(changeTaskStatus(taskId, status, todolistId))
            })
    }

export const changeTaskTitleThunk = (taskId: string, title: string, todolistId: string) =>
    (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
        const allTasks = getState().tasks
        const tasksForCurrentTodolists = allTasks[todolistId]
        const task = tasksForCurrentTodolists.find(t => t.id === taskId)

        task && todolistApi.updateTask(todolistId, taskId, {
            description: task.description,
            title: title,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
        })
            .then(() => {
                dispatch(changeTaskTitle(taskId, title, todolistId))
            })
    }
