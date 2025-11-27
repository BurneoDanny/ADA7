import { Routes, Route } from "react-router-dom";
import "./App.css";
import MainPage from "./MainPage/MainPage";
import CodificarPage from "./CodificarPage/CodificarPage";
import DecodificarPage from "./DecodificarPage/DecodificarPage";
import AboutPage from "./AboutPage/AboutPage";

function App() {
  const CODIFICAR_PATH = "/codificar";
  const DECODIFICAR_PATH = "/decodificar";
  const PROYECTO_PATH = "/sobre-el-proyecto";

  return (
    <div id="App">
      <Routes>
        {/* Ruta base: Muestra el menú inicial */}
        <Route path="/" element={<MainPage />} />

        {/* Rutas para los componentes de página */}
        <Route path={CODIFICAR_PATH} element={<CodificarPage />} />
        <Route path={DECODIFICAR_PATH} element={<DecodificarPage />} />
        <Route path={PROYECTO_PATH} element={<AboutPage />} />

        <Route
          path="*"
          element={<h1 style={{ color: "white" }}>404 | Ruta no encontrada</h1>}
        />
      </Routes>
    </div>
  );
}

export default App;
