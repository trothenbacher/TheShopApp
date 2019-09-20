import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/cart';
import { ADD_ORDER } from '../actions/orders'
import CartItem from '../../models/cart-item';
import { DELETE_PRODUCT } from '../actions/products';

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
                // already have the item in the cart
                updatedOrNewCartItem = new CartItem(
                    state.items[addedProduct.id].quantity + 1,
                    productPrice,
                    productTitle,
                    state.items[addedProduct.id].sum + productPrice
                );
            } else {
                updatedOrNewCartItem = new CartItem(1, productPrice, productTitle, productPrice);
            }
            return {
                ...state,
                items: { ...state.items, [addedProduct.id]: updatedOrNewCartItem },
                totalAmount: state.totalAmount + productPrice
            };
        case REMOVE_FROM_CART:
            const selectedCartItem = state.items[action.pid];
            const currentQty = selectedCartItem.quantity;
            let updateCartItems;
            if (currentQty > 1) {
                // need to reduce it, not to erase it
                const updatedCartItem = new CartItem(
                    selectedCartItem.quantity - 1,
                    selectedCartItem.productPrice,
                    selectedCartItem.productTitle,
                    selectedCartItem.sum - selectedCartItem.productPrice
                );
                updateCartItems = { ...state.items, [action.pid]: updatedCartItem };
            } else {
                updateCartItems = { ...state.items };
                delete updateCartItems[action.pid];
            }
            return {
                ...state,
                items: updateCartItems,
                totalAmount: state.totalAmount - selectedCartItem.productPrice
            };
        case ADD_ORDER:
            return initialState;
        case DELETE_PRODUCT:
            if (!state.items[action.pid]) {
                return state;
            }
            const updatedItems = { ...state.items };
            const itemTotal = state.items[action.pid].sum;
            delete updatedItems[action.pid];
            return {
                ...state,
                items: updatedItems,
                totalAmount: state.totalAmount - itemTotal
            };
    }
    return state;
};