import { useEffect, useState } from "react";
import axios from 'axios'
import { TopBar, FooterComponent, BrandCarousel } from "./components";
import { Card, Typography } from "antd";
import { Car } from "../resources/images";
const { Title, Text } = Typography;


function Home() {
  const [user, setUser] = useState({})

  const gridStyle = {
    width: '33.3%',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex', 
    columnGap: '10px'
  };

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
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100vw'}}>
      <TopBar selected={'/'} user={user} />
      <Typography style={{textAlign: 'center'}}>
        <Title style={{fontFamily: "'Roboto', sans-serif"}}>СЭЛБЭГИЙН ОНЛАЙН ЗАХ</Title>
        <Text type='secondary'>Монголын иргэн бүрт машины сэлбэг худалдаалах хялбар шийдлийг хүргэх бол бидний зорилго юм.</Text>
      </Typography>
      <img src={Car} style={{width: '60vw'}}/>
      <BrandCarousel />
      <FooterComponent />
    </div>
  )
}

export default Home