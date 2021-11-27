import React, { useCallback } from 'react';
import './App.scss';
import {Todolist} from './Todolist';
import {AddItemForm} from "./components/AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from '@mui/material';
import {Menu} from '@mui/icons-material';
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    TodolistsType
} from "./state/todolists-reducer";
import {
    addTaskAC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    removeTaskAC,
    TasksType
} from "./state/tasks-reducer";
import {useDispatch, useSelector} from 'react-redux';
import {AppRootState} from "./state/store";

export type FilterValuesType = "all" | "active" | "completed";

export const AppWithRedux = () => {
    console.log('AppWithRedux render...')

    const disptach = useDispatch()
    const todolists = useSelector<AppRootState, Array<TodolistsType>>(state => state.todolists)
    const tasks = useSelector<AppRootState, TasksType>(state => state.tasks)

    const removeTodolist = useCallback((todolistID: string) => {
        const action = removeTodolistAC(todolistID)
        disptach(action)
    }, [disptach])

    const removeTask = useCallback((todolistID: string, id: string) => {
        disptach(removeTaskAC(id, todolistID))
    }, [disptach])

    const addTask = useCallback((todolistID: string, title: string) => {
        disptach(addTaskAC(title, todolistID))
    }, [disptach])

    const changeStatus = useCallback((todolistID: string, taskId: string, isDone: boolean) => {
        disptach(changeTaskStatusAC(taskId, isDone, todolistID))
    }, [disptach])

    const changeFilter = useCallback((todolistID: string, value: FilterValuesType) => {
        disptach(changeTodolistFilterAC(todolistID, value))
    }, [disptach])

    const addTodolist = useCallback((title: string) => {
        const action = addTodolistAC(title)
        disptach(action)
    }, [disptach])

    const updateTask = useCallback((todolistID: string, taskID: string, title: string) => {
        disptach(changeTaskTitleAC(taskID, title, todolistID))
    }, [disptach])
    const changeTodolistTitle = useCallback((todolistID: string, title: string) => {
        disptach(changeTodolistTitleAC(todolistID, title))
    }, [disptach])

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

                        return (
                            <Grid item key={m.id}>
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
                                        changeTodolistTitle={changeTodolistTitle}
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
