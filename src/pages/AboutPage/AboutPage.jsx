import React from "react";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import "./AboutPage.css";
import Navbar from "../../components/Navbar/Navbar";
import { gsap } from "gsap";
import selectSound from "../../assets/audio/Select.mp3";
import { useNavigate } from "react-router-dom";
import ComplexityGraph3D from "./ComplexityGraph3D.jsx";

export default function AboutPage(props) {
  const selectAudio = useRef(new Audio(selectSound));
  const playSelectSound = () => {
    selectAudio.current.currentTime = 0;
    selectAudio.current
      .play()
      .catch((e) => console.error("Error al reproducir select:", e));
  };
  const pageRef = useRef(null);
  const navigate = useNavigate();

  const COMPLEJIDAD_ANALISIS = [
    {
      metrica: "Tiempo (Temporal)",
      notacion: "O(N)",
      ordenRelativo: "Lineal",
      enSitu: "No",
    },
    {
      metrica: "Espacio (Espacial)",
      notacion: "O(N)",
      ordenRelativo: "Lineal",
      enSitu: "No",
    },
  ];

  const handleItemClick = (path) => {
    playSelectSound();
    if (pageRef.current) {
      gsap.to(pageRef.current.children, {
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

  useEffect(() => {
    if (pageRef.current) {
      gsap.set(pageRef.current, { opacity: 0, y: 50 });
      gsap.to(pageRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
      });
    }
  }, []);

  return (
    <div className="about-page-wrapper" ref={pageRef}>
      <Navbar handleItemClick={handleItemClick} />
      <div className="complexity-panel">
        <h2 className="panel-title">
          Análisis de Complejidad - Algoritmo de Codificación en Numeros Sin
          repetición
        </h2>

        <div className="graph-container">
          <h3 className="card-title">Gráfica de Complejidad Temporal O(N)</h3>
          <div
            className="graph-placeholder"
            style={{
              height: "300px",
              backgroundColor: "#151515",
              border: "1px solid #00c9ff",
              borderRadius: "8px",
              boxShadow: "0 0 10px rgba(0, 201, 255, 0.5)",
            }}
          >
            <ComplexityGraph3D />
          </div>
          <p className="graph-description">
            La curva verde representa el crecimiento Lineal $O(N)$. El tiempo de
            ejecución (eje Y) es directamente proporcional al número de
            elementos de entrada $N$ (eje X). Y la curva magenta representa el
            crecimiento Cuadrático $O(N^2)$ para comparación.
          </p>
        </div>

        <hr className="complexity-separator" />

        <h3 className="card-title">Tabla de Complejidad Temporal y Espacial</h3>
        <table className="complexity-table">
          <thead>
            <tr>
              <th>Métrica</th>
              <th>Notación Asintótica</th>
              <th>Orden Relativo</th>
              <th>En Situ (In-Place)</th>
            </tr>
          </thead>
          <tbody>
            {COMPLEJIDAD_ANALISIS.map((item) => (
              <tr key={item.metrica}>
                <td>{item.metrica}</td>
                <td>
                  <span className="complexity-notation">{item.notacion}</span>
                </td>
                <td>{item.ordenRelativo}</td>
                <td>{item.enSitu}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr className="complexity-separator" />

        <h3 className="card-title">Explicación Detallada: ¿Por qué $O(N)$?</h3>

        <p className="explanation-text">
          La complejidad $O(N)$ Lineal surge del paso más intensivo del
          algoritmo:
        </p>

        <ol className="explanation-list">
          <li>
            Bucle Principal (Suma de Clave): El paso 2 (`PARA CADA numero EN
            data_array HACER...`) es una iteración única sobre los $N$ elementos
            del array de entrada. Esto define directamente la complejidad a
            $O(N)$.
          </li>
          <li>
            Conversiones de Datos: Las funciones `CONVERTIR_A_CADENA` y
            `CODIFICAR_A_BASE64` también operan en un conjunto de datos cuya
            longitud total es lineal con respecto a $N$. Estas operaciones se
            escalan linealmente con el tamaño de los datos.
          </li>
        </ol>

        <p className="explanation-text">
          ### Complejidad Espacial $O(N)$ El algoritmo no es "en situ"
          (In-Place) porque requiere almacenamiento adicional significativo.
          Específicamente, crea dos estructuras de datos nuevas cuyo tamaño
          depende de la entrada $N$:
        </p>
        <ul className="explanation-list">
          <li>El array `processed_data` (almacena $N$ nuevos números).</li>
          <li>
            La cadena `encoded_result` (almacena la salida Base64, que es lineal
            con respecto a $N$).
          </li>
        </ul>
        <p className="explanation-text">
          Por lo tanto, la complejidad espacial es $O(N)$.
        </p>
      </div>
    </div>
  );
}
