import React, {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from '../../app/store';
import {addTodolistTC, fetchTodolistsTC, TodolistDomainType} from './todolists-reducer';
import {TasksStateType} from './tasks-reducer';
import {Grid, Paper} from '@mui/material';
import {AddItemForm} from '../../components/AddItemForm/AddItemForm';
import {Todolist} from './Todolist/Todolist';
import {Navigate} from 'react-router-dom';

type TodosListType = {
    demo?: boolean
}

export const TodolistsList = React.memo(({demo = false}: TodosListType) => {

    const dispatch = useDispatch()
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)

    useEffect(() => {
        if (!isLoggedIn) {
            return
        }
        if (!demo) dispatch(fetchTodolistsTC())
    }, [dispatch, demo, isLoggedIn])


    const addTodolistHandler = useCallback((title: string) => {
        dispatch(addTodolistTC(title))
    }, [dispatch])
    if (!isLoggedIn) {
        return <Navigate to={'/login'}/>
    }
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
                                    entityStatus={tl.entityStatus}
                                />
                            </Paper>
                        </Grid>
                    )
                })
            }
        </Grid>
    </>


})