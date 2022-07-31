import { Modal } from 'antd';
import React, { useState } from 'react';
import ImageUploadForm from '../../../forms/ImageUploadForm'
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import axios from 'axios'

const UploadImageModal = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [photo, setPhoto] = useState('')

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (props.mode === 'product') {
      axios.put(`http://localhost:3000/api/v1/product/add/${props.productId}`, { photo }, {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      }).then(res => {
        console.log(res)
        props.setPhotos(res.data.product.photos)
      })
      setIsModalVisible(false);
    }else {
      axios.put('http://localhost:3000/api/v1/other/mainSliderPhotos', { photo }, {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      }).then(res => {
        console.log(res)
        props.setPhotos(res.data.mainSlider.photos)
      })
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button color="primary" startIcon={<AddIcon />} onClick={showModal}>
        Add new Image
      </Button>
      <Modal title="Add New Image" okButtonProps={{ disabled: photo === '' ? true : false }} okText="Add" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <ImageUploadForm setPhoto={setPhoto} />
      </Modal>
    </>
  );
};

export default UploadImageModal