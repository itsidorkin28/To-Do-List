import { v1 } from 'uuid';
import {
	addTodolist,
	changeTodolistEntityStatus,
	changeTodolistFilter,
	changeTodolistTitle,
	FilterValuesType,
	removeTodolist,
	setTodolists,
	TodolistDomainType,
	todolistsReducer,
} from './todolists-reducer';
import { RequestStatusType } from '../../app/app-reducer';

let todolistId1: string;
let todolistId2: string;
let startState: Array<TodolistDomainType>;

beforeEach(() => {
	todolistId1 = v1();
	todolistId2 = v1();

	startState = [
		{
			id: todolistId1,
			title: 'What to learn',
			filter: 'all',
			addedDate: '',
			order: 0,
			entityStatus: 'idle',
		},
		{
			id: todolistId2,
			title: 'What to buy',
			filter: 'all',
			addedDate: '',
			order: 0,
			entityStatus: 'idle',
		},
	];
});

test('correct todolist should be removed', () => {
	const action = removeTodolist({todolistId: todolistId1});
	const endState = todolistsReducer(startState, action);

	expect(endState.length).toBe(1);
	expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {
	const newTodolist = {
		id: 'todolistId3',
		title: 'New todolist',
		filter: 'all',
		addedDate: '',
		order: 0,
	};
	const action = addTodolist({todolist: newTodolist});
	const endState = todolistsReducer(startState, action);

	expect(endState.length).toBe(3);
	expect(endState[0].title).toBe('New todolist');
	expect(endState[0].filter).toBe('all');
});

test('correct todolist should change its name', () => {
	const newTodolistTitle = 'New Todolist';
	const action = changeTodolistTitle({todolistId: todolistId1, title: newTodolistTitle});
	const endState = todolistsReducer(startState, action);

	expect(endState.length).toBe(2);
	expect(endState[0].title).toBe(newTodolistTitle);
	expect(endState[1].title).toBe('What to buy');
});

test('correct filter of todolist should be changed', () => {
	const newFilter: FilterValuesType = 'completed';
	const action = changeTodolistFilter({todolistId: todolistId1, filter: newFilter});
	const endState = todolistsReducer(startState, action);

	expect(endState.length).toBe(2);
	expect(endState[0].filter).toBe(newFilter);
	expect(endState[1].filter).toBe('all');
});

test('correct entity status of todolist should be changed', () => {
	const newFilter: RequestStatusType = 'loading';
	const action = changeTodolistEntityStatus({todolistId: todolistId1, entityStatus: newFilter});
	const endState = todolistsReducer(startState, action);

	expect(endState.length).toBe(2);
	expect(endState[0].entityStatus).toBe(newFilter);
	expect(endState[1].entityStatus).toBe('idle');
});

test('todolists should be set to the state', () => {
	const action = setTodolists({todolists: startState});
	const endState = todolistsReducer([], action);

	expect(endState.length).toBe(2);
});
