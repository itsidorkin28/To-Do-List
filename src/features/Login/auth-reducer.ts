import {
	SetAppErrorType,
	setAppStatus,
	SetAppStatusType,
} from '../../app/app-reducer';
import { ThunkType } from '../../app/store';
import {
	handlerServerNetworkError,
	handleServerAppError,
} from '../../utils/error-utils';
import { authAPI, LoginPramsType } from '../../api/auth-api';
import { clearTodosData } from '../TodolistsList/todolists-reducer';

const initialState = {
	isLoggedIn: false as boolean,
};
type InitialStateType = typeof initialState;

export const authReducer = (
	state: InitialStateType = initialState,
	action: AuthActionsType
): InitialStateType => {
	switch (action.type) {
		case 'LOGIN/SET-IS-LOGGED-IN':
			return { ...state, isLoggedIn: action.value };
		default:
			return state;
	}
};

// actions
export const setIsLoggedIn = (value: boolean) =>
	({ type: 'LOGIN/SET-IS-LOGGED-IN', value } as const);

// thunks
export const loginTC =
	(data: LoginPramsType): ThunkType =>
	async (dispatch) => {
		dispatch(setAppStatus('loading'));
		try {
			const res = await authAPI.login(data);
			if (res.data.resultCode === 0) {
				dispatch(setIsLoggedIn(true));
				dispatch(setAppStatus('succeeded'));
			} else {
				handleServerAppError(res.data, dispatch);
			}
		} catch (e) {
			handlerServerNetworkError(e as Error, dispatch);
		}
	};

export const logoutTC = (): ThunkType => async (dispatch) => {
	dispatch(setAppStatus('loading'));
	try {
		const res = await authAPI.logout();
		if (res.data.resultCode === 0) {
			dispatch(setIsLoggedIn(false));
			dispatch(setAppStatus('succeeded'));
			dispatch(clearTodosData());
		} else {
			handleServerAppError(res.data, dispatch);
		}
	} catch (e) {
		handlerServerNetworkError(e as Error, dispatch);
	}
};

// types
export type AuthActionsType =
	| ReturnType<typeof setIsLoggedIn>
	| SetAppStatusType
	| SetAppErrorType;
