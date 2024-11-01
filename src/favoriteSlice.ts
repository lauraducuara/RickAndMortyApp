import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import CreateMessage from './app/utilities/functions/MessageToastify';

interface LikesState {
  likes: number[];
}

const initialState: LikesState = {
  likes: [],
};

const likesSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {
    addLike(state, action: PayloadAction<number>) {
      if (!state.likes.includes(action.payload)) {
        state.likes.push(action.payload);
        CreateMessage("Añadido a tus preferencias", "success");

      }
    },
    removeLike(state, action: PayloadAction<number>) {
      
      state.likes = state.likes.filter((id) => id !== action.payload);

    },
  },
});

export const { addLike, removeLike } = likesSlice.actions;
export default likesSlice.reducer;