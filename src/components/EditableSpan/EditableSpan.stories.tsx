import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { EditableSpan } from './EditableSpan';
import { action } from '@storybook/addon-actions';

export default {
    title: 'Todolist/EditableSpan',
    component: EditableSpan,
} as ComponentMeta<typeof EditableSpan>;

const Template: ComponentStory<typeof EditableSpan> = (args) => (
    <EditableSpan {...args} />
);

export const EditableSpanStory = Template.bind({});

EditableSpanStory.args = {
    title: 'Some text',
    callBack: action('onChange'),
};
