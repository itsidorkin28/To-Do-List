import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Task } from './Task';
import { TaskPriorities, TaskStatuses } from '../../../../api/todolist-api';

export default {
	title: 'Todolist/Task',
	component: Task,
	args: {
		changeTaskStatus: action('changeTaskStatus'),
		removeTask: action('removeTask'),
		changeTask: action('updateTask'),
	},
} as ComponentMeta<typeof Task>;

const Template: ComponentStory<typeof Task> = (args) => {
	return <Task {...args} />;
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
};
