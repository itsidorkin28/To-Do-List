import {
	AppInitialStateType,
	appReducer,
	setAppError,
	setAppStatus,
} from './app-reducer';

let startState: AppInitialStateType;

beforeEach(() => {
	startState = {
		status: 'idle',
		error: null,
		isInitialized: false,
	};
});

test('correct error message should be set', () => {
	const action = setAppError({error: 'some error'});
	const endState = appReducer(startState, action);

	expect(endState.error).toBe('some error');
});

test('correct status message should be set', () => {
	const action = setAppStatus({status: 'succeeded'});
	const endState = appReducer(startState, action);

	expect(endState.status).toBe('succeeded');
});
