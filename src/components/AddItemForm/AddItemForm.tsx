import React, {
	ChangeEvent,
	KeyboardEvent,
	useCallback,
	useState,
} from 'react';
import { IconButton, TextField } from '@mui/material';
import { ControlPoint } from '@mui/icons-material';

export type AddItemFormType = {
	callBack: (title: string) => void;
	disabled?: boolean;
};

export const AddItemForm = React.memo(
	({ disabled = false, callBack }: AddItemFormType) => {
		const [title, setTitle] = useState('');
		const [error, setError] = useState<boolean>(false);
		const onClickAddHandler = useCallback(() => {
			if (title.trim()) {
				callBack(title.trim());
				setTitle('');
			} else {
				setError(true);
			}
		}, [title, callBack]);
		const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
			setError(false);
			setTitle(e.currentTarget.value);
		};
		const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Enter') {
				onClickAddHandler();
			}
		};
		return (
			<div>
				<TextField
					value={title}
					disabled={disabled}
					onChange={onChangeHandler}
					onKeyPress={onKeyPressHandler}
					error={error}
					variant={'outlined'}
					label={error ? 'Incorrect title' : 'Type title'}
				/>
				<IconButton
					onClick={onClickAddHandler}
					color={'primary'}
					disabled={disabled}
				>
					<ControlPoint />
				</IconButton>
			</div>
		);
	}
);
