import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Dropdown, Button } from 'antd';

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
               label: 'Гарах',
               onClick: () => logout()
          }
     ];

     const logout = () => {
          const token = localStorage.getItem('parts-token');
          const url = "http://127.0.0.1:8080/api/auth/logout?token=" + token;
          axios.delete(url, {
               headers: {
                    'Content-Type': 'application/json',
               }
          })
          .then(response => {
               navigate('/login')
          })
     }

  return (
     <Dropdown menu={{ items: userActionItems }} style={{float: 'right'}}>
          <Button onClick={(e) => e.preventDefault()}>
               {props?.user?.firstName + " " + props?.user?.lastName}
          </Button>
     </Dropdown>
  )
}

export default IdentityDropdown