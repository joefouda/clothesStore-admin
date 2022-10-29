import { Form, Input, Button, Modal } from "antd";
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import useToggle from "../customHooks/useToggle";
import { useEffect } from "react";


export default function SizeForm(props) {
    const [modalVisable, toggleModal] = useToggle(false)

    const handleOk = () => {
        sizeForm.submit()
    }

    const handleCancel = () => {
        toggleModal()
    }

    const onFinish = (values) => {
        if (props.mode === 'Add') {
            props.addSize(values)
        } else {
            props.handleEditSize({...values, _id:props.size?._id})
        }
        toggleModal()
    };
    useEffect(() => {
        sizeForm.resetFields()
        sizeForm.setFieldsValue({
            size: props.size?.size || '',
            stock: props.size?.stock || ''
        })
    }, [modalVisable])
    const [sizeForm] = Form.useForm();

    return (
        <>
            {props.mode === 'Add' ? <Button
                onClick={toggleModal}
                icon={<PlusOutlined />}
                className="no-background-button"
            >
                Add new Size
            </Button> : <Button className="no-background-button" icon={<EditOutlined />} aria-label="edit" onClick={toggleModal}></Button>}
            <Modal title={props.mode === 'Add' ? "Add new Size" : "Edit Size details"} visible={modalVisable} onOk={handleOk} okText={props.mode === 'Add' ? 'Add' : 'Save Changes'} onCancel={handleCancel}>
                <Form
                    form={sizeForm}
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
                            name="size"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input placeholder="Size" allowClear />
                        </Form.Item>
                        <Form.Item
                            name="stock"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input placeholder="Stock" allowClear />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </>
    );
}