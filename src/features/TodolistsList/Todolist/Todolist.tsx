import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import {Button, IconButton} from "@mui/material";
import {Delete} from '@mui/icons-material';
import {Task} from './Task/Task';
import {
    changeTodolistFilter,
    changeTodolistTitleTC,
    removeTodolistTC,
    FilterValuesType
} from '../todolists-reducer';
import {TaskStatuses} from '../../../api/todolist-api';
import {useDispatch} from 'react-redux';
import {addTaskTC, changeTaskTC, removeTaskTC, setTasksTC, TaskDomainType} from "../tasks-reducer";
import {AppStatusType} from "../../../app/app-reducer";


type PropsType = {
    todolistId: string
    title: string
    tasks: Array<TaskDomainType>
    filter: FilterValuesType
    demo?: boolean
    entityStatus: AppStatusType
}

export const Todolist = React.memo(({demo = false, entityStatus, todolistId, ...props}: PropsType) => {
    const dispatch = useDispatch()

    useEffect(() => {
        if (!demo) dispatch(setTasksTC(todolistId))
    }, [dispatch, todolistId, demo])

    const removeTodolistHandler = useCallback(() => {
        dispatch(removeTodolistTC(todolistId))
    }, [dispatch, todolistId])

    const changeFilter = useCallback((value: FilterValuesType) => {
        dispatch(changeTodolistFilter(todolistId, value))
    }, [dispatch, todolistId])

    const removeTaskHandler = useCallback((taskId: string) => {
        dispatch(removeTaskTC(todolistId, taskId))
    }, [dispatch, todolistId])

    const addTaskHandler = useCallback((title: string) => {
        dispatch(addTaskTC(todolistId, title))
    }, [dispatch, todolistId])

    const updateTaskHandler = useCallback((taskID: string, title: string) => {
        dispatch(changeTaskTC(taskID, {title}, todolistId))
    }, [dispatch, todolistId])

    const changeTodolistTitle = useCallback((title: string) => {
        dispatch(changeTodolistTitleTC(todolistId, title))
    }, [dispatch, todolistId])


    let tasksForTodolist = props.tasks
    if (props.filter === "active") {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New);
    }
    if (props.filter === "completed") {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed);
    }

    return <div className='Todolist'>

        <h3><EditableSpan title={props.title} callBack={changeTodolistTitle} disabled={entityStatus === 'loading'}/>
            <IconButton onClick={removeTodolistHandler} disabled={entityStatus === 'loading'}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm callBack={addTaskHandler} disabled={entityStatus === 'loading'}/>
        <div>
            <ul>
                {
                    tasksForTodolist.map(t => <Task key={t.id}
                                                    task={t}
                                                    todolistId={todolistId}
                                                    removeTask={removeTaskHandler}
                                                    updateTask={updateTaskHandler}
                                                    taskEntityStatus={t.taskEntityStatus}
                                                   />
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


