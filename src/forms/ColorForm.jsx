import { useContext } from "react";
import { Button, Modal } from "antd";
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from "@material-ui/core/Paper";
import { NotificationContext } from "../App";
import axios from 'axios'
import useToggle from "../customHooks/useToggle";
import { useEffect, useState, useRef } from "react";
import SizeForm from "./SizeForm";


export default function ColorForm(props) {
    const colorRef = useRef('#000000')
    const [color, setColor] = useState(props.data?.color || '#000000')
    const [sizes, setSizes] = useState(props.data?.sizes || [])
    const [modalVisable, toggleModal] = useToggle(false)
    const { handleNotification } = useContext(NotificationContext);

    const handleOpen = ()=> {
        setColor(props.data?.color || '#000000')
        colorRef.current.value = props.data?.color || '#000000'
        setSizes(props.data?.sizes || [])
        toggleModal()
    }

    const handleOk = () => {
        props.toggleProgress()
        if (props.mode === 'Add') {
            let addData = { color, sizes, productId: props.productId }
            console.log(addData)
            axios.post('http://localhost:3000/api/v1/product/addColor', addData, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).then(res => {
                props.addElement(res.data.color)
                handleNotification('success', "Color Added Successfully")
                props.toggleProgress()
            }).catch((error) => {
                handleNotification('error', "Server Error")
            })
        } else {
            let editData = { color, sizes }
            axios.put(`http://localhost:3000/api/v1/product/updateColor/${props.data?._id}`, editData, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).then(res => {
                props.editElement(res.data.color)
                handleNotification('success', "Color Updated Successfully")
                props.toggleProgress()
            }).catch((error) => {
                handleNotification('error', "Server Error")
            })
        }
        toggleModal()
    }

    const handleCancel = () => {
        toggleModal()
    }

    const handleColorChange = (event)=> {
        setColor(event.target.value)
    }

    const handleEditSize = (newSize) => {
        let editedSizes = sizes.map((size=> {
            return newSize._id === size._id ? newSize : size
        }))
        setSizes((oldSizes)=>oldSizes.map(size=> {
            return newSize._id === size._id ? newSize : size
        }))
        if(props.data?._id){
            axios.put(`http://localhost:3000/api/v1/product/updateColor/${props.data?._id}`, {sizes:editedSizes}, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).then(res => {
                props.editElement(res.data.color)
                setSizes(res.data.color.sizes)
            }).catch((error) => {
                handleNotification('error', "Server Error")
            })
        }
    }

    const addSize = (newSize) => {
        let editedSizes = [...sizes, newSize]
        setSizes((oldSizes)=>[...oldSizes,newSize])
        if(props.data?._id){
            axios.put(`http://localhost:3000/api/v1/product/updateColor/${props.data?._id}`, {sizes:editedSizes}, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).then(res => {
                props.editElement(res.data.color)
                setSizes(res.data.color.sizes)
            }).catch((error) => {
                handleNotification('error', "Server Error")
            })
        }
    }

    useEffect(() => {
        
    }, [modalVisable])

    return (
        <>
            {props.mode === 'Add' ? <Button
                onClick={toggleModal}
                icon={<PlusOutlined />}
                className="no-background-button"
            >
                Add new Color
            </Button> : <Button className="no-background-button" icon={<EditOutlined />} aria-label="edit" onClick={handleOpen}></Button>}
            <Modal title={props.mode === 'Add' ? "Add new Color" : "Edit Color details"} visible={modalVisable} onOk={handleOk} okText={props.mode === 'Add' ? 'Add' : 'Save Changes'} onCancel={handleCancel}>
                <div style={{display:'flex', flexDirection:'column'}}>
                    <input ref={colorRef} type="color" style={{width:'100%', height:'5vh'}} onChange={handleColorChange}/>
                    {sizes.length ? <TableContainer component={Paper}>
                        <Table aria-label="caption table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>size</TableCell>
                                    <TableCell>stock</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sizes.map((size, index) => (
                                    <TableRow key={size._id || index}>
                                        <TableCell component="th" scope="row">
                                            {size.size}
                                        </TableCell>
                                        <TableCell>{size.stock}</TableCell>
                                        <TableCell style={{ display: 'flex' }}>
                                            <SizeForm mode='Edit' handleEditSize={handleEditSize} size={size}/>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>: ''}
                </div>
                <SizeForm mode='Add' addSize={addSize}/>
            </Modal>
        </>
    );
}