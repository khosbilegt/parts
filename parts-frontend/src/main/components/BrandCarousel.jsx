import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel, Card, Typography, Button, Tabs } from 'antd'
import styled from 'styled-components';
import './BrandCarousel.css'
import {
     Bentley,
     BMW,
     Chevrolet,
     Daihatsu,
     Honda,
     Hyundai,
     Jaguar,
     Jeep,Lamborghini,
     Lexus,
     Porsche,
     Subaru,
     Suzuki,
     Tesla,
     Toyota,
     Volkswagen,
     Motor,
     Wheels,
     Headlight,
     Axle,
     Battery,
     Windscreen,
} from '../../resources/images'

function BrandCarousel() {
  const navigate = useNavigate()
  const [width, setWidth] = useState(window.innerWidth);
  const [activeTab, setActiveTab] = useState('1');
  const [activeBrandArray, setActiveBrandArray] = useState([]);
  const [activeTypeArray, setActiveTypeArray] = useState([]);

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
  
  const gridStyle = {
    width: '33.3%',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex', 
    flexDirection: 'column',
    columnGap: '10px'
  };


  const CarouselWrapper = styled(Carousel)`
    > .slick-dots {
      height: 50px;
      display: 'flex';
      justify-content: 'center';
      align-items: 'center';
    }
    > .slick-dots li {
      width: 30px;
      height: 10px;
    }
    > .slick-dots li button {
      width: 100%;
      height: 100%;
      background: #808080;
    }
    > .slick-dots li.slick-active button {
      background: black;
    }
  `;

  const defaultURL = '/browse?type=';

  const brandArrays = [
    [
      {
        url: 'Bentley',
        img: Bentley
      },
      {
        url: 'BMW',
        img: BMW
      },
      {
        url: 'Chevrolet',
        img: Chevrolet
      },
      {
        url: 'Daihatsu',
        img: Daihatsu
      },
      {
        url: 'Honda',
        img: Honda
      },
      {
        url: 'Hyundai',
        img: Hyundai
      },
    ],
    [
      {
        url: 'Jaguar',
        img: Jaguar
      },
      {
        url: 'Jeep',
        img: Jeep
      },
      {
        url: 'Lamborghini',
        img: Lamborghini
      },
       {
        url: 'Lexus',
        img: Lexus
      },
      {
        url: 'Porsche',
        img: Porsche
      },
      {
        url: 'Subaru',
        img: Subaru
      },    
    ],
    [
      {
        url: 'Suzuki',
        img: Suzuki
      },
      {
        url: 'Tesla',
        img: Tesla
      },
      {
        url: 'Toyota',
        img: Toyota
      },
      {
        url: 'Volkswagen',
        img: Volkswagen
      },
    ]
  ]

  const typeArrays = [
    {
      url: "Motor",
      img: Motor
    },
    {
      url: "Wheels",
      img: Wheels
    },
    {
      url: "Headlight",
      img: Headlight
    },
    {
      url: "Axle",
      img: Axle
    },
    {
      url: "Battery",
      img: Battery
    },
    {
      url: "Windscreen",
      img: Windscreen
    }
  ]

  const tabs = [
    {
      key: '1',
      label: 'Үйлдвэрлэгч',
      children: <CarouselWrapper style={{display: 'flex', width: '100%', paddingBottom: '100px'}} draggable swipeToSlide={true}>
        {activeBrandArray.map((brands) => {
          return (
            <Card style={{width: '100%'}}>
              {brands.map((brand) => {
                  return <Card.Grid style={gridStyle} key={1} onClick={(e) => {
                      navigate(defaultURL + "MANUFACTURER&parameter=" + brand.url)
                  }}>
                  <Typography>{brand.url}</Typography>
                  <img src={brand.img} style={{objectFit: 'scale-down', width: '50%', aspectRatio: '1/1'}} />
                </Card.Grid>
              })}
            </Card>
          )
        })}
      </CarouselWrapper>
    },
    {
      key: '2',
      label: 'Tөрөл',
      children: <CarouselWrapper style={{display: 'flex', width: '100%', paddingBottom: '100px'}} draggable swipeToSlide={true}>
          <Card style={{width: '100%'}}>
            {activeTypeArray.map((type) => {
              return <Card.Grid style={gridStyle} key={1} onClick={(e) => {
                  navigate(defaultURL + "CATEGORY&parameter=" + type.url)
              }}>
                <Typography>{type.url}</Typography>
                <img src={type.img} style={{objectFit: 'scale-down', width: '50%', aspectRatio: '1/1'}} />
              </Card.Grid>
            })}
          </Card>
        </CarouselWrapper>,
    }
  ];

  const changeTab = (key) => {
    setActiveTab(key)
  }

    useEffect(() => {
      switch (activeTab) {
        case '1':
          setActiveBrandArray(brandArrays);
          break;
        case '2':
          setActiveTypeArray(typeArrays);
          break;
        case '3':
          setActiveBrandArray(brandArrays);
          break;
        // Add more cases if needed
        default:
          setActiveBrandArray([]);
      }
    }, [activeTab]);

  return (
    <Card style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', alignItems: 'center', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', width: '100%' }}>
      <Tabs defaultActiveKey='1' items={tabs} onChange={changeTab} style={{ width: width * 0.6}} />
    </Card>
    // </CarouselWrapper>
  )
}

export default BrandCarousel