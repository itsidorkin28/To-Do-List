import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {action} from "@storybook/addon-actions";
import {Task} from "../components/Task";


export default {
    title: 'Todolist/Task',
    component: Task,
    args: {
        changeTaskStatus: action('changeTaskStatus'),
        removeTask: action('removeTask'),
        updateTask: action('updateTask'),
    }
} as ComponentMeta<typeof Task>;


const Template: ComponentStory<typeof Task> = (args) => {
    return <Task {...args}/>
}

export const TaskIsDoneStory = Template.bind({});

TaskIsDoneStory.args = {
    task: {id: '1ds23d3', isDone: true, title: 'React'},
    todolistID: '1d23df4',
}

export const TaskIsNotDoneStory = Template.bind({});

TaskIsNotDoneStory.args = {
    task: {id: '2ds23d3', isDone: false, title: 'Vue'},
    todolistID: '2d23df4',
}




