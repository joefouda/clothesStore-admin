import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { styled } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import ImageUploadForm from "./ImageUploadForm";
import useToggle from '../customHooks/useToggle';
import { DispatchSubCategoriesContext } from '../contexts/SubCategoriesContext';
import { NotificationContext } from '../App';
import { useContext } from 'react';
import axios from 'axios'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const MyTextField = styled(TextField)(({ theme }) => ({
    width: '100%',
    margin: '5px 0 5px 0'
}));

const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;
    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

export default function SubCategoryForm(props) {
    const { handleNotification } = useContext(NotificationContext);
    const dispatchSubCategories = useContext(DispatchSubCategoriesContext)
    const [open, toggleOpen] = useToggle(false);
    const [imageSource, setImageSource] = useState(props.data?.photo)
    const [name, setName] = useState(props.data?.name)
    const [touchedName, toggleTouchedName] = useToggle(false)

    const handleClickOpen = () => {
        toggleOpen();
        setName(props.data?.name)
        setImageSource(props.data?.photo)
    };
    const handleClose = () => {
        toggleOpen();
        toggleTouchedName(false)
        setName('')
        setImageSource('')
    };
    const handleSubmit = () => {
        let data = { photo: imageSource, name, category: props.categoryID }
        if (props.mode === 'Add') {
            axios.post('http://localhost:3000/api/v1/subCategory', data, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).then(res => {
                console.log(res)
                dispatchSubCategories({ type: 'ADD', subCategory: res.data.subCategory })
                handleNotification('success', "Sub Category Added Successfully")
            })
        } else {
            axios.put(`http://localhost:3000/api/v1/subCategory/${props.data._id}`, data, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).then(res => {
                dispatchSubCategories({ type: 'UPDATE', subCategory: res.data.subCategory })
                handleNotification('success', "Sub Category Updated Successfully")
            }).catch(error => {
                console.log(error)
            })
        }

        toggleTouchedName(false)
        setName('')
        setImageSource('')
        toggleOpen();
    }
    const handleImageChange = (childData) => {
        setImageSource(childData)
    }
    return (
        <div>
            {props.mode === 'Add' ? <Button
                onClick={handleClickOpen}
                color="primary"
                startIcon={<AddIcon />}
            >
                Add new Sub Category
            </Button> : <IconButton aria-label="edit" onClick={handleClickOpen}><EditIcon /></IconButton>}
            <BootstrapDialog
                onClose={handleClose}
                maxWidth="xs"
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {`${props.mode} Sub Category`}
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <ImageUploadForm photo={imageSource} setImage={handleImageChange} />

                    <MyTextField required helperText={!name && touchedName ? 'required' : ''} error={!name && touchedName ? true : false} variant="outlined" id="name" name="name" onChange={e => {
                        setName(e.target.value)
                        toggleTouchedName(true)
                    }} label="Name" placeholder='Name' defaultValue={name} />
                </DialogContent>
                <DialogActions>
                    <Button color="primary" disabled={!name || !imageSource ? true : false} onClick={handleSubmit}>
                        {props.mode === 'Add' ? 'Add' : 'Save changes'}
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}
