import {
	setAppError,
	SetAppErrorType,
	setAppStatus,
	SetAppStatusType,
} from '../app/app-reducer';
import { CommonResponseType } from '../api/todolist-api';
import { Dispatch } from 'redux';

export const handleServerAppError = <T>(
	data: CommonResponseType<T>,
	dispatch: ErrorUtilsDispatchType
) => {
	if (data.messages) {
		dispatch(setAppError(data.messages[0]));
	} else {
		dispatch(setAppError('Some error occurred'));
	}
	dispatch(setAppStatus('failed'));
};

export const handlerServerNetworkError = (
	error: { message: string },
	dispatch: ErrorUtilsDispatchType
) => {
	dispatch(
		setAppError(error.message ? error.message : 'Some error occurred')
	);
	dispatch(setAppStatus('failed'));
};

type ErrorUtilsDispatchType = Dispatch<SetAppStatusType | SetAppErrorType>;
