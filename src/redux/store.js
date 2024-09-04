import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slides/couterSlide'
import userReducer from './slides/userSlide'

export default configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer
  }
})