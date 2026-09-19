import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Booking {
  _id: string;
  title: string;
  location: string;
  imageUrl: string;
  totalPrice: number;
  guests: number;
  checkInDate: string | Date;
  checkOutDate: string | Date;
  status: string;
}

interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
}

const initialState: BookingState = {
  bookings: [],
  isLoading: false,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookingData: (state, action: PayloadAction<Booking[]>) => {
      state.bookings = action.payload;
    },

    clearBookingData: state => {
      state.bookings = [];
    },
  },
});

export const { setBookingData, clearBookingData } = bookingSlice.actions;
export default bookingSlice.reducer;
