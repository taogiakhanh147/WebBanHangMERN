import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slides/couterSlide'

export default configureStore({
  reducer: {
    counter: counterReducer
  }
})