import React from "react";
import styles from "./Footer.module.css"; // Puedes personalizar los estilos en este archivo CSS

const Footer = () => {
  return (
    <footer className={`${styles.footer} text-center py-3`}>
      <p>Desarrollado por Laura Alejandra Ducuara Covos &copy; 2024</p>
      <div>
        <a href="/" className={styles.link}>
          Política de Privacidad
        </a>{" "}
        |
        <a href="/" className={styles.link}>
          Términos de Servicio
        </a>{" "}
        |
        <a
          href="https://wa.me/573197897188?text=Hola%20Laura%2C%20me%20gustaría%20saber%20más%20sobre%20tu%20proyecto."
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Contáctame
        </a>
      </div>
      <p className="mt-2">
        Sígueme en:{" "}
        <a
          href="https://www.linkedin.com/in/laura-alejandra-ducuara-covos-6b2650208/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          LinkedIn
        </a>{" "}
        |
        <a
          href="https://github.com/lauraducuara"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          GitHub
        </a>
      </p>
    </footer>
  );
};

export default Footer;
