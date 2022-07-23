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
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import SpecForm from './SpecForm'
import ImageUploadForm from "./ImageUploadForm";
import useToggle from '../customHooks/useToggle';

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
    const [open, toggleOpen] = useToggle(false);
    const [imageSource, setImageSource] = useState(props.data?.photo)
    const [name, setName] = useState(props.data?.name)
    const [specs, setSpecs] = useState(props.data?.specs || [])
    const [touchedName, toggleTouchedName] = useToggle(false)

    const handleClickOpen = () => {
        toggleOpen(true);
        setName(props.data?.name)
        setImageSource(props.data?.photo)
        setSpecs(props.data?.specs || [])
    };
    const handleClose = () => {
        toggleOpen(false);
        toggleTouchedName(false)
        setName('')
        setImageSource('')
        setSpecs([])
    };

    const handleAddSpec = (newSpec) => {
        setSpecs((oldSpecs) => [...oldSpecs, newSpec])
    }

    const handleEditSpec = (editedSpec, index) => {
        setSpecs((oldSpecs) => oldSpecs.map((oldSpec, oldIndex) => {
            if (oldIndex === index) {
                return editedSpec
            }
            return oldSpec
        }))
    }

    const handleDeleteSpec = (index) => {
        setSpecs((oldSpecs) => oldSpecs.filter((spec, oldIndex) => index !== oldIndex))
    }
    const handleSubmit = () => {
        let data = { photo: imageSource, name, specs, category: props.categoryId }
        if (props.mode === 'Add') {
            props.handleAdd(data)
        } else {
            props.handleEdit(data, props.data?._id)
        }

        toggleTouchedName(false)
        setName('')
        setImageSource('')
        setSpecs([])
        toggleOpen(false);
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
                    {specs.length !== 0 ? <TableContainer component={Paper}>
                        <Table aria-label="caption table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>name</TableCell>
                                    <TableCell>options</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {specs.map((spec, index) => (
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row">
                                            {spec.name}
                                        </TableCell>
                                        <TableCell>{spec.options.map((option, index) => <Chip color="primary" key={index} label={option} />)}</TableCell>
                                        <TableCell style={{ display: 'flex' }}>
                                            <SpecForm mode={'Edit'} spec={spec} handleEditSpec={handleEditSpec} index={index} />
                                            <IconButton aria-label="delete" onClick={() => handleDeleteSpec(index)}><DeleteIcon /></IconButton>
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer> : ''}
                    <SpecForm mode={'Add'} handleAddSpec={handleAddSpec} />
                </DialogContent>
                <DialogActions>
                    <Button color="primary" disabled={!name || !imageSource || specs.length === 0 ? true : false} onClick={handleSubmit}>
                        {props.mode === 'Add' ? 'Add' : 'Save changes'}
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}
