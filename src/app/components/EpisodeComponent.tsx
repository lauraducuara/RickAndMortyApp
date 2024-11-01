import { useEffect, useState } from "react";
import { APIRickMorty } from "../utilities/domain/apiRickAndMorty";
import { GenericServices } from "../services/genericServices";
import { Link } from "react-router-dom";
import styles from "./Card.module.css";
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
import CreateMessage from "../utilities/functions/MessageToastify";
import noDisponible from "../../assets/images/noDisponible.png";
import Footer from "../contenedor/Footer";


export const EpisodeComponent = () => {
  /* Declaración de vairbales */
  const [arrayEpisodes, setArrayEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const likedEpisodes = useSelector((state: RootState) => state.likes.likes);
  const [likeStates, setLikeStates] = useState<{ [key: number]: boolean }>(
    () => JSON.parse(localStorage.getItem("likeStates") || "{}") // Recupera el estado inicial desde localStorage
  );
  const [heartStates, setHeartStates] = useState<{ [key: number]: boolean }>(
    {}
  );
  const dispatch = useDispatch();

  /* Obtener episodios */
  const getDataEpisodes = async () => {
    try {
      const urlService = await GenericServices.petitionGet(
        `${APIRickMorty.URL}${APIRickMorty.EPISODE}`
      );
      setArrayEpisodes(urlService.results);
    } catch (error) {
      console.error("Error fetching episodes: ", error);
    } finally {
      setLoading(false);
    }
  };
/* Obtener los episodios favoritos */
  const getFavoriteEpisodes = async () => {
    try {
      const favoritesCollection = collection(db, "favorites");
      const querySnapshot = await getDocs(favoritesCollection);
      const favoritesIds = querySnapshot.docs.map(
        (doc) => doc.data().episodeId
      );
      return favoritesIds;
    } catch (error) {
      console.error("Error fetching favorite episodes: ", error);
      return [];
    }
  };
/* Obtener y cargar los episodios junto con los favoritos. */
  useEffect(() => {
    const fetchEpisodes = async () => {
      await getDataEpisodes();
      const favoritesIds = await getFavoriteEpisodes();

      // Reinicia heartStates
      const newHeartStates: any = {};
      favoritesIds.forEach((id) => {
        newHeartStates[id] = true; // Marca como favorito
      });

      setHeartStates(newHeartStates);
    };

    fetchEpisodes();
  }, [dispatch]);

  /* Mantener un estado sincronizado de los episodios con "like" en la interfaz y en el LocalStorage */
  useEffect(() => {
    // Establece los estados de like solo si ya están en likes
    const newLikeStates: { [key: number]: boolean } = {};
    likedEpisodes.forEach((id) => {
      newLikeStates[id] = true; // Marca como "like" en el estado local
    });
    setLikeStates(newLikeStates);

    // Guarda el estado en localStorage cada vez que cambia
    localStorage.setItem("likeStates", JSON.stringify(newLikeStates));
  }, [likedEpisodes]);

  /* Cambiar el estado de "like" de un episodio cuando el usuario hace clic en él. */
  const handleLike = (episodeId: number) => {
    setLikeStates((prev) => {
      const newLikeStates = {
        ...prev,
        [episodeId]: !prev[episodeId], // Cambia solo el estado del like correspondiente
      };
      localStorage.setItem("likeStates", JSON.stringify(newLikeStates)); // Guarda el nuevo estado en localStorage
      return newLikeStates;
    });

    if (likedEpisodes.includes(episodeId)) {
      dispatch(removeLike(episodeId));
    } else {
      dispatch(addLike(episodeId));
    }
  };
  /* Cambiar el estado de favorito (heart) de un episodio */
  const handleHeartClick = (episodeId: number) => {
    if (heartStates[episodeId]) {
      handleRemoveFromFavorites(episodeId);
      setHeartStates((prev) => ({ ...prev, [episodeId]: false }));
      CreateMessage("Eliminado de tus favoritos", "error");
    } else {
      handleSaveToFavorites(episodeId);
      setHeartStates((prev) => ({ ...prev, [episodeId]: true }));
      CreateMessage("Añadido a tus favoritos", "success");
    }
  };
  /*Agregar o eliminar episodios de la colección "favorites" en Firestore.  */
  const handleSaveToFavorites = async (episodeId: number) => {
    try {
      const favoritesCollection = collection(db, "favorites");
      const q = query(favoritesCollection, where("episodeId", "==", episodeId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await addDoc(favoritesCollection, { episodeId });
      
      } else {
        console.log(`Episode ${episodeId} is already in Firestore.`);
      }
    } catch (error) {
      console.error("Error saving favorite episode to Firestore: ", error);
    }
  };

  const handleRemoveFromFavorites = async (episodeId: number) => {
    try {
      const favoritesCollection = collection(db, "favorites");
      const q = query(favoritesCollection, where("episodeId", "==", episodeId));
      const querySnapshot = await getDocs(q);

      const deletePromises = querySnapshot.docs.map((docSnapshot) =>
        deleteDoc(docSnapshot.ref)
      );
      await Promise.all(deletePromises);
      console.log(`Episode ${episodeId} removed from Firestore.`);
    } catch (error) {
      console.error("Error removing favorite episode from Firestore: ", error);
    }
  };
/* Rebderuza */
  if (loading) {
    return <div>Loading episodes...</div>;
  }

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-center">
        <div className="col-lg-10">
          <div className="d-flex justify-content-center mt-3">
            <h3>Episodios</h3>
          </div>
          <div className="row mt-4">
            {arrayEpisodes.map((episode) => (
              <div className="col-md-4 mb-3" key={episode.id}>
                <div className={`${styles.card} shadow-sm episode-card`}>
                  <div className={`${styles.header} text-white`}>
                    <h5 className="fst-italic">
                      <strong>Episodio:</strong>&nbsp;
                      <span className="fw-normal">{episode.name}</span>
                    </h5>
                  </div>
                  <div className={styles.content}>
                    <p>
                      <strong>Fecha de emisión:</strong> {episode.air_date}
                    </p>
                    <p>
                      <strong>Código de episodio:</strong> {episode.episode}
                    </p>
                    <div className="d-flex">
                      {episode.characters
                        .slice(0, 3)
                        .map((characterUrl, index) => (
                          /* Personajes de los episodios */
                          <CharacterImage
                            key={index}
                            characterUrl={characterUrl}
                          />
                        ))}
                    </div>
                  </div>
                  <div className="text-center mt-3">
                    <div>
                      {/* Botones para Redux */}
                      <button
                        className="btn"
                        onClick={() => handleLike(episode.id)}
                      >
                        <i
                          className={`fa-solid fa-thumbs-up ${
                            likeStates[episode.id] ? "text-success" : ""
                          }`}
                        ></i>
                      </button>
                      {/* Botones para Firestore */}
                      <button
                        className="btn"
                        onClick={() => handleHeartClick(episode.id)}
                      >
                        <i
                          className={`fa-solid fa-heart ${
                            heartStates[episode.id] ? "text-danger" : ""
                          }`}
                        ></i>
                      </button>
                    </div>
                    <div className="mt-3">
                      <Link
                        to={`/episode/${episode.id}`}
                        className="btn btn-info col-10 mb-2"
                      >
                        Ver detalles
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

/* Carga y muestra una imagen de un personaje desde una URL */
const CharacterImage = ({ characterUrl }: { characterUrl: string }) => {
  const [character, setCharacter] = useState<Character | null>(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const result = await GenericServices.petitionGet(characterUrl);
        setCharacter(result);
      } catch (error) {
      }
    };
    fetchCharacter();
  }, [characterUrl]);

  return character ? (
    <img
      src={character.image || noDisponible} 
      className={`${styles.img} img-fluid`}
      onError={(e) => (e.currentTarget.src = noDisponible)} // Carga una img no disponible por si acaso
    />
  ) : null;
};

