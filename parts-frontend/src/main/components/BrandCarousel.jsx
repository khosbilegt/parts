import { Carousel } from 'antd'
import React from 'react'
import styled from 'styled-components';
import './BrandCarousel.css'
import { BMW, Car, Logo, Placehodler,
  Ford,
  Hyundai,
  Jeep,
  Mercedes,
  Nissan,
  Tesla,
  Toyota } from '../../resources/images';

function BrandCarousel() {

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

  const items = [
    {
      url: '/',
      img: BMW
    },
    {
      url: '/',
      img: Ford
    },
    {
      url: '/',
      img: Hyundai
    },
    {
      url: '/',
      img: Jeep
    },
    {
      url: '/',
      img: Mercedes
    },
    {
      url: '/',
      img: Nissan
    },
    {
      url: '/',
      img: Tesla
    },    {
      url: '/',
      img: Toyota
    },
  ]

  return (
    <CarouselWrapper style={{maxWidth: '600px', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center'}} autoplay swipeToSlide={true} draggable>
      {items.map((item) => {
        return <a href={item.url}>
          <img src={item.img} style={{ aspectRatio: '1/1', width: '400px', height: '400px'}}/>
        </a>
      })}
    </CarouselWrapper>
  )
}

export default BrandCarousel