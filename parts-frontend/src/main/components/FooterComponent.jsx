import axios from 'axios'
import { useEffect, useState } from 'react'
import './Footer.css'

function FooterComponent() {

  const [data, setData] = useState({})

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = () => {
    const url = "http://5.161.118.247:8089/api/stats";
    axios.get(url, {
          headers: {
              'Content-Type': 'application/json',
          }
    })
    .then(response => {
          if(response.status === 200) {
            setData(response.data)
          }
    })
    .catch(error => {
    });
  }

  return (
    <footer class="padding_4x" style={{width: '100vw', marginTop: '50px'}}>
      <div class="flex">
        <section class="flex-content padding_1x">
          <h3>Холбоосууд</h3>
          <a href="/">Нүүр</a>
          <a href="/browse">Бараа</a>
          <a href="/about">Бидний тухай</a>
        </section>
        <section class="flex-content padding_1x">
          <h3>Бусад мэдээлэл</h3>
          <a href="#">Ажлын байр</a>
          <a href="#">Хамт олон</a>
          <a href="#">Мэдээ</a>
        </section>
        <section class="flex-content padding_1x">
          <h3>Мэдээлэл</h3>
          <a href="/">Нийт хэрэглэгчдийн тоо: {data?.users}</a>
          <a href="/browse">Нийт барааны тоо: {data?.products}</a>
          <a href="/about">Нийт захиалгын тоо: {data?.orders} </a>
        </section>
        <section class="flex-content padding_1x">
          <h3>Newsletter</h3>
          <p>Өөрчлөлтүүдийн тухай мэдээллийг шууд хүлээн авахыг хүсвэл: </p>
          <fieldset class="fixed_flex">
            <input type="email" name="newsletter" placeholder="Цахим хаяг" />
            <button class="btn btn_2">Subscribe</button>
          </fieldset>
        </section>
      </div>
      <div class="flex">
        <section class="flex-content padding_1x">
          <p>Copyright ©2023 All rights reserved || Parts.com </p>
        </section>
        <section class="flex-content padding_1x">
          <a href="#"><i class="fa fa-facebook"></i></a>
          <a href="#"><i class="fa fa-twitter"></i></a>
          <a href="#"><i class="fa fa-dribbble"></i></a>
          <a href="#"><i class="fa fa-linkedin"></i></a>
        </section>
      </div>
    </footer>
  )
}

export default FooterComponent