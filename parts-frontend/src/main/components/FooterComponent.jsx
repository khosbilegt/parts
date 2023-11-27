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
    <footer className="padding_4x" style={{width: '100vw', marginTop: '50px'}}>
      <div className="flex">
        <section className="flex-content padding_1x">
          <h3>Холбоосууд</h3>
          <a href="/">Нүүр</a>
          <a href="/browse">Бараа</a>
          <a href="/sell">Зарах</a>
        </section>
        <section className="flex-content padding_1x">
          <h3 style={{opacity: 0}}>T</h3>
          <a href="/cart">Сагс</a>
          <a href="/orders">Захиалгууд</a>
        </section>
        <section className="flex-content padding_1x">
          <h3>Мэдээлэл</h3>
          <a href="/">Нийт хэрэглэгчдийн тоо: {data?.users}</a>
          <a href="/browse">Нийт барааны тоо: {data?.products}</a>
          <a href="/about">Нийт захиалгын тоо: {data?.orders} </a>
        </section>
        <section className="flex-content padding_1x">
          <h3>Newsletter</h3>
          <p>Өөрчлөлтүүдийн тухай мэдээллийг цар алдалгүйгээр хүлээн авахыг хүсвэл: </p>
          <fieldset className="fixed_flex">
            <input type="email" name="newsletter" placeholder="Цахим хаяг" />
            <button className="btn btn_2">Subscribe</button>
          </fieldset>
        </section>
      </div>
      <div className="flex">
        <section className="flex-content padding_1x">
          <p>Copyright ©2023 All rights reserved || Redparts.com </p>
        </section>
        <section className="flex-content padding_1x">
          <a href="#"><i className="fa fa-facebook"></i></a>
          <a href="#"><i className="fa fa-twitter"></i></a>
          <a href="#"><i className="fa fa-dribbble"></i></a>
          <a href="#"><i className="fa fa-linkedin"></i></a>
        </section>
      </div>
    </footer>
  )
}

export default FooterComponent