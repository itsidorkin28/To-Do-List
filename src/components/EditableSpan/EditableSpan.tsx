import { TextField } from '@mui/material';
import React, {ChangeEvent, KeyboardEvent, useCallback, useState} from 'react';

type EditableSpanType = {
    title: string
    callBack: (title: string) => void
}
export const EditableSpan = React.memo(({title, callBack}: EditableSpanType) => {
    const [edit, setEdit] = useState<boolean>(false)
    const [newTitle, setNewTitle] = useState(title)
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.currentTarget.value)
    }
    const editTrue = () => {
        setEdit(true)
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
            onFocus={handleFocus}
            variant={"standard"}
            value={newTitle}
            onKeyPress={onKeyPressHandler}
            onChange={onChangeHandler}
            onBlur={editFalse}
            autoFocus/> : <span onDoubleClick={editTrue}>{title}</span>
    )
})

