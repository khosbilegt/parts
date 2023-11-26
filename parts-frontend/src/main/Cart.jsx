import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FooterComponent, IdentityDropdown, TopBar } from './components'
import axios from 'axios';
import { InputNumber, List, Button, Divider, Typography, message } from 'antd';

function Cart() {
     const navigate = useNavigate();
     const [user, setUser] = useState({})
     const [isLoading, setLoading] = useState(true)
     const [cartItems, setCartItems] = useState({})
     const [totalCost, setTotalCost] = useState(0)

     useEffect(() => {
          validateToken()
     }, [])

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
                    fetchCart()
               }
          })
          .catch(error => {
               if(error.response?.data?.message === "TOKEN_INVALID") {
                    navigate("/login")  
               }
          });
     }

     const fetchCart = () => {
          setLoading(true)
          const token = localStorage.getItem('parts-token');
          const url = "http://5.161.118.247:8089/api/cart?token=" + token;
          axios.get(url, {
               headers: {
                    'Content-Type': 'application/json',
               }
          })
          .then(response => {
               if(response.status === 200) {
                    const items = {
                         cartItems: response.data
                    }
                    setCartItems(items)
                    setLoading(false)
                    calcualteTotal()
               }
          })
          .catch(error => {
               if(error.response?.data?.message === "TOKEN_INVALID") {
                    navigate("/login")  
               }
          });
     }
     
     const removeFromCart = (cartItemId) => {
          const token = localStorage.getItem('parts-token');
          const url = "http://5.161.118.247:8089/api/cart?token=" + token + "&cartItemId=" + cartItemId;
          axios.delete(url, {
               headers: {
                    'Content-Type': 'application/json',
               }
          })
          .then(response => {
               if(response.status === 200) {
                    fetchCart()
               }
          })
          .catch(error => {
               if(error.response.data?.message === "TOKEN_INVALID") {
                    navigate("/login")  
               }
          });
     }

     const calcualteTotal = () => {
          var total = 0
          cartItems.cartItems.forEach((item) => {
               total += item?.quantity * item?.product.price
          })
          setTotalCost(total)
     }

     const createOrder = () => {
          const token = localStorage.getItem('parts-token');
          const url = "http://5.161.118.247:8089/api/order?token=" + token;
          axios.post(url, {}, {
               headers: {
                    'Content-Type': 'application/json',
               }
          })
          .then(response => {
               if(response.status === 200) {
                    fetchCart()
                    setTotalCost(0)
                    message.success("Захиалга амжилттай үүслээ")
               }
          })
          .catch(error => {
               if(error.response.data?.message === "TOKEN_INVALID") {
                    navigate("/login")  
               }
          });
     }

  return (
     <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', justifyContent: 'space-between'}}>
          <TopBar user={user}/>
          <List style={{marginTop: '10px', marginLeft: '10vw', width: '80vw'}} loading={isLoading} dataSource={cartItems?.cartItems} renderItem={(item) => {
               return (
                    <List.Item
                         actions={[<Button key="delete" type='default' onClick={e => removeFromCart(item?.cartItemId)}>Устгах</Button>]}>
                         <List.Item.Meta
                              title={<Typography>{item?.product?.productName}</Typography>}
                              description={item?.product?.description}
                         />
                         <div style={{display: 'flex'}}>
                              <InputNumber prefix={"Үнэ: "} value={item?.quantity} suffix={" x " + item?.product?.price + " = " + (item?.product?.price * item?.quantity)}
                              style={{minWidth: "200px"}} disabled={true}
                              />
                         </div>
                    </List.Item>
               )
          }}>
               <Divider />
               <Typography><b>Захиалгын нийт үнэ: </b> {totalCost}</Typography>
               <List.Item style={{width: '100%', display: 'flex'}}>
                    <Button type='primary' style={{float: 'right'}} onClick={createOrder}>Захиалах</Button>
               </List.Item>
          </List>
          <FooterComponent />
    </div>
  )
}

export default Cart