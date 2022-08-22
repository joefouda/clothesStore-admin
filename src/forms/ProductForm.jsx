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
    const [imageSource, setImageSource] = useState(props.data?.photo)
    const [variantOption, setVariantOption] = useState([])
    const [variants, setVariants] = useState(props.model?.variants || {})
    const [finalVariants, setFinalVariants] = useState({})

    const handleImageChange = (childData) => {
        setImageSource(childData);
    };

    const handleOptionChange = (value, key, index) => {
        const newOptions = [...variantOption]
        newOptions[index] = value
        setVariantOption(() => [...newOptions])
        setFinalVariants((oldvariants) => ({...oldvariants, [key]:value }))
    }

    const handleOk = () => {
        productForm.submit()
    }

    const handleCancel = () => {
        toggleModal()
    }

    const onFinish = (values) => {
        props.toggleProgress()
        if (props.mode === 'Add') {
            let addData = { ...values,photo: imageSource, category: props.model.category, subCategory: props.model.subCategory, variants: finalVariants, model: props.model._id }
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
            stock: props.data?.stock ? String(props.data.stock) : '',
            price: props.data?.price ? String(props.data.price) : '',
            discountPercentage: props.data?.discountPercentage ? String(props.data.discountPercentage) : '',
            description: props.data?.description || '',
        })
        setImageSource(props.data?.photo || '')
        setVariants(props.model?.variants || [])
        setVariantOption([])
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
                        {props.mode === "Add" &&<ImageUploadForm photo={imageSource} setImage={handleImageChange} />}
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
                            name="stock"
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
                            <Input className="defualt-input" placeholder="Stock" />
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
                        {props.mode === 'Add' ? Object.keys(variants).map((variantkey, index) => (<Form.Item key={index} name={variantkey.slice(0, -1)} rules={[{ required: true }]} size="small">
                            <Select
                                value={variantOption[index] || ''}
                                placeholder={variantkey.slice(0, -1)}
                                onChange={(value) => handleOptionChange(value, variantkey.slice(0, -1), index)}
                            >
                                {props.model.variants[variantkey].map((option, index) => (<Option style={{ backgroundColor: variantkey === 'colors' && option, textShadow: '1px 0 7px grey' }} key={index} value={option}>{option}</Option>))}
                            </Select>
                        </Form.Item>)) : ''}
                    </div>
                </Form>
            </Modal>
        </>
    );
}