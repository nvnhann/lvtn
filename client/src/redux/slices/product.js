import {createSlice} from '@reduxjs/toolkit';

const slice = createSlice({
    name: 'product',
    initialState: {
        checkout: {
            activeStep: 0,
            totalPrice: 0,
            shipping: 0,
            address: {}
        }
    },
    reducers: {
        onNextStep(state) {
            state.checkout.activeStep += 1;
        },
        onBackStep(state) {
            state.checkout.activeStep -= 1;
        },
        checkout(state, action) {
            const {totalPrice, shipping} = action.payload;
            state.checkout.totalPrice = totalPrice;
            state.checkout.shipping = shipping;
        },
        chooseAddress(state, action) {
            const {address} = action.payload;
            state.checkout.address = address;
        }
    }
});

const {actions, reducer} = slice;
export const {onNextStep, onBackStep, checkout, chooseAddress} = actions
export default reducer;