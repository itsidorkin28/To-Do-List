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
            return [{id: action.todolistId, title: action.title, filter: 'all', addedDate: '', order: 0}, ...state]
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
    return {
        type: 'SET-TODOLISTS',
        todolists
    } as const
}

export const removeTodolist = (todolistID: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        id: todolistID
    } as const
}

export const addTodolist = (title: string, todolistId: string) => {
    return {
        type: 'ADD-TODOLIST',
        title,
        todolistId
    } as const
}

export const changeTodolistTitle = (todolistId: string, title: string) => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        todolistId,
        title
    } as const
}

export const changeTodolistFilter = (id: string, filter: FilterValuesType) => {
    return {
        type: 'CHANGE-TODOLIST-FILTER',
        id,
        filter
    } as const
}

// Thunk

export const setTodolistsThunk = () =>
    (disptach: Dispatch<ActionsType>) => {
        todolistApi.getTodos()
            .then(res => {
                disptach(setTodolists(res.data))
            })
    }

export const deleteTodolistThunk = (todolistId: string) =>
    (dispatch: Dispatch<ActionsType>) => {
        todolistApi.deleteTodo(todolistId)
            .then(() => {
                dispatch(removeTodolist(todolistId))
            })
    }

export const createTodolistThunk = (title: string) =>
    (dispatch: Dispatch<ActionsType>) => {
        todolistApi.createTodo(title)
            .then(res => {
                dispatch(addTodolist(title, res.data.data.item.id))
            })
    }

export const changeTodolistTitleThunk = (todolistId: string, title: string) =>
    (dispatch: Dispatch<ActionsType>) => {
        todolistApi.updateTodoTitle(todolistId, title)
            .then(() => {
                dispatch(changeTodolistTitle(todolistId, title))
            })
    }