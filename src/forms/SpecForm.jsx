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
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';


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

export default function SpecForm(props) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(props.spec?.name)
    const [option, setOption] = useState('')
    const [options, setOptions] = useState(props.spec?.options || [])
    const [touchedName, setTouchedName] = useState(false)


    const handleDelete = (optionToDelete) => () => {
        setOptions((options) => options.filter((option) => option !== optionToDelete));
    };

    const handleClickOpen = () => {
        setOpen(true);
        setName(props.spec?.name)
        setOptions(props.spec?.options || [])
    };
    const handleClose = () => {
        setOpen(false);
        setTouchedName(false)
        setName('')
        setOptions([])
        setOption('')
    };

    const handleAddOption = () => {
        setOptions((oldOptions) => [...oldOptions, option])
        setOption('')
    }

    const handleSubmit = () => {
        let data = {name,options}
        if(props.mode === 'Add'){
            props.handleAddSpec(data)
        }else{
            props.handleEditSpec(data,props.index)
        }
        setTouchedName(false)
        setName('')
        setOptions([])
        setOption('')
        setOpen(false);
    }

    return (
        <div>
            {props.mode === 'Add' ? <Button
                onClick={handleClickOpen}
                color="primary"
                startIcon={<AddIcon />}
            >
                Add new Spec
            </Button> : <IconButton aria-label="edit" onClick={handleClickOpen}><EditIcon /></IconButton>}
            <BootstrapDialog
                onClose={handleClose}
                maxWidth="xs"
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {`${props.mode} Spec`}
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <MyTextField required helperText={!name && touchedName ? 'required' : ''} error={!name && touchedName ? true : false} variant="outlined" id="name" name="name" onChange={e => {
                        setName(e.target.value)
                        setTouchedName(true)
                    }} label="Name" placeholder='Name' value={name} />

                    <MyTextField variant="outlined" id="option" name="option" onChange={e => {
                        setOption(e.target.value)
                    }} label="Option" placeholder='Option' value={option} />

                    {options.length !==0?<Paper
                        style={{
                            display: 'flex',
                            listStyle: 'none',
                            flexWrap:'wrap',
                            gap: 5,
                            padding:5
                        }}
                        component="ul"
                    >
                        {options.map((option, index) => (<Chip
                            key={index}
                            label={option}
                            onDelete={handleDelete(option)}
                        />
                        ))}
                    </Paper>:''}
                    <Button
                        onClick={handleAddOption}
                        color="primary"
                        startIcon={<AddIcon />}
                        disabled={!option? true : false}
                    >
                        Add new Option
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" disabled={!name || options.length === 0? true : false} onClick={handleSubmit}>
                        {props.mode === 'Add' ? 'Add' : 'Save changes'}
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}
