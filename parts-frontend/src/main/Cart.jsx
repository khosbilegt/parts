import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FooterComponent, TopBar } from './components'
import axios from 'axios';
import { InputNumber, List, Button, Divider, Typography, message, Avatar } from 'antd';
import { Placehodler } from '../resources/images';

function Cart() {
     const navigate = useNavigate();
     const [user, setUser] = useState({})
     const [isLoading, setLoading] = useState(true)
     const [cartItems, setCartItems] = useState({})
     const [totalCost, setTotalCost] = useState(0)
     const [images, setImages] = useState([])

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

     const decodeImages = () => {
          setImages([])
          cartItems?.cartItems?.forEach((item) => {
               if(item?.product?.image != null) {
                    const decodedImage = atob(item.product?.image);
      
                    const uint8Array = new Uint8Array(decodedImage.length);
                    for (let i = 0; i < decodedImage.length; i++) {
                    uint8Array[i] = decodedImage.charCodeAt(i);
                    }
               
                    const blob = new Blob([uint8Array], { type: 'image/jpeg' });
               
                    const blobUrl = URL.createObjectURL(blob);

                    const image = {
                         src: blobUrl
                    }
                    setImages((prevImages) => [...prevImages, image]);
                    console.log(images)

                    return () => URL.revokeObjectURL(blobUrl);
               } else {
                    const image = {
                         src: Placehodler
                    }
                    setImages((prevImages) => [...prevImages, image]);
                    console.log(images)
                    return () => URL.revokeObjectURL(Placehodler);
               }
          })    
     }

     const calcualteTotal = () => {
          var total = 0
          cartItems?.cartItems?.forEach((item) => {
               total += item?.quantity * item?.product.price
          })
          setTotalCost(total)
     }

     useEffect(() => {
          calcualteTotal()
          decodeImages()
     }, [cartItems])

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
          <TopBar user={user} selected={'/cart'}/>
          <List style={{marginTop: '10px', marginLeft: '10vw', width: '80vw'}} loading={isLoading} dataSource={cartItems?.cartItems} renderItem={(item, index) => {
               return (
                    <List.Item
                         style={{alignItems: 'center', justifyContent: 'center', display: 'flex'}}
                         actions={[<Button key="delete" type='default' onClick={e => removeFromCart(item?.cartItemId)}>Устгах</Button>]}>
                         <List.Item.Meta
                              title={<Typography>{item?.product?.productName}</Typography>}
                              avatar={<Avatar src={images[index]?.src} size={75}/>}
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