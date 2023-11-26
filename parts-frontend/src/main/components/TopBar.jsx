import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu } from 'antd'
import { Logo } from '../../resources/images'
import { IdentityDropdown } from './';

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

     return (
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', width: '90vw'}}>
               <img src={Logo} style={{height: '75px'}}/>
               <Menu onClick={navigateToPage} selectedKeys={props?.selected} items={menuItems} mode='horizontal' style={{minWidth: '400px', display: 'flex', justifyContent: 'center'}}/>
               <IdentityDropdown user={props?.user} />
          </div>
     )
}

export default TopBar