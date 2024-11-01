import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./SpecificCharacter.module.css";
import { Episode } from "../models/Episode";
import { Character } from "../models/Character";
import { GenericServices } from "../services/genericServices";
import { db } from "../../firebaseConfig";
import { collection, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import { RootState } from "../../store";
import { addLike, removeLike } from "../../favoriteSlice";
import { APIRickMorty } from "../utilities/domain/apiRickAndMorty";
import Footer from "../contenedor/Footer";
import CreateMessage from "../utilities/functions/MessageToastify";

export const SpecificCharacter = () => {
  /* Declaración de variables */
  const { id } = useParams<{ id: string }>();
  const [character, setCharacter] = useState<Character | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [favoriteCharacters, setFavoriteCharacters] = useState<number[]>([]);
  const likedCharacters = useSelector((state: RootState) => state.likes.likes);
  const dispatch = useDispatch();

  /* Cargar episodios favoritos */
  const loadFavorites = async () => {
    const favoritesCollection = collection(db, "favoriteCharacters");
    const querySnapshot = await getDocs(favoritesCollection);
    const favoritesIds = querySnapshot.docs.map((doc) => doc.data().characterId as number);
    setFavoriteCharacters(favoritesIds);
  };

  /* Alternar el estado de favorito para un personaje en la base de datos y en el estado de la aplicación. */
  const toggleFavorite = async (characterId: number) => {
    const isFavorited = favoriteCharacters.includes(characterId);
    if (isFavorited) {
      await deleteDoc(doc(db, "favoriteCharacters", characterId.toString()));
      setFavoriteCharacters(favoriteCharacters.filter((id) => id !== characterId));
      CreateMessage("Eliminado de tus favoritos", "error"); // Mensaje de éxito al eliminar
    } else {
      await setDoc(doc(db, "favoriteCharacters", characterId.toString()), { characterId });
      setFavoriteCharacters([...favoriteCharacters, characterId]);
      CreateMessage("Añadido a tus favoritos", "success"); // Mensaje de éxito al añadir
    }
  };

  /* Alterar el estado del like del personaje */
  const handleLike = (characterId: number) => {
    if (likedCharacters.includes(characterId)) {
      dispatch(removeLike(characterId));
    } else {
      dispatch(addLike(characterId));
    }
  };

  /* Cargar los datos del personaje y de sus episodios cuando se monta el componente o cuando cambia el Id */
  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const characterResult = await GenericServices.petitionGet(
          `${APIRickMorty.URL}${APIRickMorty.CHARACTER}/${id}`
        );
        setCharacter(characterResult);
        
        // Aquí necesitas obtener los datos del episodio uno por uno
        const episodeDataPromises = characterResult.episode.map(async (episodeUrl: any) => {
          const episodeId = episodeUrl.split('/').pop(); // Extraer el ID de la URL
          return await getEpisodeData(episodeId); // Ahora llamamos a getEpisodeData con el ID
        });

        const episodeData = await Promise.all(episodeDataPromises);
        setEpisodes(episodeData);
      } catch (error) {
        console.error("Error fetching character data:", error);
      }
    };
    fetchCharacter();
    loadFavorites();
  }, [id]);

  /* Obtiene un episodio */
  const getEpisodeData = async (episodeId: number) => {
    try {
      const result = await GenericServices.petitionGet(
        `${APIRickMorty.URL}${APIRickMorty.EPISODE}/${episodeId}`
      );
      return result;
    } catch (error) {
      console.error("Error fetching episode data:", error);
      return null; // O puedes devolver un objeto vacío si prefieres
    }
  };

  /* Renderizador */
  if (!character) return <div>Cargando...</div>;

  return (
    <div>
      <div className={`${styles.characterContainer} mt-3`}>
        <h2 className={`${styles.title} text-center`}>{character.name}</h2>
        <div className="d-flex align-items-start">
          <img src={character.image} alt={character.name} className="img-fluid" />
          <div className="ms-3">
            <p><strong>Especie:</strong> {character.species}</p>
            <p><strong>Estado:</strong> {character.status}</p>
            {/* Boton que actua con Render */}
            <button 
              className="btn" 
              onClick={() => handleLike(character.id)}
            >
              <i className={`fa-solid fa-thumbs-up ${likedCharacters.includes(character.id) ? "text-success" : ""}`}></i>
            </button>
            {/* Botón que actua con Firebase */}
            <button 
              className={`btn ${favoriteCharacters.includes(character.id) ? 'text-danger' : 'btn-light'}`} 
              onClick={() => toggleFavorite(character.id)}
            >
              <i className="fa-solid fa-heart"></i>
            </button>
          </div>
        </div>
        {/* Mostrar episodios */}
        <h3 className={`${styles.episodesTitle} mt-4`}>Episodios</h3>
        <div className="row">
          {episodes.map((episode) => (
            <div className="col-md-4 mb-3" key={episode.id}>
              <div className={styles.episodeCard}>
                <h5>{episode.name}</h5>
                <p><strong>Fecha de emisión:</strong> {episode.air_date}</p>
                <p><strong>Código de episodio:</strong> {episode.episode}</p>
                {/* Ver detalles del episodio */}
                <Link to={`/episode/${episode.id}`} className="btn btn-info ms-2">
                  Ver detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <Link to="/characters" className="btn btn-secondary ms-2">Volver a Personajes</Link>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};
