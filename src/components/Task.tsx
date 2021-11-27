import React, {ChangeEvent, useCallback} from 'react';
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@mui/icons-material";
import {TaskType} from "../Todolist";

type TaskPropsType = {
    task: TaskType
    todolistID: string
    updateTask: (taskID: string, title: string) => void
    removeTask: (taskID: string) => void
    changeTaskStatus: (todolistID: string, taskId: string, isDone: boolean) => void
}

export const Task = React.memo(({task, updateTask, removeTask, changeTaskStatus, todolistID}: TaskPropsType) => {
    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        changeTaskStatus(todolistID, task.id, e.currentTarget.checked);
    }, [todolistID, task.id])

    return <li className={task.isDone ? "is-done" : ""}>
        <Checkbox
            onChange={onChangeHandler}
            checked={task.isDone}/>
        <EditableSpan title={task.title} callBack={(title: string) => updateTask(task.id, title)}/>

        <IconButton onClick={() => removeTask(task.id)}>
            <Delete/>
        </IconButton>

    </li>
})

