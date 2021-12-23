import {v1} from "uuid";
import {
    addTodolist,
    changeTodolistFilter,
    changeTodolistTitle, FilterValuesType, setTodolists,
    TodolistDomainType,
    todolistsReducer,
} from "./todolists-reducer";

let todolistId1: string
let todolistId2: string
let startState: Array<TodolistDomainType>

beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1();

    startState = [
        {id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
        {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0},
    ]
})

test('correct todolist should be removed', () => {
    const endState = todolistsReducer(startState, {type: 'TODOS/REMOVE-TODOLIST', id: todolistId1})

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)
})

test('correct todolist should be added', () => {
    const newTodolist =  {id: 'todolistId3', title: 'New todolist', filter: 'all', addedDate: '', order: 0}
    const action = addTodolist(newTodolist)
    const endState = todolistsReducer(startState, action)

    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe('New todolist')
    expect(endState[0].filter).toBe('all')
})

test('correct todolist should change its name', () => {
    const newTodolistTitle = 'New Todolist'
    const action = changeTodolistTitle(todolistId1, newTodolistTitle)
    const endState = todolistsReducer(startState, action)

    expect(endState.length).toBe(2)
    expect(endState[0].title).toBe(newTodolistTitle)
    expect(endState[1].title).toBe('What to buy')
})

test('correct filter of todolist should be changed', () => {
    const newFilter: FilterValuesType = 'completed'
    const action = changeTodolistFilter(todolistId1, newFilter)
    const endState = todolistsReducer(startState, action)

    expect(endState.length).toBe(2)
    expect(endState[0].filter).toBe(newFilter)
    expect(endState[1].filter).toBe('all')
})

test('todolists should be set to the state', () => {
    const action = setTodolists(startState)
    const endState = todolistsReducer([], action)

    expect(endState.length).toBe(2)
})

