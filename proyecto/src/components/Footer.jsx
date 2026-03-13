import React from "react";

import "./Footer.css";

function Footer() {

  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-brand">
          <h2>GameHub</h2>
          <p>Juega gratis desde cualquier lugar.</p>
        </div>

        <div className="footer-links">
          <h4>Secciones</h4>

          <ul>
            <li><a href="#">Inicio</a></li>
            <li><a href="#">Juegos</a></li>
            <li><a href="#">Nuevos</a></li>
            <li><a href="#">Populares</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Información</h4>

          <ul>
            <li><a href="#">Acerca de</a></li>
            <li><a href="#">Contacto</a></li>
            <li><a href="#">Privacidad</a></li>
            <li><a href="#">Términos</a></li>
          </ul>
        </div>

        <div className="footer-social">
          <h4>Redes</h4>

          <div className="social-icons">
            <a href="#">🌐</a>
            <a href="#">📺</a>
            <a href="#">🎮</a>
          </div>
        </div>

      </div>

      {/* Parte inferior del footer */}
      <div className="footer-bottom">
        <p>© 2026 GameHub - Todos los derechos reservados</p>
      </div>

    </footer>
  );
}

export default Footer;