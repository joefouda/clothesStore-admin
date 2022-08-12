import React, { useState, useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { NotificationContext } from '../App'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import axios from 'axios'
import Chip from '@material-ui/core/Chip';
import useToggle from '../customHooks/useToggle';

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

export default function OrderStateForm(props) {
    const [open, toggleOpen] = useToggle(false);
    const [state, setState] = useState(props.state)
    const { handleNotification } = useContext(NotificationContext);

    const handleClickOpen = () => {
        setState(props.state)
        toggleOpen();
    };
    const handleClose = () => {
        toggleOpen();
        setState('');
    };

    const handleChangeState = (event, newState) => {
        setState(newState);
    };

    const handleSubmit = () => {
        props.toggleProgress()
        axios.put('http://localhost:3000/api/v1/order', { id: props.orderId, state }, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then((response) => {
            axios.get('http://localhost:3000/api/v1/order', {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).then((res) => {
                props.setData(res.data.orders)
                toggleOpen();
                setState('');
                props.toggleProgress()
                handleNotification('success', response.data)
            })
        })
    }

    return (
        <div>
            <Chip label={props.state} color={props.state === 'pending'?'default':props.state === 'canceled'?'secondary':'primary'}/> <IconButton aria-label="close" onClick={handleClickOpen}><EditIcon /></IconButton>
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Change State
                </DialogTitle>
                <DialogContent dividers>
                    <ToggleButtonGroup
                        value={state}
                        exclusive
                        onChange={handleChangeState}
                    >
                        <ToggleButton value="pending">
                            Pending
                        </ToggleButton>
                        <ToggleButton value="shipped">
                            Shipped
                        </ToggleButton>
                        <ToggleButton value="delivered">
                            Delivered
                        </ToggleButton>
                        <ToggleButton value="canceled">
                            Canceled
                        </ToggleButton>
                    </ToggleButtonGroup>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleSubmit} color="primary">
                        Save changes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
