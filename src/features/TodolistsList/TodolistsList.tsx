import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {addTodolistTC, setTodolistsTC, TodolistDomainType} from "./todolists-reducer";
import {TasksStateType} from "./tasks-reducer";
import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";

export const TodolistsList = React.memo(() => {

    const dispatch = useDispatch()
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)

    useEffect(() => {
        dispatch(setTodolistsTC())
    }, [dispatch])


    const addTodolistHandler = useCallback((title: string) => {
        dispatch(addTodolistTC(title))
    }, [dispatch])

    return <>
        <Grid container style={{padding: '20px 0'}}>
            <AddItemForm callBack={addTodolistHandler}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let tasksForTodolist = tasks[tl.id];

                    return (
                        <Grid item key={tl.id}>
                            <Paper style={{padding: '10px'}}>
                                <Todolist
                                    key={tl.id}
                                    todolistId={tl.id}
                                    title={tl.title}
                                    tasks={tasksForTodolist}
                                    filter={tl.filter}
                                />
                            </Paper>
                        </Grid>
                    )
                })
            }
        </Grid>
    </>
})