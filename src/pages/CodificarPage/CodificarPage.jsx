// CodingPage.jsx

import React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Navbar from "../../components/Navbar/Navbar";
import "./CodificarPage.css";
import selectSound from "../../assets/audio/Select.mp3";
import { useState } from "react";
import Dropzone from "../../components/Dropzone/Dropzone";
import ConsoleZone from "../../components/ConsoleZone/ConsoleZone";
import { useMemo } from "react";
import { EncodeFile } from "../../utils/Encoding";
import { useNavigate } from "react-router-dom";

const INPUT_METHOD = {
  NONE: "none",
  FILE: "file",
  CONSOLE: "console",
};

export default function CodificarPage() {
  const [inputMethod, setInputMethod] = useState(INPUT_METHOD.NONE);
  const [fileToEncode, setFileToEncode] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [consoleInput, setConsoleInput] = useState("");
  const [progress, setProgress] = useState(0);
  const pageRef = useRef(null);
  const inputContentRef = useRef(null);
  const inputCardRef = useRef(null);
  const selectAudio = useRef(new Audio(selectSound));
  const navigate = useNavigate();

  const isCodifyButtonEnabled = useMemo(() => {
    if (inputMethod === INPUT_METHOD.FILE) {
      return fileToEncode !== null;
    }
    if (inputMethod === INPUT_METHOD.CONSOLE) {
      return consoleInput.trim().length > 0;
    }
    return false;
  }, [inputMethod, fileToEncode, consoleInput]);

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
// Algoritmo de Codificación (Pseudocódigo)

FUNCIÓN codificar(cadena)
    usados ← conjunto vacío
    partes ← lista vacía
    
    PARA CADA digito EN cadena HACER
        num ← convertir digito a entero
        
        SI num NO ESTÁ EN usados ENTONCES
            agregar string(num) a partes
            agregar num a usados
        SINO
            distancia ← 1
            reemplazo ← nulo
            
            MIENTRAS reemplazo ES nulo HACER
                candidato_izq ← num - distancia
                candidato_der ← num + distancia
                
                SI candidato_izq NO ESTÁ EN usados ENTONCES
                    reemplazo ← candidato_izq
                    dist_usada ← -distancia
                SINO SI candidato_der NO ESTÁ EN usados ENTONCES
                    reemplazo ← candidato_der
                    dist_usada ← distancia
                SINO
                    distancia ← distancia + 1
                FIN SI
            FIN MIENTRAS
            
            agregar "[" + string(reemplazo) + ":d" + string(dist_usada) + "]" a partes
            agregar reemplazo a usados
        FIN SI
    FIN PARA
    
    RETORNAR unir(partes)
FIN FUNCIÓN

  `;

  const getStatusMessage = (currentProgress) => {
    if (currentProgress === 100)
      return "✅ Codificación completa. Descargando archivo...";
    if (currentProgress >= 75) return "Aplicando codificación Base64...";
    if (currentProgress >= 50)
      return "Validando y procesando datos numéricos...";
    if (currentProgress >= 25)
      return "Leyendo contenido del archivo de entrada...";
    return "Iniciando proceso de codificación...";
  };

  useEffect(() => {
    if (inputContentRef.current) {
      gsap.set(inputContentRef.current, { opacity: 0 });

      gsap.to(inputContentRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      });
      // gsap.fromTo(
      //   inputCardRef.current,
      //   { height: "auto" },
      //   {
      //     height: inputCardRef.current.scrollHeight,
      //     duration: 0.5,
      //     ease: "power2.out",
      //   }
      // );
    }
  }, [inputMethod]);

  const handleMethodSelect = (method) => {
    playSelectSound();
    setFileToEncode(null);
    setConsoleInput("");
    if (inputContentRef.current) {
      gsap.to(inputContentRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          setInputMethod(method);
        },
      });
    } else {
      setInputMethod(method);
    }
  };

  const handleFileAccepted = (file) => {
    setFileToEncode(file);
  };

  const renderInputContent = () => {
    switch (inputMethod) {
      case INPUT_METHOD.FILE:
        return (
          <Dropzone
            onFileAccepted={handleFileAccepted}
            file={fileToEncode}
            descripcion="Carga de Archivos (.txt): Por favor, asegúrese de que el archivo cargado
        contenga exclusivamente datos numéricos (separados por comas) para
        garantizar la integridad del proceso de codificación. Sólo se procesa un
        único archivo .txt por ejecución."
          />
        );
      case INPUT_METHOD.CONSOLE:
        return <ConsoleZone value={consoleInput} onChange={setConsoleInput} />;
      case INPUT_METHOD.NONE:
      default:
        return (
          <>
            <p className="card-description">
              ¿Cómo deseas introducir los datos para codificar?
            </p>
            <div className="input-actions">
              <button
                className="action-button secondary-button"
                onClick={() => handleMethodSelect(INPUT_METHOD.FILE)}
              >
                Subir Archivo
              </button>
              <button
                className="action-button secondary-button"
                onClick={() => handleMethodSelect(INPUT_METHOD.CONSOLE)}
              >
                Escribir Array (Consola)
              </button>
            </div>
          </>
        );
    }
  };

  const handleCodify = async () => {
    if (!isCodifyButtonEnabled || isProcessing) return;

    setIsProcessing(true);
    setProgress(10);

    try {
      const inputData =
        inputMethod === INPUT_METHOD.FILE ? fileToEncode : consoleInput;

      const progressCallback = (step) => {
        setProgress(Math.min(100, Math.max(0, step)));
      };

      const result = await EncodeFile(inputData, inputMethod, progressCallback);

      if (result.success) {
        setProgress(100);
        console.log(
          "Codificación exitosa. Archivo descargado:",
          result.filename
        );
      } else {
        setProgress(0);
        alert(`Error de Codificación: ${result.error}`);
      }
    } catch (error) {
      setProgress(0);
      console.error("Error inesperado en handleCodify:", error);
      alert("Ocurrió un error inesperado. Revisa la consola.");
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
      }, 1500);
    }
  };

  return (
    <div className="coding-page-wrapper" ref={pageRef}>
      <Navbar handleItemClick={handleItemClick} />
      <div className="coding-page-content">
        <div className="code-panel">
          <h2 className="panel-title">Algoritmo de Codificación</h2>
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
                : fileToEncode
                ? `Archivo ${fileToEncode.name} listo. Presiona Codificar.`
                : "Preparado para recibir datos."}
            </p>
          </div>

          <div className="input-card" ref={inputCardRef}>
            <h3 className="card-title">Selección de Entrada</h3>
            <div ref={inputContentRef} style={{ overflow: "hidden" }}>
              {renderInputContent()}
            </div>
            {inputMethod !== INPUT_METHOD.NONE && (
              <div className="codify-action-wrapper">
                <button
                  className="action-button primary-button"
                  disabled={!isCodifyButtonEnabled || isProcessing}
                  onClick={handleCodify}
                  style={{
                    opacity: isCodifyButtonEnabled ? 1 : 0.5,
                    cursor: isCodifyButtonEnabled ? "pointer" : "not-allowed",
                  }}
                >
                  {isProcessing ? "Codificando..." : "Codificar"}
                </button>
                <button
                  className="action-button secondary-button"
                  onClick={() => handleMethodSelect(INPUT_METHOD.NONE)}
                >
                  Atrás
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
