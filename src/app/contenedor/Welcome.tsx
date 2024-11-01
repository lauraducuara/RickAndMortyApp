import fondo01 from "../../assets/images/fondo01.jpg";
import Footer from "./Footer";

export const Welcome = () => {
  return ( 
    <div className="mt-5">
      <div className="d-flex justify-content-center">
        <div className="col-md-10 d-flex align-items-center" style={{ background: "#95f394", borderRadius: "15px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
          <div className="p-4 p-md-5 text-black">
            <h2 className="text-center" style={{ fontFamily: "Arial, sans-serif", fontWeight: "bold", color: "#2c3e50" }}>Bienvenidos a Rick y Morty</h2>
            <p style={{ lineHeight: "1.6", color: "#34495e" }}>
              Rick y Morty (en inglés: Rick and Morty) es una serie de televisión estadounidense de animación para adultos creada por Justin Roiland y Dan Harmon en 2013 para Adult Swim, también se emitió en Cartoon Network. 
              La serie sigue las desventajas de un científico, Rick Sánchez, y su fácilmente influenciable nieto, Morty, quienes pasan el tiempo entre la vida doméstica y los viajes espaciales e intergalácticos. 
              Dan Harmon, el cocreador de la serie y Justin Roiland son los encargados de las voces principales de Morty y Rick, la serie también incluye las voces de Chris Parnell, Spencer Grammer y Sarah Chalke.
            </p>
          </div>
          <img 
            src={fondo01} 
            alt="Rick y Morty" 
            className="img-fluid rounded-3 me-4" 
            style={{ height: "250px", width: "250px", border: "5px solid #2ecc71", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }} 
          />
        </div>
      </div>
      <div className="text-center mt-4">
        <h4 className="text-success">¡Prepárate para una aventura interdimensional!</h4>
      </div>
      <Footer></Footer>
    </div>
  );
};
