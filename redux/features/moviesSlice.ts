import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Movie } from "@/types"

interface MoviesState {
  featured: Movie | null
  myList: Movie[]
  loading: boolean
}

const initialState: MoviesState = {
  featured: null,
  myList: [],
  loading: false,
}

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    setFeatured: (state, action: PayloadAction<Movie>) => {
      state.featured = action.payload
    },
    addToMyList: (state, action: PayloadAction<Movie>) => {
      if (!state.myList.some((movie) => movie.id === action.payload.id)) {
        state.myList.push(action.payload)
      }
    },
    removeFromMyList: (state, action: PayloadAction<number>) => {
      state.myList = state.myList.filter((movie) => movie.id !== action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setFeatured, addToMyList, removeFromMyList, setLoading } = moviesSlice.actions
export default moviesSlice.reducer

