import {createSelector, createSlice} from '@reduxjs/toolkit';

import Cookies from 'js-cookie';

const slice = createSlice({
    name: 'cart',
    initialState: {
        cartItem: Cookies.get('cart') ? JSON.parse(Cookies.get('cart')) : []
    },
    reducers: {
        addToCart(state, action) {
            const newItem = action.payload;
            const index = state.cartItem.findIndex((x) => x.id_sp === newItem.id_sp);
            if (index >= 0) {
                state.cartItem[index].so_luong += newItem.so_luong;
            } else {
                state.cartItem.push(newItem);
            }
            Cookies.set('cart', JSON.stringify(state.cartItem));
        },
        setQuantity(state, action) {
            const {id_sp, so_luong} = action.payload;
            const index = state.cartItem.findIndex((x) => x.id_sp === id_sp);
            if (index >= 0) {
                state.cartItem[index].so_luong = so_luong;
            }
            Cookies.set('cart', JSON.stringify(state.cartItem));
        },
        removeFromCart(state, action) {
            const idRemove = action.payload;
            state.cartItem = state.cartItem.filter((x) => x.id_sp !== idRemove);
            Cookies.set('cart', JSON.stringify(state.cartItem));
        },
    }
});
const {actions, reducer} = slice;
export default reducer;
export const {setQuantity, removeFromCart, addToCart} = actions;

const cartItemSeclector = (state) => state.cart.cartItem;

export const cartItemCount = createSelector(cartItemSeclector, (cartItem) =>
    cartItem.reduce((count, item) => count + item.so_luong, 0)
);

