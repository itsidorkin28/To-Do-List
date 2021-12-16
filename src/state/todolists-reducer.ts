import { Dispatch } from "redux";
import {v1} from "uuid";
import {todolistApi, TodolistType} from "../api/todolist-api";

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}
const initialState: Array<TodolistDomainType> = []


export const todolistsReducer = (state = initialState, action: ActionsTypes): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(f => f.id !== action.id)
        case 'ADD-TODOLIST':
            return [{id: action.todolistId, title: action.title, filter: 'all', addedDate: '', order: 0}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(m => m.id === action.id ? {...m, title: action.title} : m)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(m => m.id === action.id ? {...m, filter: action.filter} : m)
        case "SET-TODOLISTS":
            return action.todolists.map(tl => {
                return {...tl, filter: 'all'}
            })
        default:
            return state
    }
}

type ActionsTypes =
    RemoveTodolistACType
    | AddTodolistACType
    | ChangeTodolistTitleACType
    | changeTodolistFilterACType
    | SetTodolistsType

export type SetTodolistsType = ReturnType<typeof setTodolists>
export const setTodolists = (todolists: Array<TodolistType>) => {
    return {
        type: 'SET-TODOLISTS',
        todolists
    } as const
}

export type RemoveTodolistACType = ReturnType<typeof removeTodolist>
export const removeTodolist = (todolistID: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        id: todolistID
    } as const
}

export type AddTodolistACType = ReturnType<typeof addTodolist>
export const addTodolist = (title: string) => {
    return {
        type: 'ADD-TODOLIST',
        title,
        todolistId: v1()
    } as const
}

type ChangeTodolistTitleACType = ReturnType<typeof changeTodolistTitle>
export const changeTodolistTitle = (id: string, title: string) => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        id,
        title
    } as const
}

type changeTodolistFilterACType = ReturnType<typeof changeTodolistFilter>
export const changeTodolistFilter = (id: string, filter: FilterValuesType) => {
    return {
        type: 'CHANGE-TODOLIST-FILTER',
        id,
        filter
    } as const
}

// Thunk

export const setTodolistsThunk = () => (disptach: Dispatch) => {
    todolistApi.getTodos()
        .then(res => {
            disptach(setTodolists(res.data))
        })
}
