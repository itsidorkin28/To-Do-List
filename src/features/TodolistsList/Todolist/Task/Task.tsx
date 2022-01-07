import React, { ChangeEvent, useCallback } from 'react';
import { Checkbox, IconButton } from '@mui/material';
import { EditableSpan } from '../../../../components/EditableSpan/EditableSpan';
import { Delete } from '@mui/icons-material';
import { TaskStatuses, TaskType } from '../../../../api/todolist-api';
import { changeTaskTC } from '../../tasks-reducer';
import { useDispatch } from 'react-redux';
import { AppStatusType } from '../../../../app/app-reducer';

type TaskPropsType = {
    task: TaskType;
    todolistId: string;
    updateTask: (taskID: string, title: string) => void;
    removeTask: (taskID: string) => void;
    taskEntityStatus: AppStatusType;
};

export const Task = React.memo(
    ({
        taskEntityStatus,
        task,
        updateTask,
        removeTask,
        todolistId,
    }: TaskPropsType) => {
        const dispatch = useDispatch();

        const onChangeHandler = useCallback(
            (e: ChangeEvent<HTMLInputElement>) => {
                const newIsDoneValue = e.currentTarget.checked;
                dispatch(
                    changeTaskTC(
                        task.id,
                        {
                            status: newIsDoneValue
                                ? TaskStatuses.Completed
                                : TaskStatuses.New,
                        },
                        todolistId
                    )
                );
            },
            [dispatch, todolistId, task.id]
        );

        return (
            <li
                className={
                    task.status === TaskStatuses.Completed ? 'is-done' : ''
                }
            >
                <Checkbox
                    disabled={taskEntityStatus === 'loading'}
                    onChange={onChangeHandler}
                    checked={task.status === TaskStatuses.Completed}
                />
                <EditableSpan
                    title={task.title}
                    callBack={(title: string) => updateTask(task.id, title)}
                    disabled={taskEntityStatus === 'loading'}
                />

                <IconButton
                    onClick={() => removeTask(task.id)}
                    disabled={taskEntityStatus === 'loading'}
                >
                    <Delete />
                </IconButton>
            </li>
        );
    }
);
