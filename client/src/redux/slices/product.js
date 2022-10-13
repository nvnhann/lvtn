import {createSlice} from '@reduxjs/toolkit';

const slice = createSlice({
    name: 'product',
    initialState: {
        checkout: {
            activeStep: 0,
            totalPrice: 0,
            shipping: 0,
            address: {},
            product: []
        }
    },
    reducers: {
        onNextStep(state) {
            state.checkout.activeStep += 1;
        },
        onBackStep(state) {
            state.checkout.activeStep -= 1;
        },
        onGotoStep(state, action) {
            state.checkout.activeStep = action.payload;
        },
        checkout(state, action) {
            const {totalPrice, shipping} = action.payload;
            state.checkout.totalPrice = totalPrice;
            state.checkout.shipping = shipping;
        },
        chooseAddress(state, action) {
            const {address} = action.payload;
            state.checkout.address = address;
        },
        checkoutProduct(state, action) {
            state.checkout.product = action.payload
        }
    }
});

const {actions, reducer} = slice;
export const {onNextStep, onBackStep, checkout, chooseAddress, onGotoStep, checkoutProduct} = actions
export default reducer;