import { useEffect, useState } from "react";
import axios from 'axios'
import { TopBar, FooterComponent } from "./components";
import { Car } from "../resources/images";
import { Card, Typography } from "antd";
import { CarOutlined, CheckCircleOutlined, ArrowDownOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;

function About() {
     const [user, setUser] = useState({})

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
                 console.log(user)
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
     <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
     <TopBar selected={'/about'} user={user}/>
     <Typography style={{textAlign: 'center'}}>
       <Title style={{fontFamily: "'Roboto', sans-serif"}}>СЭЛБЭГИЙН ОНЛАЙН ЗАХ</Title>
       <Text type='secondary'>Монголын иргэн бүрт машины сэлбэг худалдаалах хялбар шийдлийг хүргэх бол бидний зорилго юм.</Text>
     </Typography>
     <FooterComponent />
   </div>
  )
}

export default About