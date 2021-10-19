import React, {ChangeEvent, KeyboardEvent, useState} from 'react';

type AddItemFormType = {
    callBack: (title: string) => void
}

export const AddItemForm = (props: AddItemFormType) => {
    let [title, setTitle] = useState("")
    let [error, setError] = useState<boolean>(false)
    const addTaskHandlerForAddTitle = () => {
        if (title.trim()) {
            props.callBack(title.trim())
            setTitle("");
        } else {
            setError(true);
        }
    }
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
            <div>
                <input value={title}
                       onChange={onChangeHandler}
                       onKeyPress={onKeyPressHandler}
                       className={error ? "error" : ""}
                />
            </div>
            <button onClick={addTaskHandlerForAddTitle}>+</button>
        </div>
    );
};

