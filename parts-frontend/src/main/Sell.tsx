import { Button, Form, Input, InputNumber, message } from "antd"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { IdentityDropdown } from "./components";
import axios from "axios";


function Sell() {
     const navigate = useNavigate();
     const [user, setUser] = useState({})
     const [isLoading, setLoading] = useState(true)
     const [orderItems, setOrderItems] = useState({})

     type FieldType = {
          productName?: string;
          description?: string;
          category?: string,
          manufacturer?: string,
          price?: number,
          stock?: number
        };

     useEffect(() => {
          validateToken()
     }, [])

     const validateToken = () => {
          const token = localStorage.getItem('parts-token');
          const url = "http://127.0.0.1:8080/api/auth?token=" + token;
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

     const createProduct = (values: any) => {
          const token = localStorage.getItem('parts-token');
          const url = 'http://127.0.0.1:8080/api/product';
          const updatedValues = { ...values, token };
          setLoading(true)
          console.log(values)
          axios.post(url, updatedValues, {
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
               setLoading(false)
               if(error.response?.data?.message === 'EMAIL_OR_PASSWORD_INVALID') {
                    message.error('Мэйл хаяг эсвэл пассворд буруу байна');
               } else if(error.response?.data?.message === "TOKEN_INVALID") {
                    navigate("/login")  
               }
               else {
                    console.log(error?.response)
                    message.error("Системийн алдаа гарлаа.")
               }
          });
     }

     return (
          <div style={{
               display: 'flex',
               flexDirection: 'column',
               minHeight: '90vh',
               padding: '10px',
          }}
          >
               <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                    <Button href='/'>Буцах</Button>
                    <IdentityDropdown user={user} />
               </div>
               <Form
                    layout="vertical"
                    style={{ width: '70vw', marginLeft: '15vw', padding: '20px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}
                    onFinish={createProduct}
               >
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
                    <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
                         <Form.Item label="Үнэ" name="price" rules={[{ required: true, message: 'Үнэ оруулна уу.' }]}>
                              <InputNumber size="large" placeholder="Үнэ" />
                         </Form.Item>
                         <Form.Item label="Үлдэгдэл" name="stock" rules={[{ required: true, message: 'Үлдэгдэл оруулна уу.' }]}>
                              <InputNumber size="large" placeholder="Үлдэгдэл" />
                         </Form.Item>
                    </div>
                    <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>
                         Үүсгэх
                    </Button>
                    </Form.Item>
               </Form>
          </div>
     )
}

export default Sell