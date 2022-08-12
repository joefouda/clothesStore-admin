import './Signup.css'
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button } from "antd";
import {FormOutlined} from '@ant-design/icons' 
import CircularProgress from "@material-ui/core/CircularProgress";
import { NotificationContext } from "../../App";
import useToggle from "../../customHooks/useToggle";
import axios from 'axios'

export default function Login(props) {
    const navigate = useNavigate();
    const [progress, toggleProgress] = useToggle(false);
    const { handleNotification } = useContext(NotificationContext);

    const onFinish = (values) => {
        toggleProgress();
        axios.post('http://localhost:3000/api/v1/admin/signup', values).then((response) => {
            if (!response.data.message.includes('duplicate key error')) {
                navigate('/login')
            } else {
                handleNotification('error', 'UserName Exists')
            }
            toggleProgress();
        }).catch(error => {
                handleNotification('error', 'Server Error')
                toggleProgress();
        })
    };
    const [signupForm] = Form.useForm();

    return (
        <>
            {progress ? (
                <CircularProgress className="circular-progress" />
            ) : (
                <Form
                    form={signupForm}
                    wrapperCol={{
                        span: 24,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    className='signup-form'
                    onFinish={onFinish}
                    autoComplete="off"
                >
                        <Form.Item className='signup-button-container' shouldUpdate>
                            {()=>(
    
                            <Button
                                icon={<FormOutlined />}
                                htmlType="submit"
                                className='signup-button'
                                disabled={!signupForm.isFieldsTouched(true) ||
                                    !!signupForm.getFieldsError().filter(({ errors }) => errors.length).length
                                }
                            >
                                signup
                            </Button>
                            )}
                        </Form.Item>
                    <div className='fields-container'>
                        <Form.Item
                            name="userName"
                            rules={[
                                {
                                    required: true,
                                },
                                {
                                    min: 4,
                                },
                            ]}
                        >
                            <Input  placeholder="UserName" className='input-field' allowClear />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                },
                                {
                                    min: 8,
                                },
                            ]}
                        >
                            <Input.Password placeholder="Password" className='input-field' allowClear />
                        </Form.Item>
                    </div>
                </Form>
            )}
        </>
    );
}
