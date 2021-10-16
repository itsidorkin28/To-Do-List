import React, {ChangeEvent, useState} from 'react';
import {FilterValuesType} from './App';
import Button from "./components/Button";
import Input from "./components/Input";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    todolistID: string
    title: string
    tasks: Array<TaskType>
    removeTask: (todolistID: string, taskId: string) => void
    changeFilter: (todolistID: string, value: FilterValuesType) => void
    addTask: (todolistID: string, title: string) => void
    changeTaskStatus: (todolistID: string, taskId: string, isDone: boolean) => void
    filter: FilterValuesType
    removeTodolist: (todolistID: string) => void
}

export function Todolist(props: PropsType) {
    let [title, setTitle] = useState("")
    let [error, setError] = useState<boolean>(false)
    console.log(title)

    const addTaskHandlerForAddTitle = () => {
        if (title.trim()) {
            props.addTask(props.todolistID, title.trim())
            setTitle("");
        } else {
            setError(true);
        }
    }

    const onClickHandlerForRemoveTodolist = () => {
        props.removeTodolist(props.todolistID)
    }
    const tsarFoo = (value: FilterValuesType) => {
        props.changeFilter(props.todolistID, value)
    }
    const onClickHandlerForRemove = (Tid: string) => {
        props.removeTask(props.todolistID, Tid)
    }

    return <div className='Todolist'>
        <div className='todolistTitle'>
            <h3>{props.title}</h3>
            <Button callBack={onClickHandlerForRemoveTodolist} name={'x'}/>
        </div>

        <div className='todolistInput'>
            <Input title={title} setTitle={setTitle} addTask={addTaskHandlerForAddTitle} error={error} setError={setError}/>
            <Button callBack={addTaskHandlerForAddTitle} name={'+'}/>
        </div>


        <ul>
            {
                props.tasks.map(t => {
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        props.changeTaskStatus(props.todolistID, t.id, e.currentTarget.checked);
                    }

                    return <li key={t.id} className={t.isDone ? "is-done" : ""}>
                        <input type="checkbox"
                               onChange={onChangeHandler}
                               checked={t.isDone}/>
                        <span>{t.title}</span>
                        <Button callBack={() => onClickHandlerForRemove(t.id)} name={'x'}/>

                    </li>
                })
            }
        </ul>
        <div className='filterButtons'>

            <Button callBack={() => tsarFoo('all')} name={'all'} filter={props.filter}/>
            <Button callBack={() => tsarFoo('active')} name={'active'} filter={props.filter}/>
            <Button callBack={() => tsarFoo('completed')} name={'completed'} filter={props.filter}/>

        </div>
    </div>
}
