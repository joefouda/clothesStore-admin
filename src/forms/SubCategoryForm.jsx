import { Form, Input, Button, Modal } from "antd";
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { NotificationContext } from "../App";
import ImageUploadForm from "./ImageUploadForm";
import axios from 'axios'
import useToggle from "../customHooks/useToggle";
import { useEffect, useContext, useState } from "react";

export default function SubsubCategoryForm(props) {
    const [imageSource, setImageSource] = useState(props.data?.photo || '');
    const [modalVisable, toggleModal] = useToggle(false)
    const { handleNotification } = useContext(NotificationContext);

    const handleImageChange = (childData) => {
        setImageSource(childData);
    };

    const handleOpen = () => {
        subCategoryForm.setFieldsValue({ name: props.data?.name || '' })
    }

    const handleOk = () => {
        subCategoryForm.submit()
    }

    const handleCancel = () => {
        toggleModal()
    }

    const onFinish = (values) => {
        props.toggleProgress()
        let data = { photo: imageSource, name: values.name, category: props.categoryID }
        if (props.mode === 'Add') {
            axios.post('http://localhost:3000/api/v1/subCategory', data, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).then(res => {
                props.addElement(res.data.subCategory)
                handleNotification('success', "Sub Category Added Successfully")
                props.toggleProgress()
            }).catch(error => {
                handleNotification('error', "Server Error")
            })
        } else {
            axios.put(`http://localhost:3000/api/v1/subCategory/${props.data._id}`, data, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).then(res => {
                props.editElement(res.data.subCategory)
                handleNotification('success', "Sub Category Updated Successfully")
                props.toggleProgress()
            }).catch(error => {
                handleNotification('error', "Server Error")
            })
        }
        toggleModal()
    };
    useEffect(() => {
        subCategoryForm.resetFields()
        subCategoryForm.setFieldsValue({ name: props.data?.name || '' })
        setImageSource(props.data?.photo || '')
    }, [modalVisable])

    const [subCategoryForm] = Form.useForm();
    return (
        <>
            {props.mode === 'Add' ? <Button
                onClick={toggleModal}
                icon={<PlusOutlined />}
                className="no-background-button"
            >
                Add new sub Category
            </Button> : <Button className="no-background-button" icon={<EditOutlined />} aria-label="edit" onClick={toggleModal}></Button>}
            <Modal title={props.mode === 'Add' ?"Add new subCategory":"Edit subCategory details"} visible={modalVisable} onOk={handleOk} okText={props.mode === 'Add'?'Add':'Save Changes'} onCancel={handleCancel} onOpen={handleOpen}>
                <Form
                    form={subCategoryForm}
                    wrapperCol={{
                        span: 24,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <div className="fields-container">
                        <ImageUploadForm photo={imageSource} setImage={handleImageChange} />
                        <Form.Item
                            name="name"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input placeholder="Name" allowClear />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </>
    );
}
