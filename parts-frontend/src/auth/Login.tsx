import React from 'react'
import { Button, Form, Input } from 'antd';
import axios from 'axios';

const Login = () => {

     type FieldType = {
          email?: string;
          password?: string;
        };

     const onFinish = (values: any) => {
          const url = 'http://127.0.0.1:8080/api/auth/login';
          axios.post(url, values, {
               headers: {
                    'Content-Type': 'application/json',
               }
          })
          .then(response => {
               console.log('POST request successful:', response.data);
          })
          .catch(error => {
               console.error('Error:', error);
          });
     }

     const onFinishFailed = () => {

     }

     return (
          <Form
               name="basic"
               labelCol={{ span: 8 }}
               wrapperCol={{ span: 16 }}
               style={{ maxWidth: 600 }}
               initialValues={{ remember: true }}
               onFinish={onFinish}
               onFinishFailed={onFinishFailed}
               autoComplete="off"
          >
               <Form.Item<FieldType> label="Email" name="email" rules={[{ required: true, message: 'Please input your username!' }]}>
                    <Input />
               </Form.Item>

               <Form.Item<FieldType> label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                    <Input />
               </Form.Item>

               <Form.Item<FieldType> wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType='submit'>
                         Submit
                    </Button>
               </Form.Item>
          </Form>
     )
}

export default Login