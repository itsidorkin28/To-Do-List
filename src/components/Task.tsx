import React, {ChangeEvent, useCallback} from 'react';
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@mui/icons-material";
import {TaskStatuses, TaskType} from "../api/todolist-api";

type TaskPropsType = {
    task: TaskType
    todolistID: string
    updateTask: (taskID: string, title: string) => void
    removeTask: (taskID: string) => void
    changeTaskStatus: (todolistID: string, taskId: string, status: TaskStatuses) => void
}

export const Task = React.memo(({task, updateTask, removeTask, changeTaskStatus, todolistID}: TaskPropsType) => {
    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const newIsDoneValue = e.currentTarget.checked
        changeTaskStatus(todolistID, task.id, newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New);
    }, [changeTaskStatus, todolistID, task.id])

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

