import { createSlice } from '@reduxjs/toolkit';

const initialPlayerState = {
  name: '',
  code: '',
  gameType: '',
  soundVolume: 0.5,
  musicVolume: 0.5,
  socket: null,
  gameData: null,
};

const playerSlice = createSlice({
  name: 'player',
  initialState: initialPlayerState,
  reducers: {
    nameSet: (state, action) => {
      state.name = action.payload;
    },
    soundVolumeSet: (state, action) => {
      state.soundVolume = action.payload;
    },
    musicVolumeSet: (state, action) => {
      state.musicVolume = action.payload;
    },
    gameTypeSet: (state, action) => {
      state.gameType = action.payload;
    },
    codeSet: (state, action) => {
      state.code = action.payload;
    },
    socketSet: (state, action) => {
      state.socket = action.payload;
    },
    gameData: (state, action) => {
      state.gameData = action.payload;
    },
  },
});

export default playerSlice.reducer;
export const {
  nameSet,
  soundVolumeSet,
  musicVolumeSet,
  gameTypeSet,
  codeSet,
  socketSet,
  gameData,
} = playerSlice.actions;
