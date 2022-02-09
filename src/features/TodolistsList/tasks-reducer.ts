import {
	ChangeTaskModelType,
	TaskPriorities,
	TaskStatuses,
	TaskType,
	todolistApi,
} from '../../api/todolist-api'
import {RootStateType, ThunkType} from '../../app/store'
import {RequestStatusType, setAppStatus} from '../../app/app-reducer'
import {
	handlerServerNetworkError,
	handleServerAppError,
} from '../../utils/error-utils'
import {PayloadAction, createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {
	addTodolist,
	clearTodosData,
	removeTodolist,
	setTodolists,
} from './todolists-reducer'


export type TaskDomainType = TaskType & {
	taskEntityStatus: RequestStatusType;
};
export type TasksStateType = {[key: string]: Array<TaskDomainType>};
const initialState: TasksStateType = {}

export const fetchTasksTC = createAsyncThunk('tasks/fetchTasks',
	async (todolistId: string, thunkAPI) => {
		thunkAPI.dispatch(setAppStatus({status: 'loading'}))
		const res = await todolistApi.getTasks(todolistId)
		thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
		return {todolistId, tasks: res.data.items}
	})

export const removeTaskTC = createAsyncThunk('tasks/removeTask',
	async (param: {todolistId: string, taskId: string}, thunkAPI) => {
		thunkAPI.dispatch(setAppStatus({status: 'loading'}))
		thunkAPI.dispatch(changeTaskEntityStatus({
			taskId: param.taskId,
			todolistId: param.todolistId,
			entityStatus: 'loading',
		}))
		try {
			const res = await todolistApi.removeTask(param.todolistId, param.taskId)
			if (res.data.resultCode === 0) {
				thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
				thunkAPI.dispatch(
					changeTaskEntityStatus({
						taskId: param.taskId,
						todolistId: param.todolistId,
						entityStatus: 'succeeded',
					}),
				)
				return {taskId: param.taskId, todolistId: param.todolistId}
			} else {
				handleServerAppError(res.data, thunkAPI.dispatch)
				thunkAPI.dispatch(changeTaskEntityStatus({
					taskId: param.taskId,
					todolistId: param.todolistId,
					entityStatus: 'failed',
				}))
			}
		} catch (e) {
			handlerServerNetworkError(e as Error, thunkAPI.dispatch)
			thunkAPI.dispatch(changeTaskEntityStatus({
				taskId: param.taskId,
				todolistId: param.todolistId,
				entityStatus: 'failed',
			}))
		}
	})

const slice = createSlice({
	name: 'tasks',
	initialState,
	reducers: {
		addTask(state, action: PayloadAction<{task: TaskType}>) {
			const tasks = state[action.payload.task.todoListId]
			tasks.unshift({...action.payload.task, taskEntityStatus: 'idle'})
		},
		changeTask(state, action: PayloadAction<{
			taskId: string, model: ChangeTaskDomainModelType,
			todolistId: string
		}>) {
			const tasks = state[action.payload.todolistId]
			const index = tasks.findIndex(t => t.id === action.payload.taskId)
			if (index > -1) {
				tasks[index] = {...tasks[index], ...action.payload.model}
			}
		},
		changeTaskEntityStatus(state, action: PayloadAction<{
			taskId: string, todolistId: string,
			entityStatus: RequestStatusType
		}>) {
			const tasks = state[action.payload.todolistId]
			const index = tasks.findIndex(t => t.id === action.payload.taskId)
			if (index > -1) {
				tasks[index] = {...tasks[index], taskEntityStatus: action.payload.entityStatus}
			}
		},
	},
	extraReducers: (builder) => {
		builder.addCase(removeTodolist, (state, {payload}) => {
			delete state[payload.todolistId]
		})
		builder.addCase(addTodolist, (state, {payload}) => {
			state[payload.todolist.id] = []
		})
		builder.addCase(setTodolists, (state, {payload}) => {
			payload.todolists.forEach((tl) => {
				state[tl.id] = []
			})
		})
		builder.addCase(fetchTasksTC.fulfilled, (state, {payload}) => {
			state[payload.todolistId] = payload.tasks.map(t => ({...t, taskEntityStatus: 'idle'}))
		})
		builder.addCase(clearTodosData, (state, {payload}) => {
			return {}
		})
		builder.addCase(removeTaskTC.fulfilled, (state, {payload}) => {
			const tasks = state[payload!.todolistId]
			const index = tasks.findIndex(t => t.id === payload!.taskId)
			if (index > -1) {
				tasks.splice(index, 1)
			}
		})

	},
})

export const tasksReducer = slice.reducer
export const {
	changeTaskEntityStatus, changeTask, addTask,
} = slice.actions

// Thunks


export const addTaskTC =
	(todolistId: string, title: string): ThunkType =>
		async (dispatch) => {
			dispatch(setAppStatus({status: 'loading'}))
			try {
				const res = await todolistApi.addTask(todolistId, title)
				if (res.data.resultCode === 0) {
					dispatch(addTask({task: res.data.data.item}))
					dispatch(setAppStatus({status: 'succeeded'}))
				} else {
					handleServerAppError(res.data, dispatch)
				}
			} catch (e) {
				handlerServerNetworkError(e as Error, dispatch)
			}
		}

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
		todolistId: string,
	): ThunkType =>
		async (dispatch, getState: () => RootStateType) => {
			const allTasks = getState().tasks
			const tasksOfCurrentTodolist = allTasks[todolistId]
			const task = tasksOfCurrentTodolist.find((t) => t.id === taskId)

			if (!task) {
				console.warn('Task not found in the state')
				return
			}

			const apiModel: ChangeTaskModelType = {
				description: task.description,
				title: task.title,
				status: task.status,
				priority: task.priority,
				startDate: task.startDate,
				deadline: task.deadline,
				...model,
			}
			dispatch(setAppStatus({status: 'loading'}))
			dispatch(changeTaskEntityStatus({taskId, todolistId, entityStatus: 'loading'}))
			try {
				const res = await todolistApi.changeTask(
					todolistId,
					taskId,
					apiModel,
				)
				if (res.data.resultCode === 0) {
					dispatch(changeTask({taskId, model, todolistId}))
					dispatch(setAppStatus({status: 'succeeded'}))
					dispatch(
						changeTaskEntityStatus({taskId, todolistId, entityStatus: 'succeeded'}),
					)
				} else {
					handleServerAppError(res.data, dispatch)
					dispatch(changeTaskEntityStatus({taskId, todolistId, entityStatus: 'failed'}))
				}
			} catch (e) {
				handlerServerNetworkError(e as Error, dispatch)
				dispatch(changeTaskEntityStatus({taskId, todolistId, entityStatus: 'failed'}))
			}
		}



