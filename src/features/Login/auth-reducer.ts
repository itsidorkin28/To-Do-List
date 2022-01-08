import {ThunkType} from '../../app/store';
import {handlerServerNetworkError, handleServerAppError} from '../../utils/error-utils';
import {authAPI, LoginPramsType} from '../../api/auth-api';
import {clearTodosData} from '../TodolistsList/todolists-reducer';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {setAppStatus} from '../../app/app-reducer';

const initialState = {
	isLoggedIn: false as boolean
};

const slice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setIsLoggedIn(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
			state.isLoggedIn = action.payload.isLoggedIn;
		}
	}
});

export const authReducer = slice.reducer;
export const {setIsLoggedIn} = slice.actions;

// thunks
export const loginTC = (data: LoginPramsType): ThunkType => async (dispatch) => {
	dispatch(setAppStatus({status: 'loading'}));
	try {
		const res = await authAPI.login(data);
		if (res.data.resultCode === 0) {
			dispatch(setIsLoggedIn({isLoggedIn: true}));
			dispatch(setAppStatus({status: 'succeeded'}));

		} else {
			handleServerAppError(res.data, dispatch);
		}
	} catch (e) {
		handlerServerNetworkError(e as Error, dispatch);
	}
};
export const logoutTC = (): ThunkType => async (dispatch) => {
	dispatch(setAppStatus({status: 'loading'}));
	try {
		const res = await authAPI.logout();
		if (res.data.resultCode === 0) {
			dispatch(setIsLoggedIn({isLoggedIn: false}));
			dispatch(setAppStatus({status: 'succeeded'}));
			dispatch(clearTodosData({}));
		} else {
			handleServerAppError(res.data, dispatch);
		}
	} catch (e) {
		handlerServerNetworkError(e as Error, dispatch);
	}
};

