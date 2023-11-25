import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { IdentityDropdown } from './components'
import axios from 'axios';
import { Typography } from 'antd';

function Cart() {
     const navigate = useNavigate();
     const [user, setUser] = useState({})
     const [cartItems, setCartItems] = useState([])

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
                    fetchCart()
               }
          })
          .catch(error => {
               if(error.response.data?.message === "TOKEN_INVALID") {
                    navigate("/login")  
               }
          });
     }

     const fetchCart = () => {
          const token = localStorage.getItem('parts-token');
          const url = "http://127.0.0.1:8080/api/cart?token=" + token;
          axios.get(url, {
               headers: {
                    'Content-Type': 'application/json',
               }
          })
          .then(response => {
               if(response.status === 200) {
                    setCartItems(response.data)
               }
          })
          .catch(error => {
               if(error.response.data?.message === "TOKEN_INVALID") {
                    navigate("/login")  
               }
          });
     }

  return (
     <div style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          padding: '10px',
         }}
     >
          <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
               <IdentityDropdown user={user} />
               <IdentityDropdown user={user} />
          </div>
          <div>
               {cartItems.map((item, index) => {
                    return <Typography index={index}>{item.productId}</Typography>
               })}
          </div>
    </div>
  )
}

export default Cart