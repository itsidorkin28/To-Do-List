import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '1e90b645-3ab8-4f0b-b1bb-01b70c47396d'
    },
})

export const todolistApi = {
    getTodos() {
        return instance.get<Array<TodoType>>('todo-lists')
    },
    createTodo() {
        return instance.post<CommonResponseType<{ item:  TodoType }>>('todo-lists', {title: '1111'})
    },
    deleteTodo(todolistId: string) {
        return axios.delete<CommonResponseType<{}>>(`todo-lists/${todolistId}`)
    },
    updateTodoTitle(todolistId: string, title: string) {
        return axios.put<CommonResponseType<{}>>(`todo-lists/${todolistId}`, {title})
    },
}

type CommonResponseType<T> = {
    resultCode: number
    messages: Array<string>
    fieldErrors: Array<string>
    data: T
}

type TodoType = {
    id: string
    title: string,
    addedDate: string
    order: number
}
