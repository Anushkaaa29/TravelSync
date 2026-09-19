import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Destination {
  _id: string;
  title: string;
  location: string;
  imageUrl: string;
  pricePerNight: number;
  description?: string;
}

interface DestinationState {
  destinations: Destination[];
  selectedDestination: Destination | null;
  isLoading: boolean;
}

const initialState: DestinationState = {
  destinations: [],
  selectedDestination: null,
  isLoading: false,
};

const destinationSlice = createSlice({
  name: 'destination',
  initialState,
  reducers: {
    setDestinations: (state, action: PayloadAction<Destination[]>) => {
      state.destinations = action.payload;
    },

    setSelectedDestination: (state, action: PayloadAction<Destination>) => {
      state.selectedDestination = action.payload;
    },

    clearSelectedDestination: state => {
      state.selectedDestination = null;
    },

    setDestinationLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setDestinations,
  setSelectedDestination,
  clearSelectedDestination,
  setDestinationLoading,
} = destinationSlice.actions;

export default destinationSlice.reducer;
