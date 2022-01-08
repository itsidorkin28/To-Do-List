import {ThunkType} from './store';
import {handlerServerNetworkError, handleServerAppError} from '../utils/error-utils';
import {setIsLoggedIn} from '../features/Login/auth-reducer';
import {authAPI} from '../api/auth-api';
import {PayloadAction, createSlice} from '@reduxjs/toolkit';

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';
export type AppErrorType = string | null;

const initialState = {
	status: 'idle' as RequestStatusType,
	error: null as AppErrorType,
	isInitialized: false as boolean,
};

const slice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
			state.status = action.payload.status;
		},
		setAppError(state, action: PayloadAction<{ error: AppErrorType }>) {
			state.error = action.payload.error;
		},
		setAppInitialized(state, action: PayloadAction<{ isInitialized: boolean }>) {
			state.isInitialized = action.payload.isInitialized;
		}
	}
});

export const appReducer = slice.reducer;
export const {setAppStatus, setAppError, setAppInitialized} = slice.actions;

// Thunks

export const initializeAppTC = (): ThunkType => async (dispatch) => {
	dispatch(setAppStatus({status: 'loading'}));
	try {
		const res = await authAPI.autMe();
		if (res.data.resultCode === 0) {
			dispatch(setIsLoggedIn({isLoggedIn: true}));
			dispatch(setAppStatus({status: 'succeeded'}));
		} else {
			handleServerAppError(res.data, dispatch);
		}
	} catch (e) {
		handlerServerNetworkError(e as Error, dispatch);
	} finally {
		dispatch(setAppInitialized({isInitialized: true}));
	}
};

