import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Menu, Button } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Logo } from '../../resources/images'
import { IdentityDropdown } from './';

function TopBar(props) {
     const navigate = useNavigate()
     const [collapsed, setCollapsed] = useState(false);
     const [marginLeft, setMarginLeft] = useState(-50);
      const [width, setWidth] = useState(window.innerWidth);

     const toggleCollapsed = () => {
      setCollapsed(!collapsed);
      if(collapsed) {
        setMarginLeft(-50);
      } else {
        setMarginLeft(0);
      }
    };

    useEffect(() => {
      const handleResize = () => {
        setWidth(window.innerWidth);
      };
  
      // Attach event listener for window resize
      window.addEventListener('resize', handleResize);
  
      // Clean up the event listener on component unmount
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

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
        label: 'Зарах',
        key: '/sell'
      },
       {
         label: 'Сагс',
         key: '/cart'
       },
       {
        label: 'Захиалгууд',
        key: '/orders'
      }
     ]

     const navigateToPage = (key) => {
      navigate(key.key)
     }

     return (
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', width: '90vw'}}>
               {window.innerWidth > 600 ? (
                <React.Fragment>
                   <a href='/'><img src={Logo} style={{height: '75px'}}/></a>
                  <Menu
                    onClick={navigateToPage}
                    selectedKeys={props?.selected}
                    items={menuItems}
                    mode='horizontal'
                    style={{ minWidth: '400px', display: 'flex', justifyContent: 'center' }}
                  />
                  <IdentityDropdown user={props?.user}/>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Button type="primary" onClick={toggleCollapsed} style={{  }}>
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  </Button>
                  <Menu
                    onClick={navigateToPage}
                    selectedKeys={props?.selected}
                    items={menuItems}
                    mode='inline'
                    style={{ position: 'absolute', width: '40%', marginLeft: `${marginLeft}%`, marginTop: '265px', transition: '300ms' }}
                  />
                   <a href='/'><img src={Logo} style={{height: '75px'}}/></a>
                  <IdentityDropdown user={props?.user}/>
                </React.Fragment>
              )}
               
          </div>
     )
}

export default TopBar