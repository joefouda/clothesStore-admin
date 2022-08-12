import { useContext, useState } from "react";
import { Form, Input, Button, Modal } from "antd";
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { NotificationContext } from "../App";
import ImageUploadForm from "./ImageUploadForm";
import axios from 'axios'
import useToggle from "../customHooks/useToggle";
import { useEffect } from "react";

export default function CategoryForm(props) {
    const [imageSource, setImageSource] = useState(props.data?.photo || '');
    const [modalVisable, toggleModal] = useToggle(false)
    const { handleNotification } = useContext(NotificationContext);

    const handleImageChange = (childData) => {
        setImageSource(childData);
    };

    const handleOpen = () => {
        categoryForm.setFieldsValue({ name: props.data?.name || '' })
    }

    const handleOk = () => {
        categoryForm.submit()
    }

    const handleCancel = () => {
        toggleModal()
    }

    const onFinish = (values) => {
        props.toggleProgress()
        let data = { photo: imageSource, name: values.name };
        if (props.mode === "Add") {
            axios
                .post("http://localhost:3000/api/v1/category", data, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                })
                .then((res) => {
                    props.addElement(res.data.category);
                    handleNotification("success", "Category Added Successfully");
                    props.toggleProgress()
                }).catch(error => {
                    handleNotification('error', "Server Error")
                })
        } else {
            axios
                .put(`http://localhost:3000/api/v1/category/${props.data?._id}`, data, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                })
                .then((res) => {
                    props.editElement(res.data.category);
                    handleNotification("success", "Category Updated Successfully");
                    props.toggleProgress()
                }).catch(error => {
                    handleNotification('error', "Server Error")
                })
        }
        toggleModal()
    };
    useEffect(() => {
        categoryForm.resetFields()
        categoryForm.setFieldsValue({ name: props.data?.name || '' })
        setImageSource(props.data?.photo || '')
    }, [modalVisable])
    const [categoryForm] = Form.useForm();

    return (
        <>
            {props.mode === 'Add' ? <Button
                onClick={toggleModal}
                icon={<PlusOutlined />}
                className="no-background-button"
            >
                Add new Category
            </Button> : <Button className="no-background-button" icon={<EditOutlined />} aria-label="edit" onClick={toggleModal}></Button>}
            <Modal title={props.mode === 'Add' ?"Add new Category":"Edit Category details"} visible={modalVisable} onOk={handleOk} okText={props.mode === 'Add'?'Add':'Save Changes'} onCancel={handleCancel} onOpen={handleOpen}>
                <Form
                    form={categoryForm}
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
