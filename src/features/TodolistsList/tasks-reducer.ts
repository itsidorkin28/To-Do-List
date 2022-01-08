import {
	ChangeTaskModelType,
	TaskPriorities,
	TaskStatuses,
	TaskType,
	todolistApi
} from '../../api/todolist-api';
import {RootStateType, ThunkType} from '../../app/store';
import {RequestStatusType, setAppStatus} from '../../app/app-reducer';
import {
	handlerServerNetworkError,
	handleServerAppError,
} from '../../utils/error-utils';
import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {
	addTodolist,
	clearTodosData,
	removeTodolist,
	setTodolists
} from './todolists-reducer';


export type TaskDomainType = TaskType & {
	taskEntityStatus: RequestStatusType;
};
export type TasksStateType = { [key: string]: Array<TaskDomainType> };
const initialState: TasksStateType = {};


const slice = createSlice({
	name: 'tasks',
	initialState,
	reducers: {
		setTasks(state, action: PayloadAction<{ todolistId: string, tasks: Array<TaskType> }>) {
			state[action.payload.todolistId] = action.payload.tasks.map(t => ({...t, taskEntityStatus: 'idle'}));
		},
		removeTask(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {
			const tasks = state[action.payload.todolistId];
			const index = tasks.findIndex(t => t.id === action.payload.taskId);
			if (index > -1) {
				tasks.splice(index, 1);
			}
		},
		addTask(state, action: PayloadAction<{ task: TaskType }>) {
			const tasks = state[action.payload.task.todoListId];
			tasks.unshift({...action.payload.task, taskEntityStatus: 'idle'});
		},
		changeTask(state, action: PayloadAction<{
			taskId: string, model: ChangeTaskDomainModelType,
			todolistId: string
		}>) {
			const tasks = state[action.payload.todolistId];
			const index = tasks.findIndex(t => t.id === action.payload.taskId);
			if (index > -1) {
				tasks[index] = {...tasks[index], ...action.payload.model};
			}
		},
		changeTaskEntityStatus(state, action: PayloadAction<{
			taskId: string, todolistId: string,
			entityStatus: RequestStatusType
		}>) {
			const tasks = state[action.payload.todolistId];
			const index = tasks.findIndex(t => t.id === action.payload.taskId);
			if (index > -1) {
				tasks[index] = {...tasks[index], taskEntityStatus: action.payload.entityStatus};
			}
		}
	},
	extraReducers: (builder) => {
		builder.addCase(removeTodolist, (state, {payload}) => {
			delete state[payload.todolistId];
		});
		builder.addCase(addTodolist, (state, {payload}) => {
			state[payload.todolist.id] = [];
		});
		builder.addCase(setTodolists, (state, {payload}) => {
			payload.todolists.forEach((tl) => {
				state[tl.id] = [];
			});
		});
		builder.addCase(clearTodosData, (state, {payload}) => {
			return {};
		});
	}
});

export const tasksReducer = slice.reducer;
export const {
	changeTaskEntityStatus, changeTask, addTask,
	removeTask, setTasks
} = slice.actions;

// Thunks

export const fetchTasksTC =
	(todolistId: string): ThunkType =>
		async (dispatch) => {
			// dispatch(setAppStatus('loading'))
			const res = await todolistApi.getTasks(todolistId);
			dispatch(setTasks({todolistId, tasks: res.data.items}));
			// dispatch(setAppStatus('succeeded'))
		};

export const removeTaskTC =
	(todolistId: string, taskId: string): ThunkType =>
		async (dispatch) => {
			dispatch(setAppStatus({status: 'loading'}));
			dispatch(changeTaskEntityStatus({taskId, todolistId, entityStatus: 'loading'}));
			try {
				const res = await todolistApi.removeTask(todolistId, taskId);
				if (res.data.resultCode === 0) {
					dispatch(removeTask({taskId, todolistId}));
					dispatch(setAppStatus({status: 'succeeded'}));
					dispatch(
						changeTaskEntityStatus({taskId, todolistId, entityStatus: 'succeeded'})
					);
				} else {
					handleServerAppError(res.data, dispatch);
					dispatch(changeTaskEntityStatus({taskId, todolistId, entityStatus: 'failed'}));
				}
			} catch (e) {
				handlerServerNetworkError(e as Error, dispatch);
				dispatch(changeTaskEntityStatus({taskId, todolistId, entityStatus: 'failed'}));
			}
		};

export const addTaskTC =
	(todolistId: string, title: string): ThunkType =>
		async (dispatch) => {
			dispatch(setAppStatus({status: 'loading'}));
			try {
				const res = await todolistApi.addTask(todolistId, title);
				if (res.data.resultCode === 0) {
					dispatch(addTask({task: res.data.data.item}));
					dispatch(setAppStatus({status: 'succeeded'}));
				} else {
					handleServerAppError(res.data, dispatch);
				}
			} catch (e) {
				handlerServerNetworkError(e as Error, dispatch);
			}
		};

type ChangeTaskDomainModelType = {
	description?: string;
	title?: string;
	status?: TaskStatuses;
	priority?: TaskPriorities;
	startDate?: string;
	deadline?: string;
};

export const changeTaskTC =
	(
		taskId: string,
		model: ChangeTaskDomainModelType,
		todolistId: string
	): ThunkType =>
		async (dispatch, getState: () => RootStateType) => {
			const allTasks = getState().tasks;
			const tasksOfCurrentTodolist = allTasks[todolistId];
			const task = tasksOfCurrentTodolist.find((t) => t.id === taskId);

			if (!task) {
				console.warn('Task not found in the state');
				return;
			}

			const apiModel: ChangeTaskModelType = {
				description: task.description,
				title: task.title,
				status: task.status,
				priority: task.priority,
				startDate: task.startDate,
				deadline: task.deadline,
				...model,
			};
			dispatch(setAppStatus({status: 'loading'}));
			dispatch(changeTaskEntityStatus({taskId, todolistId, entityStatus: 'loading'}));
			try {
				const res = await todolistApi.changeTask(
					todolistId,
					taskId,
					apiModel
				);
				if (res.data.resultCode === 0) {
					dispatch(changeTask({taskId, model, todolistId}));
					dispatch(setAppStatus({status: 'succeeded'}));
					dispatch(
						changeTaskEntityStatus({taskId, todolistId, entityStatus: 'succeeded'})
					);
				} else {
					handleServerAppError(res.data, dispatch);
					dispatch(changeTaskEntityStatus({taskId, todolistId, entityStatus: 'failed'}));
				}
			} catch (e) {
				handlerServerNetworkError(e as Error, dispatch);
				dispatch(changeTaskEntityStatus({taskId, todolistId, entityStatus: 'failed'}));
			}
		};



