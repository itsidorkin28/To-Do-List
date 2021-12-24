import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {AddItemForm} from './AddItemForm';
import {action} from "@storybook/addon-actions";

export default {
    title: 'Todolist/AddItemForm',
    component: AddItemForm,
    argTypes: {
        callBack: {
            description: 'Button inside form clicked'
        },
    },
} as ComponentMeta<typeof AddItemForm>;


const Template: ComponentStory<typeof AddItemForm> = (args) => <AddItemForm {...args} />;

export const AddItemFormBaseExample = Template.bind({});
AddItemFormBaseExample.args = {
    callBack: action('Button inside form clicked')
};

export const AddItemFormDisabledExample = Template.bind({});

AddItemFormDisabledExample.args = {
    disabled: true
}


