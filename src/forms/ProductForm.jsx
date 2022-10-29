import { useContext, useState } from "react";
import { Form, Input, Button, Modal, Select, InputNumber } from "antd";
import { EditOutlined, PlusOutlined, PercentageOutlined } from '@ant-design/icons'
import { NotificationContext } from "../App";
import ImageUploadForm from "./ImageUploadForm";
import axios from 'axios'
import useToggle from "../customHooks/useToggle";
import { useEffect } from "react";

const { Option } = Select

export default function ProductForm(props) {
    const [modalVisable, toggleModal] = useToggle(false)
    const { handleNotification } = useContext(NotificationContext);

    const handleOk = () => {
        productForm.submit()
    }

    const handleCancel = () => {
        toggleModal()
    }

    const onFinish = (values) => {
        props.toggleProgress()
        if (props.mode === 'Add') {
            let addData = { ...values, category: props.subCategory.category, subCategory: props.subCategory._id }
            axios.post('http://localhost:3000/api/v1/product/add', addData, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).then(res => {
                props.addElement(res.data.product)
                handleNotification('success', "Product Added Successfully")
                props.toggleProgress()
            }).catch((error) => {
                handleNotification('error', "Server Error")
            })
        } else {
            let editData = { ...values }
            axios.put(`http://localhost:3000/api/v1/product/update/${props.data?._id}`, editData, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).then(res => {
                props.editElement(res.data.product)
                handleNotification('success', "Product Updated Successfully")
                props.toggleProgress()
            }).catch((error) => {
                handleNotification('error', "Server Error")
            })
        }
        toggleModal()
    };
    useEffect(() => {
        productForm.resetFields()
        productForm.setFieldsValue({
            name: props.data?.name || '',
            price: props.data?.price ? String(props.data.price) : '',
            discountPercentage: props.data?.discountPercentage ? String(props.data.discountPercentage) : '',
            description: props.data?.description || '',
        })
    }, [modalVisable])
    const [productForm] = Form.useForm();

    return (
        <>
            {props.mode === 'Add' ? <Button
                onClick={toggleModal}
                icon={<PlusOutlined />}
                className="no-background-button"
            >
                Add new Product
            </Button> : <Button className="no-background-button" icon={<EditOutlined />} aria-label="edit" onClick={toggleModal}></Button>}
            <Modal title={props.mode === 'Add' ?"Add new Product":"Edit product details"} visible={modalVisable} onOk={handleOk} okText={props.mode === 'Add' ? 'Add' : 'Save Changes'} onCancel={handleCancel}>
                <Form
                    form={productForm}
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
                        <Form.Item
                            name="price"
                            rules={[
                                {
                                    required: true,
                                },
                                {
                                    pattern: /^[0-9]+$/,
                                    message: 'Must be only numbers'
                                },
                                {
                                    min: 1,
                                }
                            ]}
                        >
                            <Input className="defualt-input" placeholder="Price" />
                        </Form.Item>
                        <Form.Item
                            name="discountPercentage"
                            rules={[
                                {
                                    required: true,
                                },
                                {
                                    pattern: /^[0-9]+$/,
                                    message: 'Must be only numbers'
                                },
                                {
                                    min: 0,
                                }
                            ]}
                        >
                            <Input className="defualt-input" placeholder="discount Percentage" prefix={<PercentageOutlined />}/>
                        </Form.Item>
                        <Form.Item
                            name="description"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input.TextArea placeholder="Description" allowClear />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </>
    );
}