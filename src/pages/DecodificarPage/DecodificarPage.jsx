// DecodificarPage.jsx

import React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Navbar from "../../components/Navbar/Navbar";
import "../CodificarPage/CodificarPage.css";
import selectSound from "../../assets/audio/Select.mp3";
import { useState } from "react";
import Dropzone from "../../components/Dropzone/Dropzone";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DecodeFile } from "../../utils/Decode";
// import { DecodeFile } from "../../utils/Decoding"; // crear!!!

const INPUT_METHOD = {
  FILE: "file",
};

export default function DecodificarPage() {
  const inputMethod = INPUT_METHOD.FILE;
  const [fileToDecode, setFileToDecode] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const pageRef = useRef(null);
  const inputContentRef = useRef(null);
  const selectAudio = useRef(new Audio(selectSound));
  const navigate = useNavigate();

  const isDecodeButtonEnabled = useMemo(() => {
    return fileToDecode !== null;
  }, [fileToDecode]);

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

  const playSelectSound = () => {
    selectAudio.current.currentTime = 0;
    selectAudio.current
      .play()
      .catch((e) => console.error("Error al reproducir select:", e));
  };

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

  const randomCode = `
// Algoritmo de Decodificación (Pseudocódigo)
FUNCIÓN decodificar(codigo_str)
    resultado ← lista vacía
    i ← 0
    
    MIENTRAS i < longitud(codigo_str) HACER
        SI codigo_str[i] = '[' ENTONCES
            cierre ← encontrar posición de ']' desde i
            contenido ← subcadena de codigo_str desde i+1 hasta cierre
            
            separar contenido por ':d' en partes
            valor ← convertir partes[0] a entero
            distancia ← convertir partes[1] a entero
            
            original ← valor - distancia
            agregar string(original) a resultado
            
            i ← cierre + 1
            
        SINO SI codigo_str[i] es dígito O (codigo_str[i] = '-' Y siguiente es dígito) ENTONCES
            num_str ← ""
            
            MIENTRAS i < longitud(codigo_str) Y (codigo_str[i] es dígito O codigo_str[i] = '-') HACER
                num_str ← num_str + codigo_str[i]
                i ← i + 1
            FIN MIENTRAS
            
            agregar num_str a resultado
            
        SINO
            i ← i + 1
        FIN SI
    FIN MIENTRAS
    
    RETORNAR unir(resultado)
FIN FUNCIÓN
  `;

  const getStatusMessage = (currentProgress) => {
    if (currentProgress === 100)
      return "✅ Descodificación completa. Descargando archivo...";
    if (currentProgress >= 75) return "Aplicando descodificación Base64...";
    if (currentProgress >= 50)
      return "Validando y procesando datos codificados...";
    if (currentProgress >= 25)
      return "Leyendo contenido del archivo de entrada...";
    return "Iniciando proceso de descodificación...";
  };

  // Manejador de archivo aceptado por Dropzone
  const handleFileAccepted = (file) => {
    setFileToDecode(file);
  };

  const handleDecode = async () => {
    if (!isDecodeButtonEnabled || isProcessing) return;

    setIsProcessing(true);
    setProgress(10);

    try {
      const inputData = fileToDecode;

      const progressCallback = (step) => {
        setProgress(Math.min(100, Math.max(0, step)));
      };

      const result = await DecodeFile(inputData, progressCallback);

      if (result.success) {
        setProgress(100);
        console.log(
          "Descodificación exitosa. Archivo descargado:",
          result.filename
        );
      } else {
        setProgress(0);
        alert(`Error de Decodificación: ${result.error}`);
      }
    } catch (error) {
      setProgress(0);
      console.error("Error inesperado en handleDecode:", error);
      alert("Ocurrió un error inesperado. Revisa la consola.");
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
        setFileToDecode(null);
      }, 1500);
    }
  };

  return (
    <div className="coding-page-wrapper" ref={pageRef}>
      <Navbar handleItemClick={handleItemClick} />
      <div className="coding-page-content">
        <div className="code-panel">
          <h2 className="panel-title">Algoritmo de Descodificación</h2>
          <div className="code-editor-area">
            <pre className="code-display">{randomCode}</pre>
          </div>
        </div>

        <div className="control-panel">
          <div className="progress-card">
            <h3 className="card-title">Progreso de la Ejecución</h3>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${progress}%` }}
              >
                {progress}%
              </div>
            </div>
            <p className="progress-status">
              {isProcessing
                ? getStatusMessage(progress)
                : fileToDecode
                ? `Archivo ${fileToDecode.name} listo. Presiona Decodificar.`
                : "Esperando archivo de datos codificados."}
            </p>
          </div>

          <div className="input-card" ref={inputContentRef}>
            <h3 className="card-title">Selección de Entrada</h3>
            <div style={{ overflow: "hidden" }}>
              <Dropzone
                onFileAccepted={handleFileAccepted}
                file={fileToDecode}
                descripcion="Carga el archivo (.txt) que contiene los datos codificados. Solo se procesa un único archivo .txt por ejecución."
              />
            </div>
            <div className="codify-action-wrapper">
              <button
                className="action-button primary-button"
                disabled={!isDecodeButtonEnabled || isProcessing}
                onClick={handleDecode}
                style={{
                  opacity: isDecodeButtonEnabled ? 1 : 0.5,
                  cursor: isDecodeButtonEnabled ? "pointer" : "not-allowed",
                  flexGrow: 4,
                }}
              >
                {isProcessing ? "Decodificando..." : "Decodificar"}
              </button>
              <button
                className="action-button secondary-button"
                onClick={() => navigate("/")}
                style={{ flexGrow: 1 }}
              >
                Menú Principal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
