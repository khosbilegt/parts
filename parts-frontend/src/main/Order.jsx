import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { IdentityDropdown } from './components'
import axios from 'axios';
import { List, Button, Typography, Badge, Tag} from 'antd';

function Order() {
     const navigate = useNavigate();
     const [user, setUser] = useState({})
     const [isLoading, setLoading] = useState(true)
     const [orderItems, setOrderItems] = useState({})

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
                    fetchOrders()
               }
          })
          .catch(error => {
               if(error.response.data?.message === "TOKEN_INVALID") {
                    navigate("/login")  
               }
          });
     }

     const fetchOrders = () => {
          setLoading(true)
          const token = localStorage.getItem('parts-token');
          const url = "http://5.161.118.247:8089/api/order?token=" + token;
          axios.get(url, {
               headers: {
                    'Content-Type': 'application/json',
               }
          })
          .then(response => {
               if(response.status === 200) {
                    const items = {
                         orderItems: response.data
                    }
                    console.log(items)
                    setOrderItems(items)
                    setLoading(false)
               }
          })
          .catch(error => {
               if(error.response?.data?.message === "TOKEN_INVALID") {
                    navigate("/login")  
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
          <List style={{marginTop: '10px', marginLeft: '10vw', width: '80vw'}} loading={isLoading} dataSource={orderItems?.orderItems} renderItem={(item) => {
               const state = item?.state === 'DELIVERED' ? 'Хүргэгдсэн' : 'Баталгаажсан'
               return (
                    <List.Item
                         actions={[]}>
                         <List.Item.Meta
                              description={"Захиалга үүссэн цаг: " + item?.createDate}
                              title={<Typography>{item?.orderId}</Typography>}
                         />
                         <Typography>Барааны тоо: </Typography>
                         <Badge count={Math.max(item.items.length, 0)} style={{ backgroundColor: '#52c41a', marginLeft: '5px' }}/>
                         <Typography style={{marginLeft: '5px', marginRight: '5px'}}>Төлөв: </Typography>
                         <Tag color='magenta'>{state}</Tag>
                    </List.Item>
               )
          }}>
          </List>
    </div>
  )
}

export default Order