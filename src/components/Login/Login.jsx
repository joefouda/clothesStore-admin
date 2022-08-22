import './Login.css'
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button } from "antd";
import {LockOutlined, UnlockOutlined} from '@ant-design/icons' 
import CircularProgress from "@material-ui/core/CircularProgress";
import Authentication from "../../auth/authentication";
import { NotificationContext } from "../../App";
import useToggle from "../../customHooks/useToggle";

export default function Login(props) {
    const navigate = useNavigate();
    const [progress, toggleProgress] = useToggle(false);
    const { handleNotification } = useContext(NotificationContext);

    const onFinish = (values) => {
        toggleProgress();
        Authentication.logIn(values)
            .then((res) => {
                if (res.data.status === 422) {
                    handleNotification("error", "Invalid Username or Password");
                } else {
                    localStorage.setItem("token", res.data.token);
                    navigate("/");
                }
                toggleProgress();
            })
            .catch((error) => {
                handleNotification("error", "Server Error");
            });
    };
    const [loginForm] = Form.useForm();

    return (
        <>
            {progress ? (
                <CircularProgress className="circular-progress" />
            ) : (
                <Form
                    form={loginForm}
                    wrapperCol={{
                        span: 24,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    className='login-form'
                    onFinish={onFinish}
                    autoComplete="off"
                >
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
                    <Form.Item className='login-button-container' shouldUpdate>
                        {()=>(

                        <Button
                            icon={!loginForm.isFieldsTouched(true) ||
                                !!loginForm.getFieldsError().filter(({ errors }) => errors.length).length
                            ?<LockOutlined />:<UnlockOutlined />}
                            htmlType="submit"
                            className='login-button'
                            disabled={!loginForm.isFieldsTouched(true) ||
                                !!loginForm.getFieldsError().filter(({ errors }) => errors.length).length
                            }
                        >
                            Login
                        </Button>
                        )}
                    </Form.Item>
                </Form>
            )}
        </>
    );
}
