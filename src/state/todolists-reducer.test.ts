import {v1} from "uuid";
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC, FilterValuesType,
    TodolistDomainType,
    todolistsReducer,
} from "./todolists-reducer";

let todolistID1: string
let todolistID2: string
let startState: Array<TodolistDomainType>

beforeEach(() => {
    todolistID1 = v1();
    todolistID2 = v1();

    startState = [
        {id: todolistID1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
        {id: todolistID2, title: 'What to buy', filter: 'all', addedDate: '', order: 0},
    ]
})

test('correct todolist should be removed', () => {
    const endState = todolistsReducer(startState, {type: 'REMOVE-TODOLIST', id: todolistID1})

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistID2)
})

test('correct todolist should be added', () => {
    const newTodolistTitle = 'New Todolist'
    const action = addTodolistAC(newTodolistTitle)
    const endState = todolistsReducer(startState, action)

    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe(newTodolistTitle)
    expect(endState[0].filter).toBe('all')
})

test('correct todolist should change its name', () => {
    const newTodolistTitle = 'New Todolist'
    const action = changeTodolistTitleAC(todolistID1, newTodolistTitle)
    const endState = todolistsReducer(startState, action)

    expect(endState.length).toBe(2)
    expect(endState[0].title).toBe(newTodolistTitle)
    expect(endState[1].title).toBe('What to buy')
})

test('correct filter of todolist should be changed', () => {
    const newFilter: FilterValuesType = 'completed'
    const action = changeTodolistFilterAC(todolistID1, newFilter)
    const endState = todolistsReducer(startState, action)

    expect(endState.length).toBe(2)
    expect(endState[0].filter).toBe(newFilter)
    expect(endState[1].filter).toBe('all')
})

