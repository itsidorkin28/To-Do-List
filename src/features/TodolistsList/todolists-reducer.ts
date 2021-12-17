import {Dispatch} from "redux";
import {todolistApi, TodolistType} from "../../api/todolist-api";

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}
const initialState: Array<TodolistDomainType> = []


export const todolistsReducer = (state = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(f => f.id !== action.id)
        case 'ADD-TODOLIST':
            const newTodolist: TodolistDomainType = {...action.todolist, filter: 'all'}
            return [newTodolist, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(m => m.id === action.todolistId ? {...m, title: action.title} : m)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(m => m.id === action.id ? {...m, filter: action.filter} : m)
        case "SET-TODOLISTS":
            return action.todolists.map(tl => ({...tl, filter: 'all'}))
        default:
            return state
    }
}

type ActionsType =
    RemoveTodolistType
    | AddTodolistType
    | ReturnType<typeof changeTodolistTitle>
    | ReturnType<typeof changeTodolistFilter>
    | SetTodolistType

export type AddTodolistType = ReturnType<typeof addTodolist>
export type RemoveTodolistType = ReturnType<typeof removeTodolist>
export type SetTodolistType = ReturnType<typeof setTodolists>

export const setTodolists = (todolists: Array<TodolistType>) => {
    return {type: 'SET-TODOLISTS', todolists} as const
}
export const removeTodolist = (todolistID: string) => {
    return {type: 'REMOVE-TODOLIST', id: todolistID} as const
}
export const addTodolist = (todolist: TodolistType) => {
    return {type: 'ADD-TODOLIST', todolist} as const
}
export const changeTodolistTitle = (todolistId: string, title: string) => {
    return {type: 'CHANGE-TODOLIST-TITLE', todolistId, title} as const
}
export const changeTodolistFilter = (id: string, filter: FilterValuesType) => {
    return {type: 'CHANGE-TODOLIST-FILTER', id, filter} as const
}

// Thunk

export const setTodolistsTC = () =>
    (disptach: Dispatch<ActionsType>) => {
        todolistApi.getTodolists()
            .then(res => {
                disptach(setTodolists(res.data))
            })
    }

export const removeTodolistTC = (todolistId: string) =>
    (dispatch: Dispatch<ActionsType>) => {
        todolistApi.removeTodolist(todolistId)
            .then(() => {
                dispatch(removeTodolist(todolistId))
            })
    }

export const addTodolistTC = (title: string) =>
    (dispatch: Dispatch<ActionsType>) => {
        todolistApi.addTodolist(title)
            .then(res => {
                dispatch(addTodolist(res.data.data.item))
            })
    }

export const changeTodolistTitleTC = (todolistId: string, title: string) =>
    (dispatch: Dispatch<ActionsType>) => {
        todolistApi.changeTodolistTitle(todolistId, title)
            .then(() => {
                dispatch(changeTodolistTitle(todolistId, title))
            })
    }