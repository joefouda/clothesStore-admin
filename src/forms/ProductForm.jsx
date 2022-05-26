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
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import axios from 'axios';
import {NotificationContext} from '../App'
import ImageUploadForm from "./ImageUploadForm";


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
    const [open, setOpen] = useState(false);
    const [imageSource,setImageSource] = useState(props.data?.photo)
    const [name, setName] = useState(props.data?.name)
    const [stock, setStock] = useState(props.data?.stock)
    const [price, setPrice] = useState(props.data?.price)
    const [category, setCategory] = useState('')
    const [categories, setCategories] = useState([])
    const [subCategory, setSubCategory] = useState('')
    const [subCategories, setSubCategories] = useState([])
    const [specOption, setSpecOption] = useState([])
    const [specs, setSpecs] = useState([])
    const [finalSpecs, setFinalSpecs] = useState([])
    const [touchedName, setTouchedName] = useState(false)
    const [touchedStock, setTouchedStock] = useState(false)
    const [touchedPrice, setTouchedPrice] = useState(false)
    const {handleNotification} = useContext(NotificationContext);

    const [categoryId, setCategoryId] = useState('')
    const [subCategoryId, setSubCategoryId] = useState('')


    const handleCategoryChange = (event) => {
        setCategory(event.target.value);

        const category = categories.find(ele => {
            return ele.name === event.target.value
        })
        setCategoryId(category._id)
        setSubCategories(() => [...category.subCategories])
    };

    const handleSubCategoryChange = (event) => {
        setSubCategory(event.target.value);

        const subCategory = subCategories.find(ele => {
            return ele.name === event.target.value
        })
        setSubCategoryId(subCategory._id)
        setSpecs(() => [...subCategory.specs])
    };

    const handleOptionChange = (event, spec, index) => {
        const newOptions = [...specOption]
        newOptions[index] = event.target.value
        setSpecOption(() => [...newOptions])
        setFinalSpecs((oldSpecs) => [...oldSpecs, { name: spec, value: event.target.value }])
    }

    const handleClickOpen = () => {
        setOpen(true);
        setName(props.data?.name)
        setImageSource(props.data?.photo)
        setStock(props.data?.stock)
        setPrice(props.data?.price)
        setCategory(props.data?.category)
    };
    const handleClose = () => {
        setOpen(false);
        setTouchedName(false)
        setTouchedStock(false)
        setTouchedPrice(false)
        setName('')
        setImageSource('')
        setStock('')
        setPrice('')
        setCategory('')
        setSubCategory('')
        setSubCategories([])
        setSpecs([])
        setFinalSpecs([])
        setSpecOption([])
    };

    const handleSubmit = () => {
        if (props.mode === 'Add') {
            let addData = { photo:imageSource, name, stock, price, category: categoryId, subCategory: subCategoryId, specs: finalSpecs }
            axios.post('http://localhost:3000/api/v1/product/add', addData, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).then(res => {
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
            let editData = { photo:imageSource, name, stock, price   }
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

        setTouchedName(false)
        setTouchedStock(false)
        setTouchedPrice(false)
        setName('')
        setImageSource('')
        setStock('')
        setPrice('')
        setCategory('')
        setSubCategory('')
        setSubCategories([])
        setSpecs([])
        setFinalSpecs([])
        setSpecOption([])
        setOpen(false);
    }

    const handleImageChange = (childData)=>{
        setImageSource(childData)
    }
    useEffect(() => {
        axios.get('http://localhost:3000/api/v1/category', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then((res) => {
            setCategories(() => [...res.data.categories])
        })
    }, [])
    
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
                    <ImageUploadForm photo={imageSource} setImage={handleImageChange}/>

                    <MyTextField required helperText={!name && touchedName ? 'required' : ''} error={!name && touchedName ? true : false} variant="outlined" id="name" name="name" onChange={e => {
                        setName(e.target.value)
                        setTouchedName(true)
                    }} label="Name" placeholder='Name' defaultValue={name} />

                    <MyTextField required helperText={!stock && touchedStock ? 'required' : ''} error={!stock && touchedStock ? true : false} variant="outlined" id="stock" type='number' name="stock" onChange={e => {
                        setStock(e.target.value)
                        setTouchedStock(true)
                    }} label="Stock" placeholder='Stock' defaultValue={stock} />

                    <MyTextField required helperText={!price && touchedPrice ? 'required' : ''} error={!price && touchedPrice ? true : false} variant="outlined" id="price" type='number' name="price" onChange={e => {
                        setPrice(e.target.value)
                        setTouchedPrice(true)
                    }} label="Price" placeholder='Price' defaultValue={price} />

                    {props.mode === 'Add' ? <MyFormControl variant="outlined" required size="small">
                        <InputLabel id="demo-select-small">Category</InputLabel>
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={category || ''}
                            label="Category"
                            onChange={handleCategoryChange}
                        >
                            {categories.map((category) => (<MenuItem key={category._id} value={category.name}>{category.name}</MenuItem>))}
                        </Select>
                    </MyFormControl> : ''}

                    {subCategories.length !== 0 && props.mode === 'Add' ? <MyFormControl variant="outlined" required size="small">
                        <InputLabel id="demo-select-small">Sub Category</InputLabel>
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={subCategory || ''}
                            label="Sub Category"
                            onChange={handleSubCategoryChange}
                        >
                            {subCategories.map((subCategory) => (<MenuItem key={subCategory._id} value={subCategory.name}>{subCategory.name}</MenuItem>))}
                        </Select>
                    </MyFormControl> : ''}

                    {specs.length !== 0 && props.mode === 'Add' ? specs.map((spec, index) => (<MyFormControl key={spec._id} variant="outlined" required size="small">
                        <InputLabel id="demo-select-small">{spec.name}</InputLabel>
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={specOption[index] || ''}
                            label={spec.name}
                            onChange={(event) => handleOptionChange(event, spec.name, index)}
                        >
                            {spec.options.map((option, index) => (<MenuItem key={index} value={option}>{option}</MenuItem>))}
                        </Select>
                    </MyFormControl>)) : ''}
                </DialogContent>
                <DialogActions>
                    <Button color="primary" disabled={!name || !imageSource || !stock || !price || ((!category || !subCategory || specOption.length !== specs.length) && props.mode !== 'Edit') ? true : false} onClick={handleSubmit}>
                        {props.mode === 'Add' ? 'Add' : 'Save changes'}
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}
