import { createSlice } from '@reduxjs/toolkit';

export const counterSlice = createSlice({
  name: 'themeUI',
  initialState: {
    theme: 'light', 
  },
  reducers: {
    lightHandle: (state) => {
      state.theme = 'light';
    },
    darkHandle: (state) => {
      state.theme = 'dark';
    },
    setThemeFromContext: (state, action) => {
      state.theme = action.payload;
    },
  },
});

// Action creators
export const { lightHandle, darkHandle, setThemeFromContext } = counterSlice.actions;

export default counterSlice.reducer;
