import './Footer.css'

function FooterComponent() {
  return (
    <footer class="footer" style={{width: '100vw'}}>
    <div class="waves">
      <div class="wave" id="wave1"></div>
      <div class="wave" id="wave2"></div>
      <div class="wave" id="wave3"></div>
      <div class="wave" id="wave4"></div>
    </div>
    <ul class="social-icon">
      <li class="social-icon__item"><a class="social-icon__link" href="#">
          <ion-icon name="logo-facebook"></ion-icon>
        </a></li>
      <li class="social-icon__item"><a class="social-icon__link" href="#">
          <ion-icon name="logo-twitter"></ion-icon>
        </a></li>
      <li class="social-icon__item"><a class="social-icon__link" href="#">
          <ion-icon name="logo-linkedin"></ion-icon>
        </a></li>
      <li class="social-icon__item"><a class="social-icon__link" href="#">
          <ion-icon name="logo-instagram"></ion-icon>
        </a></li>
    </ul>
    <ul class="menu">
      <li class="menu__item"><a class="menu__link" href="#">Нүүр</a></li>
      <li class="menu__item"><a class="menu__link" href="#">Бараа</a></li>
      <li class="menu__item"><a class="menu__link" href="#">Бидний тухай</a></li>
    </ul>
    <p>&copy;All Rights Reserved</p>
  </footer>
  )
}

export default FooterComponent