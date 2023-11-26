import { Button, Form, Input, InputNumber, Typography, Upload, message } from "antd"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FooterComponent, TopBar } from "./components";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";


function Sell() {
     const navigate = useNavigate();
     const [user, setUser] = useState({})
     const [uuid, setUUID] = useState("")

     const props = {
          name: 'file',
          action: 'http://5.161.118.247:8089/api/image',
          headers: {
            authorization: 'authorization-text',
          },
          onChange(info) {
            if (info.file.status !== 'uploading') {
            }
            if (info.file.status === 'done') {
              message.success(`${info.file.name} file uploaded successfully`);
               setUUID(info.file.response?.id)
            } else if (info.file.status === 'error') {
              message.error(`${info.file.name} file upload failed.`);
            }
          },
        };

     const validateToken = () => {
          const token = localStorage.getItem('parts-token');
          const url = "http://5.161.118.247:8089/api/auth?token=" + token;
          axios.get(url, {
               headers: {
                    'Content-Type': 'application/json',
               }
          })
          .then(response => {
               if(response.status === 200) {
                    setUser(response.data.user);
               }
          })
          .catch(error => {
               if(error.response.data?.message === "TOKEN_INVALID") {
                    navigate("/login")  
               }
          });
     }

     const createProduct = (values) => {
          const token = localStorage.getItem('parts-token');
          const url = 'http://5.161.118.247:8089/api/product';
          const updatedValues = { ...values, token };
          const updatedValuesWithImage = { ...updatedValues, uuid };
          axios.post(url, updatedValuesWithImage, {
               headers: {
                    'Content-Type': 'application/json',
               }
          })
          .then(response => {
               if(response.status === 200) {
                    message.success('Бараа амжилттай үүслээ');
                    navigate("/")
               }
          })
          .catch(error => {
               if(error.response?.data?.message === 'EMAIL_OR_PASSWORD_INVALID') {
                    message.error('Мэйл хаяг эсвэл пассворд буруу байна');
               } else if(error.response?.data?.message === "TOKEN_INVALID") {
                    navigate("/login")  
               }
               else {
                    message.error("Системийн алдаа гарлаа.")
               }
          });
     }


     useEffect(() => {
          validateToken()
     }, [])

     return (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh'}}>
               <TopBar user={user}/>
               <Form
                    layout="vertical"
                    style={{ width: '60vw', padding: '30px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}
                    onFinish={createProduct}>
                    <Form.Item>
                         <Typography><Typography.Title level={3}>Бараа нэмэх</Typography.Title></Typography>
                    </Form.Item>
                    <Form.Item label="Барааны нэр" name="productName" rules={[{ required: true, message: 'Барааны нэр оруулна уу.' }]}>
                         <Input size="large" placeholder="Барааны нэр" />
                    </Form.Item>
                    <Form.Item label="Тайлбар" name="description" rules={[{ required: true, message: 'Тайлбар оруулна уу.' }]}>
                         <Input size="large" placeholder="Тайлбар" />
                    </Form.Item>
                    <Form.Item label="Төрөл" name="category" rules={[{ required: true, message: 'Төрөл оруулна уу.' }]}>
                         <Input size="large" placeholder="Төрөл" />
                    </Form.Item>
                    <Form.Item label="Үйлдвэрлэгч" name="manufacturer" rules={[{ required: true, message: 'Үйлдвэрлэгч оруулна уу.' }]}>
                         <Input size="large" placeholder="Үйлдвэрлэгч" />
                    </Form.Item>
                    <div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%', columnGap: '25px'}}>
                         <Form.Item label="Үнэ" name="price" rules={[{ required: true, message: 'Үнэ оруулна уу.' }]} style={{width: '100%', textAlign: 'center'}}>
                              <InputNumber size="large" placeholder="Үнэ" style={{width: '100%'}}/>
                         </Form.Item>
                         <Form.Item label="Үлдэгдэл" name="stock" rules={[{ required: true, message: 'Үлдэгдэл оруулна уу.' }]} style={{width: '100%', textAlign: 'center'}}>
                              <InputNumber size="large" placeholder="Үлдэгдэл" style={{width: '100%'}}/>
                         </Form.Item>
                    </div>
                    <Upload {...props}>
                         <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                    <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ marginRight: '8px', marginTop: '10px' }}>
                         Үүсгэх
                    </Button>
                    </Form.Item>
               </Form>
               <FooterComponent />
          </div>
     )
}

export default Sell