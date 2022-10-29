import MainTable from '../shared/MainTable/MainTable'
import { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ColorForm from '../forms/ColorForm'
import axios from 'axios'
import Button from '@material-ui/core/Button';
import useToggle from '../customHooks/useToggle'
import { NotificationContext } from '../App'

const Colors = () => {
    const { handleNotification } = useContext(NotificationContext)
    const navigate = useNavigate()
    const [colors, setColors] = useState([])
    const [progress, toggleProgress] = useToggle(false)
    const { productID } = useParams()

    const editElement = (editedColor) => {
        let newEle = {
            ...editedColor,
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
        tableHeaders: ['Photos', 'Color', 'List of Sizes', 'Actions']
    }

    useEffect(() => {
        toggleProgress()
        axios.get(`http://localhost:3000/api/v1/product/colors/${productID}`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then((res) => {
            setData(res.data.colors)
            toggleProgress()
        }).catch((error) => {
            handleNotification('error', "Server Error")
        })
    }, [])
    return <MainTable info={info} data={colors} progress={progress} addFormContent={<ColorForm addElement={addElement} toggleProgress={toggleProgress} mode='Add' productId={productID} />} />
}

export default Colors