import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { APIRickMorty } from "../utilities/domain/apiRickAndMorty";
import { GenericServices } from "../services/genericServices";
import styles from "./SpecificEpisode.module.css";
import { Episode } from "../models/Episode";
import { Character } from "../models/Character";
import { useDispatch, useSelector } from "react-redux";
import { addLike, removeLike } from "../../favoriteSlice";
import { db } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  deleteDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { RootState } from "../../store";
import noDisponible from "../../assets/images/noDisponible.png";
import Footer from "../contenedor/Footer";
import CreateMessage from "../utilities/functions/MessageToastify";


export const SpecificEpisode = () => {
  const { id } = useParams<{ id: string }>();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const likedEpisodes = useSelector((state: RootState) => state.likes.likes);
  const [heartStates, setHeartStates] = useState<{ [key: number]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    /* Obtener un episodio especifico */
    const fetchEpisode = async () => {
      setLoading(true);
      try {
        const result = await GenericServices.petitionGet(
          `${APIRickMorty.URL}${APIRickMorty.EPISODE}/${id}`
        );
        setEpisode(result);
        const characterData = await getCharacterData(result.characters);
        setCharacters(characterData);

        // Cargar episodios favoritos y establecer el estado inicial del corazón
        const favoritesIds = await getFavoriteEpisodes();
        setHeartStates((prev) => ({
          ...prev,
          [result.id]: favoritesIds.includes(result.id),
        }));
      } catch (error) {
        console.error("Error fetching episode data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisode();
  }, [id]);

  /* Recibe un arreglo de URLs (characterUrls) y, por cada URL, realiza una petición de datos a través de GenericServices.petitionGet  */
  const getCharacterData = async (characterUrls: string[]) => {
    const promises = characterUrls.map((url) => GenericServices.petitionGet(url));
    return Promise.all(promises);
  };
/* Obtener una lista de episodios favoritos desde una colección de Firestore (favorites) */
  const getFavoriteEpisodes = async () => {
    try {
      const favoritesCollection = collection(db, "favorites");
      const querySnapshot = await getDocs(favoritesCollection);
      return querySnapshot.docs.map((doc) => doc.data().episodeId);
    } catch (error) {
      console.error("Error fetching favorite episodes: ", error);
      return [];
    }
  };
/* Comprobar si el episodio (episode) existe. */
  const handleLike = () => {
    if (episode) {
      if (likedEpisodes.includes(episode.id)) {
        dispatch(removeLike(episode.id));
      } else {
        dispatch(addLike(episode.id));
      }
    }
  };
/* Verifica si el episodio existe y si está marcado como favorito */
  const handleHeartClick = () => {
    if (episode) {
      if (heartStates[episode.id]) {
        handleRemoveFromFavorites(episode.id);
        setHeartStates((prev) => ({ ...prev, [episode.id]: false }));
      } else {
        handleSaveToFavorites(episode.id);
        setHeartStates((prev) => ({ ...prev, [episode.id]: true }));
      }
    }
  };

  /* Agrega el episodio a favoritos en la base de datos (favorites en Firestore) con el episodeId */
  const handleSaveToFavorites = async (episodeId: number) => {
    try {
      const favoritesCollection = collection(db, "favorites");
      await addDoc(favoritesCollection, { episodeId });
      CreateMessage("Añadido a tus favoritos", "success");

    } catch (error) {
      console.error("Error saving favorite episode to Firestore: ", error);
    }
  };

  /* Busca el episodio en la colección favorites de Firestore por episodeId. */
  const handleRemoveFromFavorites = async (episodeId: number) => {
    try {
      const favoritesCollection = collection(db, "favorites");
      const q = query(favoritesCollection, where("episodeId", "==", episodeId));
      const querySnapshot = await getDocs(q);

      const deletePromises = querySnapshot.docs.map((docSnapshot) => deleteDoc(docSnapshot.ref));
      await Promise.all(deletePromises);
      CreateMessage("Eliminado de tus favoritos", "error");
    } catch (error) {
      console.error("Error removing favorite episode from Firestore: ", error);
    }
  };

  /* Componente de renderización */
  if (loading) {
    return <div>Loading episode details...</div>;
  }

  if (!episode) {
    return <div>Episode not found.</div>;
  }

  return (
    <div>
    <div className="container mt-5">
      <div className={styles.card}>
        <div className="text-center">
          <h2>{episode.name}</h2>
          <p><strong>Fecha de emisión:</strong> {episode.air_date}</p>
          <p><strong>Código de episofio:</strong> {episode.episode}</p>
        </div>
        <div className="mt-3 d-flex justify-content-end">
          <button className="btn" onClick={handleLike}>
            <i className={`fa-solid fa-thumbs-up ${likedEpisodes.includes(episode.id) ? "text-success" : ""}`}></i>
          </button>
          <button className="btn" onClick={handleHeartClick}>
            <i className={`fa-solid fa-heart ${heartStates[episode.id] ? "text-danger" : ""}`}></i>
          </button>
          
        </div>
        <h4>Personajes:</h4>
        <div className={styles.characterGrid}>
          {characters.map((character) => (
            <div key={character.id} className={styles.characterCard}>
              <Link to={`/characters/${character.id}`}>
                <img
                  src={character.image}
                  alt={character.name}
                  className={styles.characterImage}
                />
              </Link>
              <p className={styles.characterName}>{character.name}</p>
            </div>
          ))}
        </div>
        <div className="mt-3">
          
          <Link to="/episode" className="btn btn-secondary ms-2">Regresar a episodios</Link>
        </div>
      </div>
    </div>
      <div className="d-flex justify-content-center">
      <Footer></Footer>
      </div>
      </div>
  );
};
