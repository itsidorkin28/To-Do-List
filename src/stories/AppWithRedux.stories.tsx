import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import {App} from "../App";
import {store} from "../state/store";
import {Provider} from "react-redux";
import {ReduxStoreProviderDecorator} from "../state/ReduxStoreProviderDecorator";

export default {
  title: 'Todolist/App',
  component: App,
  decorators: [ReduxStoreProviderDecorator]
} as ComponentMeta<typeof App>;


const Template: ComponentStory<typeof App> = (args) => <App />


export const AppWithReduxStory = Template.bind({});




