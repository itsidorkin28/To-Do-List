import {
    AddTodolistType, RemoveTodolistType,
    SetTodolistType
} from "./todolists-reducer";
import {ChangeTaskModelType, TaskPriorities, TaskStatuses, TaskType, todolistApi} from "../../api/todolist-api";
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
        case 'CHANGE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(m => m.id === action.taskId ? {
                    ...m,
                    ...action.model
                } : m)
            }
        case 'ADD-TODOLIST':
            return {...state, [action.todolist.id]: []}
        case 'SET-TODOLISTS': {
            const copyState = {...state}
            action.todolists.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState
            // return action.todolists.reduce((acc, tl) => ({...acc, [tl.id]:[]}), {...state})
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
    | ReturnType<typeof changeTask>
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
export const changeTask = (taskId: string, model: ChangeTaskDomainModelType, todolistId: string) => {
    return {type: 'CHANGE-TASK', taskId, model, todolistId} as const
}


// Thunk

export const setTasksTC = (todolistId: string) =>
    (disptach: Dispatch<ActionsType>) => {
        todolistApi.getTasks(todolistId)
            .then(res => {
                disptach(setTasks(todolistId, res.data.items))
            })
    }

export const removeTaskTC = (todolistId: string, taskId: string) =>
    (dispatch: Dispatch<ActionsType>) => {
        todolistApi.removeTask(todolistId, taskId)
            .then(() => {
                dispatch(removeTask(taskId, todolistId))
            })
    }

export const addTaskTC = (todolistId: string, title: string) =>
    (dispatch: Dispatch<ActionsType>) => {
        todolistApi.addTask(todolistId, title)
            .then(res => {
                dispatch(addTask(res.data.data.item))
            })
    }


type ChangeTaskDomainModelType = {
    description?: string
    title?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export const changeTaskTC = (taskId: string, model: ChangeTaskDomainModelType, todolistId: string) =>
    (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
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
        todolistApi.changeTask(todolistId, taskId, apiModel)
            .then(() => {
                dispatch(changeTask(taskId, model, todolistId))
            })
    }

