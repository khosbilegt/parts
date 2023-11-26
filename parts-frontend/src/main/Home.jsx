import { useEffect, useState } from "react";
import axios from 'axios'
import { TopBar, FooterComponent } from "./components";
import { Car } from "../resources/images";
import { Card, Typography, Carousel, Spin } from "antd";
import { CarOutlined, CheckCircleOutlined, ArrowDownOutlined } from "@ant-design/icons";
import './Carousel.css'
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
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <TopBar selected={'/'} user={user} />
      <Typography style={{textAlign: 'center'}}>
        <Title style={{fontFamily: "'Roboto', sans-serif"}}>СЭЛБЭГИЙН ОНЛАЙН ЗАХ</Title>
        <Text type='secondary'>Монголын иргэн бүрт машины сэлбэг худалдаалах хялбар шийдлийг хүргэх бол бидний зорилго юм.</Text>
      </Typography>
      <img src={Car} style={{width: '50vw'}}/>
      <Card title="Бидний давуу талууд" style={{textAlign: 'center', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <Card.Grid style={gridStyle}>
          <CarOutlined style={{fontSize: '25px'}}/>
          <Typography>Хүссэн сэлбэгээ худалдаанд тавих боломжтой</Typography>
        </Card.Grid>
        <Card.Grid style={gridStyle}>
          <ArrowDownOutlined style={{fontSize: '25px'}}/>
          <Typography>Хамгийн бага шимтгэлийн хэмжээ</Typography>
        </Card.Grid>
        <Card.Grid style={gridStyle}>
          <CheckCircleOutlined style={{fontSize: '25px'}}/>
          <Typography>Найдвартай</Typography>
        </Card.Grid>
      </Card>
      <FooterComponent />
    </div>
  )
}

export default Home