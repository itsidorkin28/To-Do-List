import React, {ChangeEvent} from 'react';
import {FilterValuesType} from './App';
import {AddItemForm} from "./components/AddItemForm";
import {EditableSpan} from "./components/EditableSpan";
import {Button, Checkbox, IconButton} from "@mui/material";
import {Delete} from '@mui/icons-material';

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
    updateTask: (todolistID: string, taskID: string, title: string) => void
    updateTodolist: (todolistID: string, title: string) => void
}

export function Todolist(props: PropsType) {
    const onClickHandlerForRemoveTodolist = () => {
        props.removeTodolist(props.todolistID)
    }
    const changeFilter = (value: FilterValuesType) => {
        props.changeFilter(props.todolistID, value)
    }
    const onClickHandlerForRemove = (Tid: string) => {
        props.removeTask(props.todolistID, Tid)
    }

    const addTaskHandler = (title: string) => props.addTask(props.todolistID, title)

    const updateTaskHandler = (taskID: string, title: string) => {
        props.updateTask(props.todolistID, taskID, title)
    }
    const updateTodolistHandler = (title: string) => {
        props.updateTodolist(props.todolistID, title)
    }
    return <div className='Todolist'>

        <h3><EditableSpan title={props.title} callBack={updateTodolistHandler}/>
            <IconButton onClick={onClickHandlerForRemoveTodolist}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm callBack={addTaskHandler}/>
        <div>
        <ul>
            {
                props.tasks.map(t => {
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        props.changeTaskStatus(props.todolistID, t.id, e.currentTarget.checked);
                    }

                    return <li key={t.id} className={t.isDone ? "is-done" : ""}>
                        <Checkbox
                            onChange={onChangeHandler}
                            checked={t.isDone}/>
                        <EditableSpan title={t.title} callBack={(title: string) => updateTaskHandler(t.id, title)}/>

                        <IconButton onClick={() => onClickHandlerForRemove(t.id)}>
                            <Delete/>
                        </IconButton>

                    </li>
                })
            }
        </ul>
        </div>
        <div>

            <Button variant={props.filter === 'all' ? 'contained' : 'text'}
                    onClick={() => changeFilter('all')}>All</Button>
            <Button variant={props.filter === 'active' ? 'contained' : 'text'}
                    onClick={() => changeFilter('active')}>Active</Button>
            <Button variant={props.filter === 'completed' ? 'contained' : 'text'}
                    onClick={() => changeFilter('completed')}>Completed</Button>

        </div>
    </div>
}
