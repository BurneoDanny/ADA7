import { useDropzone } from "react-dropzone";
import { useMemo } from "react";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px 30px",
  borderWidth: 3,
  borderRadius: 15,
  borderColor: "#4caf50",
  borderStyle: "dashed",
  backgroundColor: "#1e1e1e",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out, background-color .24s ease-in-out",
  cursor: "pointer",
  minHeight: "200px",
};

const focusedStyle = {
  borderColor: "#00b4ff",
  backgroundColor: "#252526",
};

const acceptStyle = {
  borderColor: "#4caf50",
  backgroundColor: "rgba(76, 175, 80, 0.1)",
};

const rejectStyle = {
  borderColor: "#f44336",
  backgroundColor: "rgba(244, 67, 54, 0.1)",
};

export default function FileDropzone(props) {
  const { onFileAccepted, file, descripcion } = props;
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    isDragActive,
  } = useDropzone({
    accept: {
      "text/plain": [".txt"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0]);
      }
    },
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
      ...(isDragActive && !isDragAccept && !isDragReject ? focusedStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject, isDragActive]
  );

  return (
    <>
      <p className="card-description instruction-text">{descripcion}</p>

      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />

        <div className="drop-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>

        {file ? (
          <p className="drop-text" style={{ color: acceptStyle.borderColor }}>
            ✅ Archivo Cargado: **{file.name}**
          </p>
        ) : isDragReject ? (
          <p className="drop-text" style={{ color: rejectStyle.borderColor }}>
            ❌ Archivo inválido. Solo se acepta .txt.
          </p>
        ) : isDragActive ? (
          <p className="drop-text" style={{ color: acceptStyle.borderColor }}>
            ✅ ¡Suelta el archivo aquí!
          </p>
        ) : (
          <p className="drop-text" style={{ color: baseStyle.color }}>
            Haz clic para seleccionar o arrastra un archivo
          </p>
        )}

        <p className="drop-subtext">Solo archivos con extensión .txt</p>
      </div>
    </>
  );
}
