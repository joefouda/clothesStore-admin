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

export default function MainListForm(props) {
    const [open, toggleOpen] = useToggle(false);
    const [mainList, setMainList] = useState(props.mainList)
    const { handleNotification } = useContext(NotificationContext);

    const handleClickOpen = () => {
        setMainList(props.mainList)
        toggleOpen();
    };
    const handleClose = () => {
        toggleOpen();
        setMainList('');
    };

    const handleChangeMainList = (event, newMainList) => {
        setMainList(newMainList);
    };

    
    const handleSubmit = () => {
        axios.put(`http://localhost:3000/api/v1/product/mainList`, {id:props.id, mainList}, {
            headers: {
                'authorization': localStorage.getItem('token')
            }
        })
            .then((res) => {
                setMainList(res.data.product.mainList);
                toggleOpen();
                setMainList('');
                handleNotification('success', `product added to ${mainList} list successfully`)
            });
    }

    return (
        <div>
            <Button aria-label="close" startIcon={<EditIcon />} onClick={handleClickOpen}>change special category</Button>
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Change mainList
                </DialogTitle>
                <DialogContent dividers>
                    <ToggleButtonGroup
                        value={mainList}
                        exclusive
                        onChange={handleChangeMainList}
                    >
                        <ToggleButton value="regular">
                            regular
                        </ToggleButton>
                        <ToggleButton value="nav-link">
                            nav-link
                        </ToggleButton>
                        <ToggleButton value="main-slider">
                            main-slider
                        </ToggleButton>
                        <ToggleButton value="special-1">
                            special-1
                        </ToggleButton>
                        <ToggleButton value="special-2">
                            special-2
                        </ToggleButton>
                        <ToggleButton value="featured">
                            featured
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
