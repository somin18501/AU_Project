import { configureStore } from '@reduxjs/toolkit'
import user from "./actions"
export default configureStore({
  reducer: {user},
})