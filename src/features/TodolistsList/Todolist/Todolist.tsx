import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import {Button, IconButton} from "@mui/material";
import {Delete} from '@mui/icons-material';
import {Task} from './Task/Task';
import {
    changeTodolistFilter,
    changeTodolistTitleThunk,
    deleteTodolistThunk,
    FilterValuesType
} from '../todolists-reducer';
import {TaskStatuses, TaskType} from '../../../api/todolist-api';
import { useDispatch } from 'react-redux';
import {changeTaskTitleThunk, createTaskThunk, removeTaskThunk, setTasksThunk} from "../tasks-reducer";

type PropsType = {
    todolistId: string
    title: string
    tasks: Array<TaskType>
    filter: FilterValuesType
}

export const Todolist = React.memo(({todolistId, ...props}: PropsType) => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(setTasksThunk(todolistId))
    }, [])

    const removeTodolistHandler = useCallback(() => {
        dispatch(deleteTodolistThunk(todolistId))
    }, [dispatch, todolistId])

    const changeFilter = useCallback((value: FilterValuesType) => {
        dispatch(changeTodolistFilter(todolistId, value))
    }, [dispatch, todolistId])

    const removeTaskHandler = useCallback((taskId: string) => {
        dispatch(removeTaskThunk(todolistId, taskId))
    }, [dispatch, todolistId])

    const addTaskHandler = useCallback((title: string) => {
        dispatch(createTaskThunk(todolistId, title))
    }, [dispatch, todolistId])

    const updateTaskHandler = useCallback((taskID: string, title: string) => {
        dispatch(changeTaskTitleThunk(taskID, title, todolistId))
    }, [dispatch, todolistId])

    const changeTodolistTitle = useCallback((title: string) => {
        dispatch(changeTodolistTitleThunk(todolistId, title))
    }, [dispatch, todolistId])


    let tasksForTodolist = props.tasks
    if (props.filter === "active") {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New);
    }
    if (props.filter === "completed") {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed);
    }

    return <div className='Todolist'>

        <h3><EditableSpan title={props.title} callBack={changeTodolistTitle}/>
            <IconButton onClick={removeTodolistHandler}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm callBack={addTaskHandler}/>
        <div>
            <ul>
                {
                    tasksForTodolist.map(t => <Task key={t.id}
                                                    task={t}
                                                    todolistId={todolistId}
                                                    removeTask={removeTaskHandler}
                                                    updateTask={updateTaskHandler}/>
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


