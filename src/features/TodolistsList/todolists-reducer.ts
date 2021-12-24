import {todolistApi, TodolistType} from "../../api/todolist-api";
import {AppStatusType, setAppStatus} from "../../app/app-reducer";
import {ThunkType} from "../../app/store";

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: AppStatusType
}
const initialState: Array<TodolistDomainType> = []


export const todolistsReducer = (state = initialState, action: TodolistsActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case "TODOS/SET-TODOLISTS":
            return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        case 'TODOS/ADD-TODOLIST':
            const newTodolist: TodolistDomainType = {...action.todolist, filter: 'all', entityStatus: 'idle'}
            return [newTodolist, ...state]
        case 'TODOS/REMOVE-TODOLIST':
            return state.filter(f => f.id !== action.id)
        case 'TODOS/CHANGE-TODOLIST-TITLE':
            return state.map(m => m.id === action.todolistId ? {...m, title: action.title} : m)
        case 'TODOS/CHANGE-TODOLIST-FILTER':
            return state.map(m => m.id === action.id ? {...m, filter: action.filter} : m)
        case 'TODOS/CHANGE-TODOLIST-ENTITY-STATUS':
            return state.map(m => m.id === action.id ? {...m, entityStatus: action.entityStatus} : m)
        default:
            return state
    }
}

export type TodolistsActionsType =
    RemoveTodolistType
    | AddTodolistType
    | ReturnType<typeof changeTodolistTitle>
    | ReturnType<typeof changeTodolistFilter>
    | SetTodolistType
    | ReturnType<typeof changeTodolistEntityStatus>

export type AddTodolistType = ReturnType<typeof addTodolist>
export type RemoveTodolistType = ReturnType<typeof removeTodolist>
export type SetTodolistType = ReturnType<typeof setTodolists>


export const setTodolists = (todolists: Array<TodolistType>) => {
    return {type: 'TODOS/SET-TODOLISTS', todolists} as const
}
export const removeTodolist = (todolistID: string) => {
    return {type: 'TODOS/REMOVE-TODOLIST', id: todolistID} as const
}
export const addTodolist = (todolist: TodolistType) => {
    return {type: 'TODOS/ADD-TODOLIST', todolist} as const
}
export const changeTodolistTitle = (todolistId: string, title: string) => {
    return {type: 'TODOS/CHANGE-TODOLIST-TITLE', todolistId, title} as const
}
export const changeTodolistFilter = (id: string, filter: FilterValuesType) => {
    return {type: 'TODOS/CHANGE-TODOLIST-FILTER', id, filter} as const
}
export const changeTodolistEntityStatus = (id: string, entityStatus: AppStatusType) => {
    return {type: 'TODOS/CHANGE-TODOLIST-ENTITY-STATUS', id, entityStatus} as const
}

// Thunk

export const setTodolistsTC = (): ThunkType =>
    async dispatch => {
        dispatch(setAppStatus('loading'))
        const res = await todolistApi.getTodolists()
        dispatch(setTodolists(res.data))
        dispatch(setAppStatus('succeeded'))
    }

export const removeTodolistTC = (todolistId: string): ThunkType =>
    async dispatch => {
        dispatch(setAppStatus('loading'))
        dispatch(changeTodolistEntityStatus(todolistId, 'loading'))
        await todolistApi.removeTodolist(todolistId)
        dispatch(removeTodolist(todolistId))
        dispatch(setAppStatus('succeeded'))
    }

export const addTodolistTC = (title: string): ThunkType =>
    async dispatch => {
        dispatch(setAppStatus('loading'))
        const res = await todolistApi.addTodolist(title)
        dispatch(addTodolist(res.data.data.item))
        dispatch(setAppStatus('succeeded'))

    }

export const changeTodolistTitleTC = (todolistId: string, title: string): ThunkType =>
    async dispatch => {
        await todolistApi.changeTodolistTitle(todolistId, title)
        dispatch(changeTodolistTitle(todolistId, title))
    }


