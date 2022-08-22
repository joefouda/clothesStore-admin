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
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import VariantForm from './VariantForm'
import useToggle from '../customHooks/useToggle';
import { NotificationContext } from '../App';
import { useContext } from 'react';
import axios from 'axios'
import { useEffect } from 'react';

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

export default function ModelForm(props) {
    const { handleNotification } = useContext(NotificationContext);
    const [open, toggleOpen] = useToggle(false);
    const [name, setName] = useState(props.data?.name)
    const [variants, setVariants] = useState(props.data?.variants || {colors: [], sizes: []})

    const handleClickOpen = () => {
        toggleOpen(true);
        setName(props.data?.name)
        setVariants(props.data?.variants || {colors: [], sizes: []})
    };
    const handleClose = () => {
        toggleOpen(false);
        setName('')
        setVariants({})
    };

    const handleEditVariant = (key, newValue) => {
        setVariants((oldVariants) => ({...oldVariants, [key]:newValue}))
    }

    const handleSubmit = () => {
        props.toggleProgress()
        if (props.mode === 'Add') {
            let data = { name, variants, subCategory: props.subCategoryID, category: props.categoryID }
            axios.post('http://localhost:3000/api/v1/model', data, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).then(res => {
                props.addElement(res.data.model)
                handleNotification('success', "Model Added Successfully")
                props.toggleProgress()
            }).catch(error => {
                handleNotification('error', "Server Error")
            })
        } else {
            let data = { name, variants}
            axios.put(`http://localhost:3000/api/v1/model/${props.data._id}`, data, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).then(res => {
                props.editElement(res.data.model)
                handleNotification('success', "Model Updated Successfully")
                props.toggleProgress()
            }).catch(error => {
                handleNotification('error', "Server Error")
            })
        }

        setName('')
        setVariants([])
        toggleOpen(false);
    }
    return (
        <div>
            {props.mode === 'Add' ? <Button
                onClick={handleClickOpen}
                color="primary"
                startIcon={<AddIcon />}
            >
                Add new Model
            </Button> : <IconButton aria-label="edit" onClick={handleClickOpen}><EditIcon /></IconButton>}
            <BootstrapDialog
                onClose={handleClose}
                maxWidth="xs"
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {`${props.mode} Model`}
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <MyTextField required variant="outlined" id="name" name="name" onChange={e => {
                        setName(e.target.value)
                    }} label="Name" placeholder='Name' defaultValue={name} />
                    <TableContainer component={Paper}>
                        <Table aria-label="caption table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>name</TableCell>
                                    <TableCell>options</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.keys(variants).map((variantkey, index) => (
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row">
                                            {variantkey}
                                        </TableCell>
                                        <TableCell>{variants[variantkey].map((option, index) => <Chip style={{backgroundColor:variantkey === 'colors' && option, minWidth:'3vw'}} label={variantkey === 'colors'?'': option} key={index} />)}</TableCell>
                                        <TableCell style={{ display: 'flex' }}>
                                            <VariantForm name={variantkey} options={variants[variantkey]} handleEditVariant={handleEditVariant} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" disabled={!name ? true : false} onClick={handleSubmit}>
                        {props.mode === 'Add' ? 'Add' : 'Save changes'}
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}


