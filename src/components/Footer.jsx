import React from 'react';
import { FaGithub, FaTwitter, FaTelegram, FaDiscord, FaYoutube, FaVk } from 'react-icons/fa';
import '../style/footer.scss';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>О нас</h3>
          <ul>
            <li><a href="#">О компании</a></li>
            <li><a href="#">Блог</a></li>
            <li><a href="#">Карьера</a></li>
            <li><a href="#">Партнерская программа</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Поддержка</h3>
          <ul>
            <li><a href="#">Центр поддержки</a></li>
            <li><a href="#">Руководства</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Связаться с нами</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Для разработчиков</h3>
          <ul>
            <li><a href="#">Документация</a></li>
            <li><a href="#">API</a></li>
            <li><a href="#">Статус сервисов</a></li>
            <li><a href="#">Отправить приложение</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Контакты</h3>
          <ul>
            <li>Email: support@atomui.com</li>
            <li>Тел: +7 (999) 123-45-67</li>
            <li>Адрес: Москва, ул. Примерная, 123</li>
            <li>Время работы: 24/7</li>
          </ul>
        </div>
      </div>

      <div className="footer-social">
        <div className="social-icons">
          <a href="#" className="social-icon"><FaGithub /></a>
          <a href="#" className="social-icon"><FaTwitter /></a>
          <a href="#" className="social-icon"><FaTelegram /></a>
          <a href="#" className="social-icon"><FaDiscord /></a>
          <a href="#" className="social-icon"><FaYoutube /></a>
          <a href="#" className="social-icon"><FaVk /></a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-links">
          <a href="#">Условия использования</a>
          <a href="#">Политика конфиденциальности</a>
          <a href="#">Правовая информация</a>
          <a href="#">Cookie-файлы</a>
        </div>
        <div className="footer-copyright">
          <p>© 2024 AtomUI. Все права защищены.</p>
          <p>Правообладатель: ООО "АтомЮИ"</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 