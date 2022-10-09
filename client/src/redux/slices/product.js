import {createSlice} from '@reduxjs/toolkit';

const slice = createSlice({
    name: 'product',
    initialState: {
        checkout: {
            activeStep: 0,
        }
    },
    reducers: {
        onNextStep(state) {
            state.checkout.activeStep += 1;
        },
    }
});

const {actions, reducer} = slice;
export const {onNextStep} = actions
export default reducer;