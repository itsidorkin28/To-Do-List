import {setAppError, setAppStatus} from '../app/app-reducer';
import { CommonResponseType } from '../api/todolist-api';
import { Dispatch } from 'redux';

export const handleServerAppError = <T>(
	data: CommonResponseType<T>,
	dispatch: Dispatch
) => {
	if (data.messages) {
		dispatch(setAppError({error: data.messages[0]}));
	} else {
		dispatch(setAppError({error: 'Some error occurred'}));
	}
	dispatch(setAppStatus({status: 'failed'}));
};

export const handlerServerNetworkError = (
	error: { message: string  },
	dispatch: Dispatch
) => {
	dispatch(
		setAppError({error: error.message ?? 'Some error occurred'})
	);
	dispatch(setAppStatus({status: 'failed'}));
};

