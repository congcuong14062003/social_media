import { configureStore } from '@reduxjs/toolkit'
import themeReducer from '../Reducer/reducer'
export default configureStore({
  reducer: {
    themeUI: themeReducer,
  },
})