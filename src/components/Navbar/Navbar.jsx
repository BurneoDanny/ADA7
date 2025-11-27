// Navbar.jsx

import React from "react";
import { useRef } from "react";
import MenuItem from "../MenuItem";
import "./Navbar.css";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import hoverSound from "../../assets/audio/Klick.mp3";

export default function Navbar(props) {
  const { handleItemClick } = props;
  const currentPath = window.location.pathname;
  const CODIFICAR_PATH = "/codificar";
  const DECODIFICAR_PATH = "/decodificar";
  const PROYECTO_PATH = "/sobre-el-proyecto";

  const hoverAudio = useRef(new Audio(hoverSound));
  const playHoverSound = () => {
    hoverAudio.current.currentTime = 0;
    hoverAudio.current
      .play()
      .catch((e) => console.error("Error al reproducir hover:", e));
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">Codificando</div>
      <div className="navbar-menu">
        <MenuItem
          iconName="Code"
          title="Codificar"
          description="Transforma tus cadenas numéricas aplicando algoritmos de seguridad."
          onClick={() => handleItemClick(CODIFICAR_PATH)}
          isActive={currentPath === CODIFICAR_PATH}
          onHoverSound={playHoverSound}
          isNavbar={true}
        />
        <MenuItem
          iconName="Decode"
          title="Decodificar"
          description="Restaura las cadenas originales a partir de las codificadas."
          onClick={() => handleItemClick(DECODIFICAR_PATH)}
          isActive={currentPath === DECODIFICAR_PATH}
          onHoverSound={playHoverSound}
          isNavbar={true}
        />
        <MenuItem
          iconName="Info"
          title="Proyecto"
          description="Conoce los algoritmos, el análisis y las buenas prácticas aplicadas."
          onClick={() => handleItemClick(PROYECTO_PATH)}
          isActive={currentPath === PROYECTO_PATH}
          onHoverSound={playHoverSound}
          isNavbar={true}
        />
      </div>
    </nav>
  );
}
