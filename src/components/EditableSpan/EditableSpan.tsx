import {TextField} from '@mui/material';
import React, {ChangeEvent, KeyboardEvent, useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';
import {AppStatusType} from "../../app/app-reducer";
import {changeTaskEntityStatus} from "../../features/TodolistsList/tasks-reducer";

type EditableSpanType = {
    title: string
    callBack: (title: string) => void
    disabled?: boolean
}
export const EditableSpan = React.memo(({
                                            title,
                                            disabled = false,
                                            callBack
                                        }: EditableSpanType) => {

    const [edit, setEdit] = useState<boolean>(false)
    const [newTitle, setNewTitle] = useState(title)
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.currentTarget.value)
    }
    const editTrue = () => {
        if (!disabled) {
            setEdit(true)
        }
    }
    const editFalse = useCallback(() => {
        setEdit(false)
        callBack(newTitle)
    }, [callBack, newTitle])
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            editFalse()
        }
    }
    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => event.currentTarget.select()
    return (
        edit ? <TextField
            disabled={disabled}
            onFocus={handleFocus}
            variant={"standard"}
            value={newTitle}
            onKeyPress={onKeyPressHandler}
            onChange={onChangeHandler}
            onBlur={editFalse}
            autoFocus/> : <span onDoubleClick={editTrue}>{title}</span>
    )
})

