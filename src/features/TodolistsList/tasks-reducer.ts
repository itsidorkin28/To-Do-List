import {
    AddTodolistType, RemoveTodolistType,
    SetTodolistType
} from "./todolists-reducer";
import {ChangeTaskModelType, TaskPriorities, TaskStatuses, TaskType, todolistApi} from "../../api/todolist-api";
import {AppRootStateType, ThunkType} from "../../app/store";
import {AppStatusType, setAppStatus} from "../../app/app-reducer";
import {handlerServerNetworkError, handleServerAppError} from "../../utils/error-utils";

export type TaskDomainType = TaskType & {
    taskEntityStatus: AppStatusType
}

export type TasksStateType = { [key: string]: Array<TaskDomainType> }

const initialState: TasksStateType = {}

export const tasksReducer = (state = initialState, action: TasksActionsType): TasksStateType => {
    switch (action.type) {
        case 'TODOS/REMOVE-TODOLIST':
            const newState = {...state}
            delete newState[action.id]
            return newState
        case 'TASKS/REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(f => f.id !== action.taskId)}
        case 'TASKS/ADD-TASK':
            return {
                ...state,
                [action.task.todoListId]: [{...action.task, taskEntityStatus: 'idle'}, ...state[action.task.todoListId]]
            }
        case 'TASKS/CHANGE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(m => m.id === action.taskId ? {
                    ...m,
                    ...action.model
                } : m)
            }
        case 'TODOS/ADD-TODOLIST':
            return {...state, [action.todolist.id]: []}
        case 'TODOS/SET-TODOLISTS': {
            const copyState = {...state}
            action.todolists.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState
            // return action.todolists.reduce((acc, tl) => ({...acc, [tl.id]:[]}), {...state})
        }
        case 'TASKS/SET-TASKS':
            return {...state, [action.todolistId]: action.tasks.map(t => ({...t, taskEntityStatus: 'idle'}))}
        case 'TASKS/CHANGE-TASK-ENTITY-STATUS':
            return {...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {
                    ...t,
                    taskEntityStatus: action.entityStatus
                } : t)
            }
        default:
            return state
    }
}

export type TasksActionsType =
    ReturnType<typeof removeTask>
    | ReturnType<typeof addTask>
    | ReturnType<typeof changeTask>
    | AddTodolistType
    | RemoveTodolistType
    | SetTodolistType
    | ReturnType<typeof setTasks>
    | ReturnType<typeof changeTaskEntityStatus>

export const setTasks = (todolistId: string, tasks: Array<TaskType>) => {
    return {type: 'TASKS/SET-TASKS', todolistId, tasks} as const
}
export const removeTask = (taskId: string, todolistId: string) => {
    return {type: 'TASKS/REMOVE-TASK', taskId, todolistId} as const
}
export const addTask = (task: TaskType) => {
    return {type: 'TASKS/ADD-TASK', task} as const
}
export const changeTask = (taskId: string, model: ChangeTaskDomainModelType, todolistId: string) => {
    return {type: 'TASKS/CHANGE-TASK', taskId, model, todolistId} as const
}
export const changeTaskEntityStatus = (taskId: string, todolistId: string, entityStatus: AppStatusType) => {
    return {type: 'TASKS/CHANGE-TASK-ENTITY-STATUS', taskId, todolistId, entityStatus} as const
}


// Thunk

export const setTasksTC = (todolistId: string): ThunkType =>
    async dispatch => {
        dispatch(setAppStatus('loading'))
        const res = await todolistApi.getTasks(todolistId)
        dispatch(setTasks(todolistId, res.data.items))
        dispatch(setAppStatus('succeeded'))
    }

export const removeTaskTC = (todolistId: string, taskId: string): ThunkType =>
    async dispatch => {
        dispatch(setAppStatus('loading'))
        dispatch(changeTaskEntityStatus(taskId, todolistId, 'loading'))
        try {
            const res = await todolistApi.removeTask(todolistId, taskId)
            if (res.data.resultCode === 0) {
                dispatch(removeTask(taskId, todolistId))
                dispatch(setAppStatus('succeeded'))
                dispatch(changeTaskEntityStatus(taskId, todolistId, 'succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
                dispatch(changeTaskEntityStatus(taskId, todolistId, 'failed'))
            }
        } catch (e) {
            handlerServerNetworkError((e as Error), dispatch)
            dispatch(changeTaskEntityStatus(taskId, todolistId, 'failed'))
        }

    }

export const addTaskTC = (todolistId: string, title: string): ThunkType =>
    async dispatch => {
        dispatch(setAppStatus('loading'))
        try {
            const res = await todolistApi.addTask(todolistId, title)
            if (res.data.resultCode === 0) {
                dispatch(addTask(res.data.data.item))
                dispatch(setAppStatus('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        } catch (e) {
            handlerServerNetworkError((e as Error), dispatch)
        }
    }


type ChangeTaskDomainModelType = {
    description?: string
    title?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export const changeTaskTC = (taskId: string, model: ChangeTaskDomainModelType, todolistId: string): ThunkType =>
    async (dispatch, getState: () => AppRootStateType) => {
        const allTasks = getState().tasks
        const tasksOfCurrentTodolist = allTasks[todolistId]
        const task = tasksOfCurrentTodolist.find(t => t.id === taskId)

        if (!task) {
            console.warn('Task not found in the state')
            return
        }

        const apiModel: ChangeTaskModelType = {
            description: task.description,
            title: task.title,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            ...model
        }
        dispatch(setAppStatus('loading'))
        dispatch(changeTaskEntityStatus(taskId, todolistId, 'loading'))
        try {
            const res = await todolistApi.changeTask(todolistId, taskId, apiModel)
            if (res.data.resultCode === 0) {
                dispatch(changeTask(taskId, model, todolistId))
                dispatch(setAppStatus('succeeded'))
                dispatch(changeTaskEntityStatus(taskId, todolistId, 'succeeded'))

            } else {
                handleServerAppError(res.data, dispatch)
                dispatch(changeTaskEntityStatus(taskId, todolistId, 'failed'))

            }
        } catch (e) {
            handlerServerNetworkError((e as Error), dispatch)
            dispatch(changeTaskEntityStatus(taskId, todolistId, 'failed'))
        }
    }

