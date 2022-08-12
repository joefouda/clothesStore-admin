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
    const [specOption, setSpecOption] = useState([])
    const [specs, setSpecs] = useState([])
    const [finalSpecs, setFinalSpecs] = useState([])

    const handleImageChange = (childData) => {
        setImageSource(childData);
    };

    const handleOptionChange = (value, spec, index) => {
        const newOptions = [...specOption]
        newOptions[index] = value
        setSpecOption(() => [...newOptions])
        if (finalSpecs.some(ele => ele.name === spec)) {
            console.log()
            setFinalSpecs((oldSpecs) => oldSpecs.map(ele => {
                if (ele.name === spec) return { name: spec, value }
                return ele
            }))
        } else {
            setFinalSpecs((oldSpecs) => [...oldSpecs, { name: spec, value }])
        }
    }

    const handleOpen = () => {
        productForm.setFieldsValue({ name: props.data?.name || '' })
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
            let addData = { ...values,photo: imageSource, category: props.model.category, subCategory: props.model.subCategory, specs: finalSpecs, model: props.model._id }
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
            stock: props.data?.stock || '',
            price: props.data?.price || '',
            discount: props.data?.discount || '',
            description: props.data?.description || '',
        })
        setImageSource(props.data?.photo || '')
        setSpecs(props.model?.specs || [])
        setSpecOption([])
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
            <Modal title={props.mode === 'Add' ?"Add new Product":"Edit product details"} visible={modalVisable} onOk={handleOk} okText={props.mode === 'Add' ? 'Add' : 'Save Changes'} onCancel={handleCancel} onOpen={handleOpen}>
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
                            <Input className="defualt-input" placeholder="Discount" prefix={<PercentageOutlined />}/>
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
                        {specs.length !== 0 && props.mode === 'Add' ? specs.map((spec, index) => (<Form.Item key={spec._id} name={spec.name} rules={[{ required: true }]} size="small">
                            <Select
                                value={specOption[index] || ''}
                                placeholder={spec.name}
                                onChange={(value) => handleOptionChange(value, spec.name, index)}
                            >
                                {spec.options.map((option, index) => (<Option style={{ backgroundColor: spec.name === 'color' && option, textShadow: '1px 0 7px grey' }} key={index} value={option}>{option}</Option>))}
                            </Select>
                        </Form.Item>)) : ''}
                    </div>
                </Form>
            </Modal>
        </>
    );
}