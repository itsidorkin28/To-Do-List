export type AppStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type AppErrorType = string | null

const initialState = {
    status: 'idle' as AppStatusType,
    error: null as AppErrorType
}

export type AppInitialStateType = typeof initialState

export const appReducer = (state = initialState, action: AppActionsType): AppInitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        default:
            return state
    }
}

export type AppActionsType = ReturnType<typeof setAppStatus> | ReturnType<typeof setAppError>

export const setAppStatus = (status: AppStatusType) => {
    return {type: 'APP/SET-STATUS', status} as const
}
export const setAppError = (error: AppErrorType) => {
    return {type: 'APP/SET-ERROR', error} as const
}

