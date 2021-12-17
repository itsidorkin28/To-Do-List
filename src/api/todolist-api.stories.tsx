import React, {useEffect, useState} from 'react'
import {TaskPriorities, TaskStatuses, TaskModelType, todolistApi} from './todolist-api'

export default {
    title: 'API'
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistApi.getTodos()
            .then((res) => {
                setState(res.data)
            })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistApi.createTodo('New todolist')
            .then(res => {
                setState(res.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    const todolistId = 'a6af2cde-0264-4d53-a1fb-bfc00e2a6bcc'
    useEffect(() => {
        todolistApi.deleteTodo(todolistId)
            .then(res => {

            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    const todolistId = '19c7fd35-2bf7-4914-b787-20d14fb68b49'
    const title = '33'
    useEffect(() => {
        todolistApi.updateTodoTitle(todolistId, title)
            .then(res => {

            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    const todolistId = 'a2c0e3e1-a082-49d3-ad07-05ef61bb6eb1'

    useEffect(() => {
        todolistApi.getTasks(todolistId)
            .then(res => {
                setState(res.data.items);
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const DeleteTasks= () => {
    const [state, setState] = useState<any>(null)
    const todolistId = 'a2c0e3e1-a082-49d3-ad07-05ef61bb6eb1'
    const taskId = '0ea9ff25-0a8e-415e-b985-3565850aa331'

    useEffect(() => {
        todolistApi.deleteTask(todolistId, taskId)
            .then(res => {

            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    const todolistId = 'a2c0e3e1-a082-49d3-ad07-05ef61bb6eb1'
    const title = 'New task'

    useEffect(() => {
        todolistApi.createTask(todolistId, title)
            .then(res => {

            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const UpdateTask = () => {
    const [state, setState] = useState<any>(null)
    const todolistId = 'a2c0e3e1-a082-49d3-ad07-05ef61bb6eb1'
    const taskId = 'e471da5f-e842-4b68-8aa2-cae362f18f9d'
    const newStatus: TaskModelType = {
        description: 'fsfsdfsd',
        title: 'UPDATE',
        status: TaskStatuses.New,
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
    }

    useEffect(() => {
        todolistApi.updateTask(todolistId, taskId, newStatus)
            .then(res => {
                console.log(res.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}


