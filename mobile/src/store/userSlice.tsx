import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  imageUri: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },

    clearUserData: () => initialState,
  },
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;
