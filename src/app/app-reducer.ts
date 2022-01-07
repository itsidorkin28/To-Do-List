import { ThunkType } from './store';
import {
	handlerServerNetworkError,
	handleServerAppError,
} from '../utils/error-utils';
import { setIsLoggedIn } from '../features/Login/auth-reducer';
import { authAPI } from '../api/auth-api';

export type AppStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';
export type AppErrorType = string | null;

const initialState = {
	status: 'idle' as AppStatusType,
	error: null as AppErrorType,
	isInitialized: false as boolean,
};

export type AppInitialStateType = typeof initialState;

export const appReducer = (
	state = initialState,
	action: AppActionsType
): AppInitialStateType => {
	switch (action.type) {
		case 'APP/SET-STATUS':
			return { ...state, status: action.status };
		case 'APP/SET-ERROR':
			return { ...state, error: action.error };
		case 'APP/SET-APP-INITIALIZED':
			return { ...state, isInitialized: action.value };
		default:
			return state;
	}
};

// Actions

export const setAppStatus = (status: AppStatusType) => {
	return { type: 'APP/SET-STATUS', status } as const;
};
export const setAppError = (error: AppErrorType) => {
	return { type: 'APP/SET-ERROR', error } as const;
};
export const setAppInitialized = (value: boolean) => {
	return { type: 'APP/SET-APP-INITIALIZED', value } as const;
};

// Thunks

export const initializeAppTC = (): ThunkType => async (dispatch) => {
	dispatch(setAppStatus('loading'));
	try {
		const res = await authAPI.autMe();
		if (res.data.resultCode === 0) {
			dispatch(setIsLoggedIn(true));
			dispatch(setAppStatus('succeeded'));
		} else {
			handleServerAppError(res.data, dispatch);
		}
	} catch (e) {
		handlerServerNetworkError(e as Error, dispatch);
	} finally {
		dispatch(setAppInitialized(true));
	}
};

export type AppActionsType =
	| SetAppStatusType
	| SetAppErrorType
	| SetAppInitializedType;
export type SetAppStatusType = ReturnType<typeof setAppStatus>;
export type SetAppErrorType = ReturnType<typeof setAppError>;
export type SetAppInitializedType = ReturnType<typeof setAppInitialized>;
