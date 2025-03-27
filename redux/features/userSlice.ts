import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UserProfile {
  id: string
  name: string
  avatar: string
}

interface UserState {
  profiles: UserProfile[]
  selectedProfile: UserProfile | null
  loading: boolean
}

const initialState: UserState = {
  profiles: [],
  selectedProfile: null,
  loading: false,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfiles: (state, action: PayloadAction<UserProfile[]>) => {
      state.profiles = action.payload
    },
    selectProfile: (state, action: PayloadAction<UserProfile>) => {
      state.selectedProfile = action.payload
    },
    addProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profiles.push(action.payload)
    },
    updateProfile: (state, action: PayloadAction<UserProfile>) => {
      const index = state.profiles.findIndex((profile) => profile.id === action.payload.id)
      if (index !== -1) {
        state.profiles[index] = action.payload
      }
    },
    removeProfile: (state, action: PayloadAction<string>) => {
      state.profiles = state.profiles.filter((profile) => profile.id !== action.payload)
      if (state.selectedProfile?.id === action.payload) {
        state.selectedProfile = null
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setProfiles, selectProfile, addProfile, updateProfile, removeProfile, setLoading } = userSlice.actions

export default userSlice.reducer

