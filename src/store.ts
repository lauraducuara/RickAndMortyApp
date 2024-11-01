import { configureStore } from '@reduxjs/toolkit';
import likesReducer from './favoriteSlice'; // Cambia la ruta según corresponda

const store = configureStore({
  reducer: {
    likes: likesReducer,
    // otros reducers aquí si es necesario
  },
});

export type RootState = ReturnType<typeof store.getState>; // Para TypeScript
export default store;
