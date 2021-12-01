import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import {AppWithRedux} from "../AppWithRedux";
import {store} from "../state/store";
import {Provider} from "react-redux";
import {ReduxStoreProviderDecorator} from "../state/ReduxStoreProviderDecorator";

export default {
  title: 'Todolist/AppWithRedux',
  component: AppWithRedux,
  decorators: [ReduxStoreProviderDecorator]
} as ComponentMeta<typeof AppWithRedux>;


const Template: ComponentStory<typeof AppWithRedux> = (args) => <AppWithRedux />


export const AppWithReduxStory = Template.bind({});




