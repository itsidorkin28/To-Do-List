import React, {ChangeEvent, KeyboardEvent, useState} from "react";

type propsType = {
    addTask: (todolistID: string, title: string) => void
    todolistID: string
}

export const InputWithButton = (props: propsType) => {
    let [title, setTitle] = useState("")
    let [error, setError] = useState<boolean>(false)

    const addTask = () => {
        if (title.trim()) {
            props.addTask(props.todolistID, title.trim());
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
            addTask();
        }
    }
    return (
        <div>
            <input value={title}
                   onChange={onChangeHandler}
                   onKeyPress={onKeyPressHandler}
                   className={error ? "error" : ""}
            />
            <button onClick={addTask}>+</button>
            {error && <div className="error-message">{error}</div>}
        </div>
    )
}