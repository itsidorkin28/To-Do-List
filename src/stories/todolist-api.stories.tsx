import React, {useEffect, useState} from 'react'
import { todolistApi } from '../api/todolist-api'

export default {
    title: 'API'
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistApi.getTodos()
            .then((res) => {
                setState(res.data[0].title)
            })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistApi.createTodo()
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



