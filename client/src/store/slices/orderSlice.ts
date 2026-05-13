import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderState {
  deviceType: string;
  problem: string;
  contactMethod: string;
}

const initialState: OrderState = {
  deviceType: '',
  problem: '',
  contactMethod: 'в мастерской',
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setDeviceType(state, action: PayloadAction<string>) {
      state.deviceType = action.payload;
    },
    setProblem(state, action: PayloadAction<string>) {
      state.problem = action.payload;
    },
    setContactMethod(state, action: PayloadAction<string>) {
      state.contactMethod = action.payload;
    },
    resetOrder(state) {
      state.deviceType = '';
      state.problem = '';
      state.contactMethod = 'в мастерской';
    },
  },
});

export const { setDeviceType, setProblem, setContactMethod, resetOrder } = orderSlice.actions;
export default orderSlice.reducer;
