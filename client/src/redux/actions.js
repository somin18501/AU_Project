import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    token:"",
    search:"",
  },
  reducers: {
    loginUser:(state,val)=>{
      state.token = val.payload.token;
      localStorage.setItem('token',JSON.stringify(val.payload.token));
    },
    logoutUser:(state)=>{
      state.token = "";
      localStorage.removeItem("token");
    },
    checkIfTokenExists:(state)=>{
      let a = localStorage.getItem('token');
      if(a){
        state.token = a.replace(/"|'/g, '');
      }
      else{
        state.token = "";
      }
    },
    changeSearch:(state,val)=>{
      state.search = val.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { loginUser, logoutUser, checkIfTokenExists, changeSearch } = userSlice.actions

export default userSlice.reducer