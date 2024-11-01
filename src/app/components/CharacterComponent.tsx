import { useEffect, useState } from "react";
import { GenericServices } from "../services/genericServices";
import { Link } from "react-router-dom";
import { db } from "../../firebaseConfig";
import { collection, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import styles from "./Character.module.css";
import { Character } from "../models/Character";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { addLike, removeLike } from "../../favoriteSlice";
import { APIRickMorty } from "../utilities/domain/apiRickAndMorty";
import Footer from "../contenedor/Footer";
import CreateMessage from "../utilities/functions/MessageToastify";

export const CharacterComponent = () => {
  const [arrayCharacters, setArrayCharacters] = useState<Character[]>([]);
  const likedCharacters = useSelector((state: RootState) => state.likes.likes);
  const [favoriteCharacters, setFavoriteCharacters] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  /* Obtener personajes */
  const getDataCharacters = async () => {
    const urlService = await GenericServices.petitionGet(
      `${APIRickMorty.URL}${APIRickMorty.CHARACTER}`
    );
    setArrayCharacters(urlService.results);
    setLoading(false);
  };

  /* Cargar personajes favoritos */
  const loadFavorites = async () => {
    const favoritesCollection = collection(db, "favoriteCharacters");
    const querySnapshot = await getDocs(favoritesCollection);
    const favoritesIds = querySnapshot.docs.map((doc) => doc.data().characterId as number);
    setFavoriteCharacters(favoritesIds);
  };

  /* Alternar el estado de favorito de un personaje basado en su characterId. */
  const toggleFavorite = async (characterId: number) => {
    const isFavorited = favoriteCharacters.includes(characterId);
    if (isFavorited) {
      await deleteDoc(doc(db, "favoriteCharacters", characterId.toString()));
      setFavoriteCharacters(favoriteCharacters.filter((id) => id !== characterId));
      CreateMessage("Eliminado de tus favoritos", "error"); // Mensaje al eliminar de favoritos
    } else {
      await setDoc(doc(db, "favoriteCharacters", characterId.toString()), { characterId });
      setFavoriteCharacters([...favoriteCharacters, characterId]);
      CreateMessage("Añadido a tus favoritos", "success"); // Mensaje al añadir a favoritos
    }
  };

  /* Manejar la lógica de "like" para un personaje basado en su characterId. */
  const handleLike = (characterId: number) => {
    if (likedCharacters.includes(characterId)) {
      dispatch(removeLike(characterId));
    } else {
      dispatch(addLike(characterId));
    }
  };

  /* Ejecuta funciones cuando el componente se monta. */
  useEffect(() => {
    getDataCharacters();
    loadFavorites();
  }, []);

  /* Renderizacion */
  if (loading) {
    return <div>Cargando personajes...</div>;
  }

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-center">
        <div className="col-lg-10">
          <h3 className="text-center mt-3">Personajes</h3>
          <div className="row mt-4">
            {arrayCharacters.map((character) => (
              <div className="col-md-4 mb-3" key={character.id}>
                <div className={`${styles.card} shadow-sm character-card`}>
                  <img src={character.image} alt={character.name} className={`${styles.characterImage} img-fluid`} />
                  <div className={styles.content}>
                    <h5 className="text-center">{character.name}</h5>
                    <p><strong>Especie:</strong> {character.species}</p>
                    <p><strong>Estado:</strong> {character.status}</p>
                    <div className="text-center mt-3">
                      {/* Botón para render */}
                      <button 
                        className="btn btn-light me-2" 
                        onClick={() => handleLike(character.id)}
                      >
                        <i className={`fa-solid fa-thumbs-up ${likedCharacters.includes(character.id) ? 'text-success' : ''}`}></i>
                      </button>
                      {/* Botón para firebase */}
                      <button 
                        className={`btn ${favoriteCharacters.includes(character.id) ? 'text-danger' : 'btn-light'}`} 
                        onClick={() => toggleFavorite(character.id)}
                      >
                        <i className="fa-solid fa-heart"></i>
                      </button>
                    </div>
                    <Link to={`/characters/${character.id}`} className="btn btn-info col-10 mt-3">
                      Ver detalles
                    </Link>
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
