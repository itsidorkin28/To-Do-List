import {ComponentStory, ComponentMeta} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {Task} from './Task';
import {TaskPriorities, TaskStatuses} from '../../../../api/todolist-api';
import {storyBookStore} from '../../../../app/ReduxStoreProviderDecorator';
import {Provider} from 'react-redux';

export default {
	title: 'Todolist/Task',
	component: Task,
	args: {
		removeTask: action('removeTask'),
		updateTask: action('updateTask'),
	},
} as ComponentMeta<typeof Task>;

const Template: ComponentStory<typeof Task> = (args) => {
	return (
		<Provider store={storyBookStore}>
			<Task {...args} />
		</Provider>
	);
};

export const TaskIsDoneStory = Template.bind({});

TaskIsDoneStory.args = {
	task: {
		id: '1ds23d3',
		title: 'React',
		status: TaskStatuses.Completed,
		todoListId: '1d23df4',
		startDate: '',
		deadline: '',
		addedDate: '',
		order: 0,
		priority: TaskPriorities.Low,
		description: '',
	},
	todolistId: '1d23df4',
	taskEntityStatus: 'idle',
};

export const TaskIsNotDoneStory = Template.bind({});

TaskIsNotDoneStory.args = {
	task: {
		id: '2ds23d3',
		title: 'React',
		status: TaskStatuses.New,
		todoListId: '1d23df4',
		startDate: '',
		deadline: '',
		addedDate: '',
		order: 0,
		priority: TaskPriorities.Low,
		description: '',
	},
	todolistId: '2d23df4',
	taskEntityStatus: 'idle',
};
