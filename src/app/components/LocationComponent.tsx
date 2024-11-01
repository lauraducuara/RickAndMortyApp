import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { APIRickMorty } from "../utilities/domain/apiRickAndMorty";
import { GenericServices } from "../services/genericServices";
import { Location } from "../models/Location";
import { Character } from "../models/Character";
import { db } from "../../firebaseConfig"; 
import { collection, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import styles from "./LocationComponent.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { addLike, removeLike } from "../../favoriteSlice";
import Footer from "../contenedor/Footer";
import CreateMessage from "../utilities/functions/MessageToastify";

export const LocationComponent = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [charactersByLocation, setCharactersByLocation] = useState<Record<number, Character[]>>({});
  const likedLocations = useSelector((state: RootState) => state.likes.likes);
  const dispatch = useDispatch();
  const [lovedLocations, setLovedLocations] = useState<number[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const result = await GenericServices.petitionGet(APIRickMorty.URL + APIRickMorty.LOCATION);
        setLocations(result.results);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  const fetchCharacters = async (residentUrls: string[]) => {
    const characterPromises = residentUrls.slice(0, 3).map((url) => GenericServices.petitionGet(url));
    return await Promise.all(characterPromises);
  };

  useEffect(() => {
    const loadCharacters = async () => {
      const charactersData: Record<number, Character[]> = {};

      for (const location of locations) {
        const characters = await fetchCharacters(location.residents);
        charactersData[location.id] = characters;
      }

      setCharactersByLocation(charactersData);
    };

    if (locations.length > 0) {
      loadCharacters();
    }
  }, [locations]);

  const loadFavorites = async () => {
    const favoritesCollection = collection(db, "favoriteLocations");
    const querySnapshot = await getDocs(favoritesCollection);
    const favoritesIds = querySnapshot.docs.map((doc) => doc.data().locationId as number);
    setLovedLocations(favoritesIds);
  };

  const toggleFavorite = async (locationId: number) => {
    const isFavorited = lovedLocations.includes(locationId);
    if (isFavorited) {
      await deleteDoc(doc(db, "favoriteLocations", locationId.toString()));
      setLovedLocations(lovedLocations.filter((id) => id !== locationId));
      CreateMessage("Eliminado de tus favoritos", "error"); // Mensaje al eliminar de favoritos
    } else {
      await setDoc(doc(db, "favoriteLocations", locationId.toString()), { locationId });
      setLovedLocations([...lovedLocations, locationId]);
      CreateMessage("Añadido a tus favoritos", "success"); // Mensaje al añadir a favoritos
    }
  };

  const handleLikeLocation = (locationId: number) => {
    if (likedLocations.includes(locationId)) {
      dispatch(removeLike(locationId));
    } else {
      dispatch(addLike(locationId));
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <div>
      <div className={`${styles.locationContainer} mt-3`}>
        <h2 className={`${styles.title} text-center`}>Locaciones</h2>
        <div className="row mt-4">
          {locations.map((location) => (
            <div className="col-md-4 mb-4" key={location.id}>
              <div className={`${styles.locationCard} shadow-sm`}>
                <h5 className={`${styles.locationName} text-center`}>{location.name}</h5>
                <p className="text-center"><strong>Tipo:</strong> {location.type}</p>
                <p className="text-center"><strong>Dimensión:</strong> {location.dimension}</p>
                <p className="text-center"><strong>Residentes:</strong></p>
                <ul className="list-unstyled text-center">
                  {charactersByLocation[location.id]?.slice(0, 3).map((character) => (
                    <li key={character.id} className={styles.characterItem}>
                      <img 
                        src={character.image} 
                        alt={character.name} 
                        className={`${styles.characterImage} img-fluid`} 
                      />
                      <p>{character.name}</p>
                    </li>
                  ))}
                </ul>

                <div className="text-center mt-3">
                  <button
                    className={`btn btn-light me-1`}
                    onClick={() => handleLikeLocation(location.id)}
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
                  <Link to={`/location/${location.id}`} className="btn btn-primary mt-1">
                    Ver Detalles
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};
