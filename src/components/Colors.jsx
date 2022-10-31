import MainTable from '../shared/MainTable/MainTable'
import { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ColorForm from '../forms/ColorForm'
import axios from 'axios'
import Button from '@material-ui/core/Button';
import { EyeOutlined } from '@ant-design/icons'
import useToggle from '../customHooks/useToggle'
import { Modal, Table } from 'antd'
import { NotificationContext } from '../App'

const {Column} = Table

const SizesModal = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            <Button startIcon={<EyeOutlined />} className="no-background-button" onClick={showModal}>
                View List of Sizes
            </Button>
            <Modal title="List of Sizes" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Table dataSource={props.sizes.map(size=>({...size,key:size._id}))}>
                    <Column title="Size" dataIndex="size" key="size" />
                    <Column title="Stock" dataIndex="stock" key="stock" />
                </Table>
            </Modal>
        </>
    )
}

const Colors = () => {
    const { handleNotification } = useContext(NotificationContext)
    const navigate = useNavigate()
    const [colors, setColors] = useState([])
    const [progress, toggleProgress] = useToggle(false)
    const { productID } = useParams()

    const editElement = (editedColor) => {
        let newEle = {
            ...editedColor,
            color: <div style={{ width: '5vh', height: '5vh', borderRadius: '50%', backgroundColor: editedColor.color, boxShadow: '1px 0px 2px 5px grey' }}></div>,
            sizes: <SizesModal sizes={editedColor.sizes} />,
            actions: <div style={{ display: 'flex' }}><Button
                onClick={() => navigate(`/${editedColor._id}/colorPhotos`)}
                color="primary"
            >Edit Photos</Button><ColorForm mode='Edit' editElement={editElement} data={editedColor} toggleProgress={toggleProgress} />
            </div>
        }
        setColors(oldColors => oldColors.map(color => {
            return color._id === editedColor._id ? newEle : color
        }))
    }

    const addElement = (newColor) => {
        let newEle = {
            ...newColor,
            color: <div style={{ width: '5vh', height: '5vh', borderRadius: '50%', backgroundColor: newColor.color }}></div>,
            sizes: <SizesModal sizes={newColor.sizes} />,
            actions: <div style={{ display: 'flex' }}><Button
                onClick={() => navigate(`/${newColor._id}/colorPhotos`)}
                color="primary"
            >Edit Photos</Button><ColorForm mode='Edit' editElement={editElement} data={newColor} toggleProgress={toggleProgress} />
            </div>
        }
        setColors((oldColors) => [...oldColors, newEle])
    }

    const setData = (data) => {
        let newData = data.map(ele => {
            return {
                ...ele,
                color: <div style={{ width: '5vh', height: '5vh', borderRadius: '50%', backgroundColor: ele.color }}></div>,
                sizes: <SizesModal sizes={ele.sizes} />,
                actions: <div style={{ display: 'flex' }}><Button
                    onClick={() => navigate(`/${ele._id}/colorPhotos`)}
                    color="primary"
                >Edit Photos</Button><ColorForm mode='Edit' editElement={editElement} toggleProgress={toggleProgress} data={ele} />
                </div>
            }
        })
        setColors(newData)
    }

    const info = {
        header: 'Colors',
        dataFor: 'Color',
        tableHeaders: ['Photos', 'Color', 'Sizes', 'Actions']
    }

    useEffect(() => {
        toggleProgress()
        axios.get(`http://localhost:3000/api/v1/product/colors/${productID}`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then((res) => {
            console.log(res.data.colors)
            setData(res.data.colors)
            toggleProgress()
        }).catch((error) => {
            handleNotification('error', "Server Error")
        })
    }, [])
    return <MainTable info={info} data={colors} progress={progress} addFormContent={<ColorForm addElement={addElement} toggleProgress={toggleProgress} mode='Add' productId={productID} />} />
}

export default Colors