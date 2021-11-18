import React, {useReducer} from 'react';
import './App.scss';
import {Todolist} from './Todolist';
import {v1} from 'uuid';
import {AddItemForm} from "./components/AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from '@mui/material';
import {Menu} from '@mui/icons-material';
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    todolistsReducer,
    TodolistsType
} from "./state/todolists-reducer";
import {
    addTaskAC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    removeTaskAC,
    tasksReducer,
    TasksType
} from "./state/tasks-reducer";
import {useDispatch, useSelector} from 'react-redux';
import {AppRootState} from "./state/store";

export type FilterValuesType = "all" | "active" | "completed";

export const AppWithRedux = () => {

    const disptach = useDispatch()
    const todolists = useSelector<AppRootState, Array<TodolistsType>>(state => state.todolists)
    const tasks = useSelector<AppRootState, TasksType>(state => state.tasks)

    const removeTodolist = (todolistID: string) => {
        const action = removeTodolistAC(todolistID)
        disptach(action)
    }

    function removeTask(todolistID: string, id: string) {
        disptach(removeTaskAC(id, todolistID))
    }

    function addTask(todolistID: string, title: string) {
        disptach(addTaskAC(title, todolistID))
    }

    function changeStatus(todolistID: string, taskId: string, isDone: boolean) {
        disptach(changeTaskStatusAC(taskId, isDone, todolistID))
    }

    function changeFilter(todolistID: string, value: FilterValuesType) {
        disptach(changeTodolistFilterAC(todolistID, value))
    }

    const addTodolist = (title: string) => {
        const action = addTodolistAC(title)
        disptach(action)
    }

    const updateTask = (todolistID: string, taskID: string, title: string) => {
        disptach(changeTaskTitleAC(taskID, title, todolistID))
    }
    const updateTodolist = (todolistID: string, title: string) => {
        disptach(changeTodolistTitleAC(todolistID, title))
    }
    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                    >
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        TO DO LIST
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: '20px 0'}}>
                    <AddItemForm callBack={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {todolists.map(m => {
                        let tasksForTodolist = tasks[m.id];

                        if (m.filter === "active") {
                            tasksForTodolist = tasks[m.id].filter(t => !t.isDone);
                        }
                        if (m.filter === "completed") {
                            tasksForTodolist = tasks[m.id].filter(t => t.isDone);
                        }
                        return (
                            <Grid item>
                                <Paper style={{padding: '10px'}}>
                                    <Todolist
                                        key={m.id}
                                        todolistID={m.id}
                                        title={m.title}
                                        tasks={tasksForTodolist}
                                        removeTask={removeTask}
                                        changeFilter={changeFilter}
                                        addTask={addTask}
                                        changeTaskStatus={changeStatus}
                                        filter={m.filter}
                                        removeTodolist={removeTodolist}
                                        updateTask={updateTask}
                                        updateTodolist={updateTodolist}
                                    />
                                </Paper>
                            </Grid>
                        )
                    })}
                </Grid>
            </Container>
        </div>

    );
}
