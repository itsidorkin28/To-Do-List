import React, {ChangeEvent, KeyboardEvent, useCallback, useState} from 'react';
import {IconButton, TextField} from "@mui/material";
import {ControlPoint} from "@mui/icons-material";

export type AddItemFormType = {
    callBack: (title: string) => void
}

export const AddItemForm = React.memo(({callBack}: AddItemFormType) => {
    let [title, setTitle] = useState("")
    let [error, setError] = useState<boolean>(false)
    const addTaskHandlerForAddTitle = useCallback(() => {
        if (title.trim()) {
            callBack(title.trim())
            setTitle("");
        } else {
            setError(true);
        }
    }, [callBack])
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setError(false)
        setTitle(e.currentTarget.value)
    }
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            addTaskHandlerForAddTitle();
        }
    }
    return (
        <div>
            <TextField
                value={title}
                onChange={onChangeHandler}
                onKeyPress={onKeyPressHandler}
                error={error}
                variant={'outlined'}
                label={error ? 'Incorrect title' : 'Type title'}
            />
            <IconButton onClick={addTaskHandlerForAddTitle} color={'primary'}>
                <ControlPoint/>
            </IconButton>
        </div>
    );
})

