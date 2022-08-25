import { Modal } from 'antd';
import React, { useState, useContext } from 'react';
import ImageUploadForm from '../forms/ImageUploadForm'
import { Button } from 'antd'
import { EditOutlined } from '@ant-design/icons';
import axios from 'axios'
import { NotificationContext } from '../App'

const UploadImageModal = (props) => {
  const { handleNotification } = useContext(NotificationContext)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageSource, setImageSource] = useState(props.photo)

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleImageChange = (childData) => {
    setImageSource(childData)
  }

  const handleOk = () => {

    setIsModalVisible(false);
    if (props.mode === 'product') {
      props.toggleProgress()
      axios.put(`http://localhost:3000/api/v1/product/add/${props.productId}`, { photo: imageSource }, {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      }).then(res => {
        props.setPhotos(res.data.product.photos)
        handleNotification('success', 'photo added successfully')
        props.toggleProgress()
      }).catch(error => {
        handleNotification('error', 'Server Error')
      })
    } else if (props.mode === 'web') {
      props.toggleWebProgress()
      axios.put(props.url, { photo: imageSource }, {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      }).then(res => {
        props.setPhotos(res.data.mainSlider.photos)
        handleNotification('success', 'photo added successfully')
        props.toggleWebProgress()
      }).catch(error => {
        handleNotification('error', 'Server Error')
      })
    } else if(props.mode === 'mobile') {
      props.toggleMobileProgress()
      axios.put(props.url, { photo: imageSource }, {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      }).then(res => {
        props.setPhotos(res.data.mainSlider.photos)
        handleNotification('success', 'photo added successfully')
        props.toggleMobileProgress()
      }).catch(error => {
        handleNotification('error', 'Server Error')
      })
    } else {
      axios.put(props.url, { photo: imageSource, title:props.title }, {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      }).then(res => {
        props.setMainLists(res.data.result.MainLists)
        handleNotification('success', 'photo edited successfully')
      }).catch(error => {
        handleNotification('error', 'Server Error')
      })
    }
    setImageSource('')
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setImageSource('')
  };

  return (
    <>
      {props.mode === 'mainList' ?<Button className="no-background-button" icon={<EditOutlined />} aria-label="edit" onClick={showModal}></Button>:<Button color="primary" icon={<EditOutlined />} onClick={showModal}>
        Add new Image
      </Button>}
      <Modal title="Add New Image" okButtonProps={{ disabled: imageSource === '' ? true : false }} okText={props.mode === 'mainList'?"save":"Add"} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <ImageUploadForm photo={imageSource} setImage={handleImageChange} />
      </Modal>
    </>
  );
};

export default UploadImageModal