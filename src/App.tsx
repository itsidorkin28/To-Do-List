import React, {useCallback, useEffect} from 'react';
import './App.css';
import {Todolist} from './Todolist';
import {AddItemForm} from "./components/AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from '@mui/material';
import {Menu} from '@mui/icons-material';
import {
    addTodolist,
    changeTodolistFilter,
    changeTodolistTitle,
    FilterValuesType,
    removeTodolist, setTodolists, setTodolistsThunk, TodolistDomainType,
} from "./state/todolists-reducer";
import {
    addTask,
    changeTaskStatus,
    changeTaskTitle,
    removeTask,
    TasksStateType,
} from "./state/tasks-reducer";
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from "./state/store";
import {TaskStatuses, todolistApi} from "./api/todolist-api";


export const App = () => {
    console.log('App render...')

    const dispatch = useDispatch()
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)

    useEffect(() => {
        dispatch(setTodolistsThunk())
    }, [])

    const removeTodolist = useCallback((todolistID: string) => {
        const action = removeTodolist(todolistID)
        dispatch(action)
    }, [dispatch])

    const removeTask = useCallback((todolistID: string, id: string) => {
        dispatch(removeTask(id, todolistID))
    }, [dispatch])

    const addTask = useCallback((todolistID: string, title: string) => {
        dispatch(addTask(title, todolistID))
    }, [dispatch])

    const changeStatus = useCallback((todolistID: string, taskId: string, status: TaskStatuses) => {
        dispatch(changeTaskStatus(taskId, status, todolistID))
    }, [dispatch])

    const changeFilter = useCallback((todolistID: string, value: FilterValuesType) => {
        dispatch(changeTodolistFilter(todolistID, value))
    }, [dispatch])

    const addTodolist = useCallback((title: string) => {
        const action = addTodolist(title)
        dispatch(action)
    }, [dispatch])

    const updateTask = useCallback((todolistID: string, taskID: string, title: string) => {
        dispatch(changeTaskTitle(taskID, title, todolistID))
    }, [dispatch])
    const changeTodolistTitle = useCallback((todolistID: string, title: string) => {
        dispatch(changeTodolistTitle(todolistID, title))
    }, [dispatch])

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
