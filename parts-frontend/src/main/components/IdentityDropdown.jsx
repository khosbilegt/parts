import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Dropdown, Button, Typography, Skeleton } from 'antd';
import { UserOutlined } from '@ant-design/icons';

function IdentityDropdown(props) {
     const navigate = useNavigate()     

     const userActionItems = [
          {
               key: '1',
               label: 'Сагс',
               onClick: () => navigate('/cart')
          },
          {
               key: '2',
               label: 'Бараа худалдаалах',
               onClick: () => navigate('/sell')
          },
          {
               key: '3',
               label: 'Захиалгууд',
               onClick: () => navigate('/orders')
          },
          {
               key: '4',
               label: 'Гарах',
               onClick: () => logout()
          }
     ];

     const logout = () => {
          const token = localStorage.getItem('parts-token');
          const url = "http://5.161.118.247:8089/api/auth/logout?token=" + token;
          axios.delete(url, {
               headers: {
                    'Content-Type': 'application/json',
               }
          })
          .then(response => {
               navigate('/login')
          })
     }

     if(props?.user?.firstName != null) {
          return (
               <Dropdown menu={{ items: userActionItems }} style={{float: 'right'}}>
                    <Button onClick={(e) => e.preventDefault()} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                         <UserOutlined style={{marginRight: '5px'}}/>
                         <Typography>{props?.user?.firstName + " " + props?.user?.lastName}</Typography>
                    </Button>
               </Dropdown>
          )
     } else {
          return (
               <Button type='primary' href='/login'>
                    Нэвтрэх
               </Button>
          )
     }
}

export default IdentityDropdown