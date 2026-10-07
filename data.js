let products = [];

// App State
const state = {
    cart: [],
    wishlist: [],
    user: null,
    currentPage: 'home',
    searchQuery: '',
    filters: {
        category: 'All',
        gender: 'All',
        price: 'All',
        color: 'All'
    },
    checkoutItems: null
};
