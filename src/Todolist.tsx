import React, {useCallback} from 'react';
import {AddItemForm} from "./components/AddItemForm";
import {EditableSpan} from "./components/EditableSpan";
import {Button, IconButton} from "@mui/material";
import {Delete} from '@mui/icons-material';
import {Task} from './components/Task';
import { FilterValuesType } from './state/todolists-reducer';
import {TaskStatuses, TaskType} from './api/todolist-api';

type PropsType = {
    todolistID: string
    title: string
    tasks: Array<TaskType>
    removeTask: (todolistID: string, taskId: string) => void
    changeFilter: (todolistID: string, value: FilterValuesType) => void
    addTask: (todolistID: string, title: string) => void
    changeTaskStatus: (todolistID: string, taskId: string, status: TaskStatuses) => void
    filter: FilterValuesType
    removeTodolist: (todolistID: string) => void
    updateTask: (todolistID: string, taskID: string, title: string) => void
    changeTodolistTitle: (todolistID: string, title: string) => void
}

export const Todolist = React.memo((props: PropsType) => {
    const onClickHandlerForRemoveTodolist = useCallback(() => {
        props.removeTodolist(props.todolistID)
    }, [ props.removeTodolist, props.todolistID])
    const changeFilter = useCallback((value: FilterValuesType) => {
        props.changeFilter(props.todolistID, value)
    }, [props.changeFilter, props.todolistID])
    const onClickHandlerForRemove = useCallback((taskID: string) => {
        props.removeTask(props.todolistID, taskID)
    }, [props.removeTask, props.todolistID])
    const addTaskHandler = useCallback((title: string) => props.addTask(props.todolistID, title), [props.addTask, props.todolistID])
    const updateTaskHandler = useCallback((taskID: string, title: string) => {
        props.updateTask(props.todolistID, taskID, title)
    }, [props.updateTask, props.todolistID])
    const changeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle(props.todolistID, title)
    }, [props.changeTodolistTitle, props.todolistID])

    let tasksForTodolist = props.tasks
    if (props.filter === "active") {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New);
    }
    if (props.filter === "completed") {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed);
    }

    return <div className='Todolist'>

        <h3><EditableSpan title={props.title} callBack={changeTodolistTitle}/>
            <IconButton onClick={onClickHandlerForRemoveTodolist}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm callBack={addTaskHandler}/>
        <div>
            <ul>
                {
                    tasksForTodolist.map(t => <Task key={t.id}
                                                    task={t}
                                                    todolistID={props.todolistID}
                                                    removeTask={onClickHandlerForRemove}
                                                    updateTask={updateTaskHandler}
                                                    changeTaskStatus={props.changeTaskStatus}/>
                    )
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
})
