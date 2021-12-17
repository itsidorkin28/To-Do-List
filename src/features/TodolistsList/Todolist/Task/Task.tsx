import React, {ChangeEvent, useCallback} from 'react';
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "../../../../components/EditableSpan/EditableSpan";
import {Delete} from "@mui/icons-material";
import {TaskStatuses, TaskType} from "../../../../api/todolist-api";
import {changeTaskStatusThunk} from "../../tasks-reducer";
import {useDispatch} from 'react-redux';

type TaskPropsType = {
    task: TaskType
    todolistId: string
    updateTask: (taskID: string, title: string) => void
    removeTask: (taskID: string) => void
}

export const Task = React.memo(({task, updateTask, removeTask, todolistId}: TaskPropsType) => {
    const dispatch = useDispatch()
    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const newIsDoneValue = e.currentTarget.checked
        dispatch(changeTaskStatusThunk(task.id, newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New, todolistId))
    }, [dispatch, todolistId, task.id])
    return <li className={task.status === TaskStatuses.Completed ? "is-done" : ""}>
        <Checkbox
            onChange={onChangeHandler}
            checked={task.status === TaskStatuses.Completed}/>
        <EditableSpan title={task.title} callBack={(title: string) => updateTask(task.id, title)}/>

        <IconButton onClick={() => removeTask(task.id)}>
            <Delete/>
        </IconButton>

    </li>
})

