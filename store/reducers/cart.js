import { ADD_TO_CART } from '../actions/cart';
import CartItem from '../../models/cart-item';

const initialState = {
    items: {},
    totalAmount: 0
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const addedProduct = action.product;
            const productPrice = addedProduct.price;
            const productTitle = addedProduct.title;

            let updatedOrNewCartItem;
            if (state.items[addedProduct.id]) {
                //already have the item in the cart
                updatedOrNewCartItem = new CartItem(
                    state.items[addedProduct.id].quantity + 1,
                    productPrice,
                    productTitle,
                    state.items[addedProduct.id].quantity + productPrice
                );
            } else {
                updatedOrNewCartItem = new CartItem(1, productPrice, productTitle, productPrice);
            }
            return {
                ...state,
                items: { ...state.items, [addedProduct.id]: updatedOrNewCartItem },
                totalAmount: state.totalAmount + productPrice
            };
    }
    return state;
};