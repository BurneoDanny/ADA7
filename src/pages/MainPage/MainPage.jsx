import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import MenuItem from "../../components/MenuItem";
import "./MainPage.css";
import selectSound from "../../assets/audio/Select.mp3";
import hoverSound from "../../assets/audio/Klick.mp3";
import { useNavigate } from "react-router-dom";

function MainPage() {
  const [activePath, setActivePath] = useState(null);
  const mainRef = useRef(null);
  const menuRef = useRef(null);

  const navigate = useNavigate();

  const hoverAudio = useRef(new Audio(hoverSound));
  const selectAudio = useRef(new Audio(selectSound));

  const playHoverSound = () => {
    hoverAudio.current.currentTime = 0;
    hoverAudio.current
      .play()
      .catch((e) => console.error("Error al reproducir hover:", e));
  };

  const playSelectSound = () => {
    selectAudio.current.currentTime = 0;
    selectAudio.current
      .play()
      .catch((e) => console.error("Error al reproducir select:", e));
  };

  const handleItemClick = (path) => {
    playSelectSound();
    setActivePath(path);
    if (mainRef.current) {
      gsap.to(mainRef.current.children, {
        opacity: 0,
        y: 50,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.in",
        onComplete: () => {
          navigate(path);
        },
      });
    }
  };

  const handleOutsideClick = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setActivePath(null);
    }
  };

  useEffect(() => {
    if (!menuRef.current || menuRef.current.children.length === 0) {
      return;
    }

    const menuItems = menuRef.current.children;

    gsap.set(menuItems, {
      height: 0,
      opacity: 0,
    });

    gsap.to(menuItems, {
      height: "auto",
      opacity: 1,
      duration: 0.7,
      stagger: 0.1,
      ease: "power2.out",
    });
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const CODIFICAR_PATH = "/codificar";
  const DECODIFICAR_PATH = "/decodificar";
  const PROYECTO_PATH = "/sobre-el-proyecto";

  return (
    <div id="App" ref={mainRef}>
      <div id="initial_menu" ref={menuRef}>
        <MenuItem
          iconName="Code"
          title="Codificar Datos"
          description="Transforma tus cadenas numéricas aplicando algoritmos de seguridad."
          onClick={() => handleItemClick(CODIFICAR_PATH)}
          isActive={activePath === CODIFICAR_PATH}
          onHoverSound={playHoverSound}
        />
        <MenuItem
          iconName="Decode"
          title="Decodificar Datos"
          description="Restaura las cadenas originales a partir de las codificadas."
          onClick={() => handleItemClick(DECODIFICAR_PATH)}
          isActive={activePath === DECODIFICAR_PATH}
          onHoverSound={playHoverSound}
        />
        <MenuItem
          iconName="Info"
          title="Sobre el Proyecto"
          description="Conoce los algoritmos, el análisis y las buenas prácticas aplicadas."
          onClick={() => handleItemClick(PROYECTO_PATH)}
          isActive={activePath === PROYECTO_PATH}
          onHoverSound={playHoverSound}
        />
      </div>
    </div>
  );
}

export default MainPage;
