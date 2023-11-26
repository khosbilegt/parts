import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Button} from 'antd'
import { Logo } from '../../resources/images'
import { IdentityDropdown } from './';
import axios from 'axios'

function TopBar(props) {
     const navigate = useNavigate()
     const [user, setUser] = useState({})
  
     const menuItems = [
       {
         label: 'Нүүр',
         key: '/'
       },
       {
         label: 'Бараа',
         key: '/browse'
       },
       {
         label: 'Бидний тухай',
         key: '/about'
       }
     ]

     const navigateToPage = (key) => {
          navigate(key.key)
     }

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
               console.log(error)
          });
     }

     useEffect(() => {
          validateToken()
     }, [])

     return (
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', width: '90vw'}}>
               <img src={Logo} style={{height: '75px'}}/>
               <Menu onClick={navigateToPage} selectedKeys={props?.selected} items={menuItems} mode='horizontal' style={{minWidth: '400px', display: 'flex', justifyContent: 'center'}}/>
               <IdentityDropdown user={user} />
          </div>
     )
}

export default TopBar