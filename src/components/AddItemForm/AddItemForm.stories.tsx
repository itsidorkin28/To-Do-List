import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AddItemForm } from './AddItemForm';
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

export const AddItemFormStory = Template.bind({});

AddItemFormStory.args = {
  callBack: action('Button inside form clicked')
};


