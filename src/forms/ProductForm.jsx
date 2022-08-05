import { useState, useEffect, useContext } from 'react';
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
import TextArea from 'antd/lib/input/TextArea';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import axios from 'axios';
import {NotificationContext} from '../App'
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

const MyFormControl = styled(FormControl)(({ theme }) => ({
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

export default function ProductForm(props) {
    const [open, toggleOpen] = useToggle(false);
    const [imageSource,setImageSource] = useState(props.data?.photo)
    const [name, setName] = useState(props.data?.name)
    const [description, setDescription] = useState(props.data?.description)
    const [stock, setStock] = useState(props.data?.stock)
    const [price, setPrice] = useState(props.data?.price)
    const [specOption, setSpecOption] = useState([])
    const [specs, setSpecs] = useState([])
    const [finalSpecs, setFinalSpecs] = useState([])
    const [touchedName, toggleTouchedName] = useToggle(false)
    const [touchedDescription, toggleTouchedDescription] = useToggle(false)
    const [touchedStock, toggleTouchedStock] = useToggle(false)
    const [touchedPrice, toggleTouchedPrice] = useToggle(false)
    const {handleNotification} = useContext(NotificationContext);
    
    const handleOptionChange = (event, spec, index) => {
        const newOptions = [...specOption]
        newOptions[index] = event.target.value
        setSpecOption(() => [...newOptions])
        if(finalSpecs.some(ele=>ele.name === spec)){
            console.log()
            setFinalSpecs((oldSpecs) => oldSpecs.map(ele=>{
                if(ele.name === spec) return { name: spec, value: event.target.value }
                return ele
            }))
        }else {
            setFinalSpecs((oldSpecs) => [...oldSpecs, { name: spec, value: event.target.value }])
        }
    }

    const handleClickOpen = () => {
        toggleOpen(true);
        setName(props.data?.name)
        setSpecs(props.model.specs)
        setDescription(props.data?.description)
        setImageSource(props.data?.photo)
        setStock(props.data?.stock)
        setPrice(props.data?.price)
    };
    const handleClose = () => {
        toggleOpen(false);
        toggleTouchedName(false)
        toggleTouchedDescription(false)
        toggleTouchedStock(false)
        toggleTouchedPrice(false)
        setName('')
        setDescription('')
        setImageSource('')
        setStock('')
        setPrice('')
        setSpecs([])
        setFinalSpecs([])
        setSpecOption([])
    };

    const handleSubmit = () => {
        if (props.mode === 'Add') {
            let addData = { photo:imageSource, name,description, stock, price, category: props.model.category, subCategory: props.model.subCategory, specs: finalSpecs, model:props.model._id }
            console.log(addData)
            axios.post('http://localhost:3000/api/v1/product/add', addData, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).then(res => {
                console.log(res)
                axios.get('http://localhost:3000/api/v1/product', {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }).then(res => {
                    props.handleAdd(res.data.products)
                    handleNotification('success', "Product Added Successfully")
                })
            })
        } else {
            let editData = { name, description, stock, price   }
            axios.put(`http://localhost:3000/api/v1/product/update/${props.data?._id}`, editData, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).then(res => {
                axios.get('http://localhost:3000/api/v1/product', {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }).then(res => {
                    props.handleEdit(res.data.products)
                    handleNotification('success', "Product Updated Successfully")
                })
            })
        }

        toggleTouchedName(false)
        toggleTouchedDescription(false)
        toggleTouchedStock(false)
        toggleTouchedPrice(false)
        setName('')
        setDescription('')
        setImageSource('')
        setStock('')
        setPrice('')
        setSpecs([])
        setFinalSpecs([])
        setSpecOption([])
        toggleOpen(false);
    }

    const handleImageChange = (childData)=>{
        setImageSource(childData)
    }
    
    return (
        <div>
            {props.mode === 'Add' ? <Button
                onClick={handleClickOpen}
                color="primary"
                startIcon={<AddIcon />}
            >
                Add new Product
            </Button> : <IconButton aria-label="edit" onClick={handleClickOpen}><EditIcon /></IconButton>}
            <BootstrapDialog
                onClose={handleClose}
                maxWidth="xs"
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {`${props.mode} Product`}
                </BootstrapDialogTitle>
                <DialogContent dividers>
                {props.mode !== 'Edit' &&<ImageUploadForm photo={imageSource} setImage={handleImageChange}/>}

                    <MyTextField required helperText={!name && touchedName ? 'required' : ''} error={!name && touchedName ? true : false} variant="outlined" id="name" name="name" onChange={e => {
                        setName(e.target.value)
                        toggleTouchedName(true)
                    }} label="Name" placeholder='Name' defaultValue={name} />

                    <MyTextField required helperText={!stock && touchedStock ? 'required' : ''} error={!stock && touchedStock ? true : false} variant="outlined" id="stock" type='number' name="stock" onChange={e => {
                        setStock(e.target.value)
                        toggleTouchedStock(true)
                    }} label="Stock" placeholder='Stock' defaultValue={stock} />

                    <MyTextField required helperText={!price && touchedPrice ? 'required' : ''} error={!price && touchedPrice ? true : false} variant="outlined" id="price" type='number' name="price" onChange={e => {
                        setPrice(e.target.value)
                        toggleTouchedPrice(true)
                    }} label="Price" placeholder='Price' defaultValue={price} />

                    <TextArea status={!description && touchedDescription?'error':''} variant="outlined" id="description" name="description" onChange={e => {
                        setDescription(e.target.value)
                        toggleTouchedDescription(true)
                    }} label="Description" placeholder={!description && touchedDescription?'required':'Description'} defaultValue={description} />

                    {specs.length !== 0 && props.mode === 'Add' ? specs.map((spec, index) => (<MyFormControl key={spec._id} variant="outlined" required size="small">
                        <InputLabel id="demo-select-small">{spec.name}</InputLabel>
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={specOption[index] || ''}
                            label={spec.name}
                            onChange={(event) => handleOptionChange(event, spec.name, index)}
                        >
                            {spec.options.map((option, index) => (<MenuItem style={{backgroundColor: spec.name === 'color' && option, textShadow:'1px 0 7px grey'}} key={index} value={option}>{option}</MenuItem>))}
                        </Select>
                    </MyFormControl>)) : ''}
                </DialogContent>
                <DialogActions>
                    <Button color="primary" disabled={!name || !imageSource || !stock || !price || (( specOption.length !== specs.length) && props.mode !== 'Edit') ? true : false} onClick={handleSubmit}>
                        {props.mode === 'Add' ? 'Add' : 'Save changes'}
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}
