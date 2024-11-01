import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GenericServices } from "../services/genericServices";
import { Character } from "../models/Character";
import { Location } from "../models/Location";
import { APIRickMorty } from "../utilities/domain/apiRickAndMorty";
import styles from "./SpecificLocation.module.css";
import { db } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { RootState } from "../../store";
import { addLike, removeLike } from "../../favoriteSlice";
import Footer from "../contenedor/Footer";
import CreateMessage from "../utilities/functions/MessageToastify";

export const SpecificLocation = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const [location, setLocation] = useState<Location | null>(null);
  const [residents, setResidents] = useState<Character[]>([]);
  const [lovedLocations, setLovedLocations] = useState<number[]>([]);
  const likedLocations = useSelector((state: RootState) => state.likes.likes); // Obtener likes desde Redux
  const dispatch = useDispatch();

  /* Cargar ubicaciones o locaciones favoritas */
  const loadFavorites = async () => {
    const favoritesCollection = collection(db, "favoriteLocations");
    const querySnapshot = await getDocs(favoritesCollection);
    const favoritesIds = querySnapshot.docs.map(
      (doc) => doc.data().locationId as number
    );
    setLovedLocations(favoritesIds);
  };

  /* Alternar el estado de favorito de una ubicación */
  const toggleFavorite = async (locationId: number) => {
    const isFavorited = lovedLocations.includes(locationId);
    if (isFavorited) {
      await deleteDoc(doc(db, "favoriteLocations", locationId.toString()));
      setLovedLocations(lovedLocations.filter((id) => id !== locationId));
      CreateMessage("Eliminado de tus favoritos", "error"); // Mensaje al eliminar de favoritos
    } else {
      await setDoc(doc(db, "favoriteLocations", locationId.toString()), {
        locationId,
      });
      setLovedLocations([...lovedLocations, locationId]);
      CreateMessage("Añadido a tus favoritos", "success"); // Mensaje al añadir a favoritos
    }
  };

  /* Manejar el "me gusta" en ubicaciones */
  const handleLike = (locationId: number) => {
    if (likedLocations.includes(locationId)) {
      dispatch(removeLike(locationId));
    } else {
      dispatch(addLike(locationId));
    }
  };

  /* Cargar la ubicación y residentes */
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const result = await GenericServices.petitionGet(
          `${APIRickMorty.URL}${APIRickMorty.LOCATION}/${locationId}`
        );
        setLocation(result);
        await fetchResidents(result.residents);
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    const fetchResidents = async (residentUrls: string[]) => {
      try {
        const characterPromises = residentUrls.map((url) =>
          GenericServices.petitionGet(url)
        );
        const charactersData = await Promise.all(characterPromises);
        setResidents(charactersData);
      } catch (error) {
        console.error("Error fetching residents:", error);
      }
    };

    fetchLocation();
    loadFavorites();
  }, [locationId]);

  if (!location) return <div>Cargando...</div>;

  return (
    <div className={`${styles.specificLocationContainer}`}>
      <h2 className="text-center">{location.name}</h2>
      <div className="text-center">
        <p><strong>Tipo:</strong> {location.type}</p>
        <p><strong>Dimensión:</strong> {location.dimension}</p>
        <p><strong>Residentes:</strong></p>
        <ul className="list-unstyled">
          {residents.map((resident) => (
            <li key={resident.id} className={styles.residentItem}>
              <img
                src={resident.image}
                alt={resident.name}
                className={`${styles.residentImage} img-fluid`}
              />
              <p>{resident.name}</p>
            </li>
          ))}
        </ul>
        <div className="text-center mt-3">
          <button
            className={`btn btn-light me-1`}
            onClick={() => handleLike(location.id)}
          >
            <i
              className={`fa-solid fa-thumbs-up ${likedLocations.includes(location.id) ? "text-success" : ""}`}
            ></i>
          </button>
          <button
            className={`btn ${lovedLocations.includes(location.id) ? "text-danger" : "btn-light"}`}
            onClick={() => toggleFavorite(location.id)}
          >
            <i className="fa-solid fa-heart"></i>
          </button>
          <Link to="/" className="btn btn-primary mt-1">Regresar</Link>
        </div>
      </div>

      <div className="mt-4">
      <Footer />
      </div>
    </div>
  );
};
