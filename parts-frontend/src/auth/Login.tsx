import { useState } from 'react'
import { Button, Form, Input, Spin, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { Logo } from '../resources/images';

const Login = () => {
     const [isLoading, setLoading] = useState(false);
     const navigate = useNavigate();

     type FieldType = {
          email?: string;
          password?: string;
        };

     const onFinish = (values: any) => {
          const url = 'http://5.161.118.247:8089/api/auth/login';
          setLoading(true)
          axios.post(url, values, {
               headers: {
                    'Content-Type': 'application/json',
               }
          })
          .then(response => {
               console.log(response.data)
               if(response.status === 200) {
                    const token = response.data.token;
                    localStorage.setItem('parts-token', token);
                    message.success('Амжилттай нэвтэрлээ');
                    navigate("/")
               }
          })
          .catch(error => {
               setLoading(false)
               if(error.response?.data?.message === 'EMAIL_OR_PASSWORD_INVALID') {
                    message.error('Мэйл хаяг эсвэл нууц үг буруу байна');
               } else {
                    message.error("Системийн алдаа гарлаа.")
               }
          });
     }

     return (
          <div className="center-container">
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{maxWidth: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              autoComplete="off"
            >
               <Form.Item>
                    <a href='/'><img src={Logo} style={{width: '250px'}}/></a>
               </Form.Item>
               <Form.Item<FieldType> label="Цахим Хаяг" name="email" rules={[{ required: true, message: 'Please input your username!' }]}>
                    <Input size="large" placeholder='test@gmail.com'/>
               </Form.Item>

               <Form.Item<FieldType> label="Нууц үг" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                    <Input.Password size="large" placeholder='********'/>
               </Form.Item>

               <Form.Item<FieldType> wrapperCol={{ offset: 8, span: 16 }} style={{ textAlign: 'center' }}>
                    <Button type="primary" htmlType='submit' style={{ marginRight: '8px' }}>
                         Нэвтрэх
                    </Button>
                    {
                         isLoading ? <Spin /> : <></>
                    }
                    <Button href='/register' type='link' style={{marginTop: '15px'}}>Шинэ бүртгэл үүсгэх</Button>
               </Form.Item>
            </Form>
          </div>
        );
     
}

export default Login;