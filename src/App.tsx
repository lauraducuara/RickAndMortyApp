import { BrowserRouter, Route } from "react-router-dom";
import "./App.css";
import { Suspense } from "react";
import { Routeo } from "./app/routes/Routeo";
import { ToastContainer } from "react-toastify";
import { Header } from "./app/contenedor/Header";

/* Elemento para cargar componentes */
const charge =(
  <div className="d-flex justify-content-center mt-5 ">
    <button className="btn btn-primary" disabled>
      <span
        className="spinner-grow spinner-grow-sm"
        role="status"
        aria-hidden="true" ></span>
      Cargando...
    </button>
  </div>
);
function App() {
  return (
    <div>
      <BrowserRouter>
      <Suspense fallback= {charge}>
        <ToastContainer/>
        <Header/>
        <Routeo/> 
      </Suspense>
     </BrowserRouter> 
    </div>
  );
}

export default App;
