import React, { useEffect } from 'react';
import { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import Button from '@material-ui/core/Button';
import Authentication from '../auth/authentication';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import { NotificationContext } from '../App'
import useInput from '../customHooks/useInput';

const useStyles = makeStyles((theme) => ({
    errorMessage: {
        width: '60vw',
        position: 'absolute',
        top: '20%',
        left: '20%'
    },
    progress: {
        position: 'absolute',
        top: '48%',
        left: '48%'
    },
    card: {
        width: '60vw',
        marginTop: '30vh',
        margin: 'auto',
        boxShadow: '2px 2px 10px grey'
    },
    rootForm: {
        display: 'flex',
        '& .MuiTextField-root': {
            width: '100%',
            paddingBottom: '2vh'
        },
    },
    content: {
        flexDirection: 'column',
        width: '50%',
        boxSizing: 'border-box',
        padding: '3vw 2vh 3vh 2vh'
    },
    cover: {
        width: '50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    playIcon: {
        height: 38,
        width: 38,
    },
    buttonContainer: {
        margin: 'auto',
    },
    button: {
        fontSize: '2em'
    }
}));

export default function Login(props) {
    const classes = useStyles();
    const navigate = useNavigate();
    const [progress, setProgress] = useState(false)
    const [userName, updateUserName] = useInput("")
    const [password, updatePassword] = useInput("")
    const [errors, setErrors] = useState({ userName: "", password: "" });
    const isInitialMount = useRef(true);
    const isInitialMount2 = useRef(true);
    const { handleNotification } = useContext(NotificationContext);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (!userName) {
                setErrors((oldErrors) => ({ ...oldErrors, userName: 'Required' }))
            } else if (userName.length < 4) {
                setErrors((oldErrors) => ({ ...oldErrors, userName: 'Must be 4 characters or more' }))
            } else {
                setErrors((oldErrors) => ({ ...oldErrors, userName: '' }))
            }
        }
    }, [userName])

    useEffect(() => {
        if (isInitialMount2.current) {
            isInitialMount2.current = false;
        } else {
            if (!password) {
                setErrors((oldErrors) => ({ ...oldErrors, password: 'Required' }))
            } else if (password.length < 8) {
                setErrors((oldErrors) => ({ ...oldErrors, password: 'Must be 8 characters or more' }))
            } else {
                setErrors((oldErrors) => ({ ...oldErrors, password: '' }))
            }
        }
    }, [password])

    const handleSubmit = (event) => {
        event.preventDefault()
        setProgress(true)
        let data = { userName, password }
        Authentication.logIn(data).then((res) => {
            setProgress(false)
            if (res.data.status === 422) {
                handleNotification('error', "Invalid Username or Password")
            } else {
                localStorage.setItem('token', res.data.token)
                navigate('/')
            }
        }).catch(error => {
            handleNotification('error', "Server Error")
        })
    }

    return (
        <>
            {progress ? <CircularProgress className={classes.progress} /> : <Card variant="outlined" className={classes.card}>
                <form className={classes.rootForm} onSubmit={handleSubmit} autoComplete="off">
                    <div className={classes.content}>
                        <div>
                            <TextField variant="outlined" id="userName" error={errors.userName ? true : false} helperText={errors.userName} name="userName" onKeyUp={updateUserName} label="User Name" placeholder='User Name' />
                        </div>
                        <div>
                            <TextField variant="outlined" id="password" error={errors.password ? true : false} helperText={errors.password} name="password" onKeyUp={updatePassword} type="password" label="Password" placeholder='Password' />
                        </div>
                    </div>
                    <Divider orientation="vertical" flexItem />
                    <div
                        className={classes.cover}
                    >
                        <div className={classes.buttonContainer}>
                            <Button
                                disabled={errors.userName || errors.password || !userName || !password ? true : false}
                                color="primary"
                                className={classes.button}
                                startIcon={<LockOpenIcon style={{ fontSize: '1em' }} />}
                                type="submit"
                            >
                                Log In
                            </Button>
                        </div>
                    </div>
                </form>
            </Card>}
        </>
    );
}