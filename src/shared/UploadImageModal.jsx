import { Modal } from 'antd';
import React, { useState, useContext } from 'react';
import ImageUploadForm from '../forms/ImageUploadForm'
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
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
        console.log(res)
        props.setPhotos(res.data.mainSlider.photos)
        handleNotification('success', 'photo added successfully')
        props.toggleWebProgress()
      }).catch(error => {
        handleNotification('error', 'Server Error')
      })
    } else {
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
    }
    setImageSource('')
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setImageSource('')
  };

  return (
    <>
      <Button color="primary" startIcon={<AddIcon />} onClick={showModal}>
        Add new Image
      </Button>
      <Modal title="Add New Image" okButtonProps={{ disabled: imageSource === '' ? true : false }} okText="Add" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <ImageUploadForm photo={imageSource} setImage={handleImageChange} />
      </Modal>
    </>
  );
};

export default UploadImageModal