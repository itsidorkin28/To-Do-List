import React, {ChangeEvent, KeyboardEvent} from 'react';

type propsType = {
    title: string
    setTitle: (title: string) => void
    addTask: () => void
    error: boolean
    setError: (error: boolean) => void
}

const Input = (props: propsType) => {
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        props.setError(false)
        props.setTitle(e.currentTarget.value)
    }
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            props.addTask();
        }
    }
    return (
        <div>
            <input value={props.title}
                   onChange={onChangeHandler}
                   onKeyPress={onKeyPressHandler}
                   className={props.error ? "error" : ""}
            />
        </div>
    );
};

export default Input;