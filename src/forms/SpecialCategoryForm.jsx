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

export default function SpecialCategoryForm(props) {
    const [open, toggleOpen] = useToggle(false);
    const [specialCategory, setSpecialCategory] = useState(props.specialCategory)
    const { handleNotification } = useContext(NotificationContext);

    const onChange = (e) => {
        
    };

    const handleClickOpen = () => {
        setSpecialCategory(props.specialCategory)
        toggleOpen();
    };
    const handleClose = () => {
        toggleOpen();
        setSpecialCategory('');
    };

    const handleChangespecialCategory = (event, newspecialCategory) => {
        setSpecialCategory(newspecialCategory);
    };

    

    const handleSubmit = () => {
        axios.put(`http://localhost:3000/api/v1/product/specialCategory`, {id:props.id, specialCategory}, {
            headers: {
                'authorization': localStorage.getItem('token')
            }
        })
            .then((res) => {
                setSpecialCategory(res.data.product.specialCategory);
                toggleOpen();
                setSpecialCategory('');
                handleNotification('success', `product added to ${specialCategory} list successfully`)
            });
    }

    return (
        <div>
            <Button aria-label="close" startIcon={<EditIcon />} onClick={handleClickOpen}>change special category</Button>
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Change specialCategory
                </DialogTitle>
                <DialogContent dividers>
                    <ToggleButtonGroup
                        value={specialCategory}
                        exclusive
                        onChange={handleChangespecialCategory}
                    >
                        <ToggleButton value="regular">
                            regular
                        </ToggleButton>
                        <ToggleButton value="special-1">
                            special-1
                        </ToggleButton>
                        <ToggleButton value="special-2">
                            special-2
                        </ToggleButton>
                        <ToggleButton value="special-3">
                            special-3
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
