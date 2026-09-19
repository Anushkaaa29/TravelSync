import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TripState {
  destination: string[];
}

const initialState: TripState = {
  destination: [],
};

const TripSlice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    addDestination: (state, action: PayloadAction<string>) => {
      state.destination.push(action.payload);
    },
    removeDestination: (state, action: PayloadAction<string>) => {
      state.destination = state.destination.filter(
        dest => dest !== action.payload,
      );
    },
  },
});

export const { addDestination, removeDestination } = TripSlice.actions;
export default TripSlice.actions;
