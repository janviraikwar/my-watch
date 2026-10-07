// Admin Route Interceptor (Client-side fallback for server rewrites)
if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('.html')) {
    sessionStorage.setItem('admin_intended_path', window.location.pathname);
    window.location.href = '/admin/index.html';
    throw new Error('Admin Route Intercepted - Redirecting to real file');
}

// App State (formerly data.js - merged here so both are in the same ES module scope)
let products = [];

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

// Pages Rendering Logic
function renderPage() {
    const main = document.getElementById('main-content');
    main.innerHTML = '';
    window.scrollTo(0,0);

    switch(state.currentPage) {
        case 'home':
            main.innerHTML = renderHome();
            break;
        case 'shop':
            main.innerHTML = renderShop();
            break;
        case 'cart':
            main.innerHTML = renderCart();
            break;
        case 'wishlist':
            main.innerHTML = renderWishlist();
            break;
        case 'login':
            main.innerHTML = renderLogin();
            break;
        case 'register':
            main.innerHTML = renderRegister();
            break;
        case 'checkout':
            main.innerHTML = renderCheckout();
            break;
        case 'order-success':
            main.innerHTML = renderOrderSuccess();
            break;
        case 'my-orders':
            main.innerHTML = renderMyOrders();
            break;
        case 'dashboard':
            main.innerHTML = renderDashboard();
            break;
        case 'product':
            main.innerHTML = renderProductDetails();
            break;
        default:
            main.innerHTML = renderHome();
    }
    updateNav();
}

function renderHome() {
    return `
        <section class="hero">
            <div class="hero-content">
                <h1 class="title-xl">Time, Designed for You.</h1>
                <p>Discover our exclusive collection of premium luxury timepieces. Crafted with precision, elegance, and perfection.</p>
                <div class="hero-btns">
                    <button class="btn-primary" onclick="navigate('shop')">Shop Now</button>
                    <button class="btn-outline" onclick="navigate('shop')">Explore Collection</button>
                </div>
            </div>
        </section>
        
        <section class="section">
            <div class="page-container">
                <div class="section-header">
                    <h2 class="title-lg">Featured Masterpieces</h2>
                </div>
                <div class="grid">
                    ${products.slice(0, 3).map(p => productCardHTML(p)).join('')}
                </div>
            </div>
        </section>
    `;
}

function renderShop() {
    return `
        <section class="section">
            <div class="page-container shop-layout">
                <aside class="filters-sidebar">
                    <div class="filter-group">
                        <h4>Category</h4>
                        <label><input type="radio" name="cat" checked> All</label>
                        <label><input type="radio" name="cat"> Men's</label>
                        <label><input type="radio" name="cat"> Women's</label>
                    </div>
                    <div class="filter-group">
                        <h4>Price</h4>
                        <label><input type="radio" name="price" checked> All</label>
                        <label><input type="radio" name="price"> Under ₹25,000</label>
                        <label><input type="radio" name="price"> ₹25,000+</label>
                    </div>
                </aside>
                <div class="shop-content">
                    <div class="section-header" style="text-align: left; margin-bottom: 20px; display:flex; justify-content:space-between;">
                        <h2 class="title-md">Collection</h2>
                        <select style="background:var(--card-bg); color:white; border:1px solid var(--border-color); padding:5px;">
                            <option>Sort: Newest</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                        </select>
                    </div>
                    <div class="grid">
                        ${products.map(p => productCardHTML(p)).join('')}
                    </div>
                </div>
            </div>
        </section>
    `;
}

function renderCart() {
    if (state.cart.length === 0) {
        return `
            <section class="section page-container" style="text-align:center; padding-top:100px;">
                <h2 class="title-lg">Your Cart is Empty</h2>
                <p style="margin:20px 0; color:var(--text-muted);">Explore our collection to find your perfect timepiece.</p>
                <button class="btn-primary" onclick="navigate('shop')">Continue Shopping</button>
            </section>
        `;
    }
    
    const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return `
        <section class="section page-container">
            <h2 class="title-lg" style="margin-bottom:30px;">Shopping Cart</h2>
            <div class="shop-layout">
                <div>
                    ${state.cart.map(item => `
                        <div style="display:flex; gap:20px; background:var(--card-bg); padding:20px; margin-bottom:15px; border:1px solid var(--border-color);">
                            <img src="${item.image}" style="width:100px; height:100px; object-fit:cover;">
                            <div>
                                <h4 style="font-size:1.2rem;">${item.name}</h4>
                                <p style="color:var(--gold); margin:5px 0;">₹${item.price.toLocaleString('en-IN')}</p>
                                <p>Qty: ${item.quantity}</p>
                                <button style="color:#ff4444; margin-top:10px;" onclick="removeFromCart('${item.id}')">Remove</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div style="background:var(--card-bg); padding:30px; border:1px solid var(--border-color); height:fit-content;">
                    <h3 style="margin-bottom:20px;">Order Summary</h3>
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                        <span>Subtotal</span>
                        <span>₹${total.toLocaleString('en-IN')}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:20px;">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                    <hr style="border-color:var(--border-color); margin-bottom:20px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:30px; font-size:1.2rem; color:var(--gold);">
                        <span>Total</span>
                        <span>₹${total.toLocaleString('en-IN')}</span>
                    </div>
                    <button class="btn-primary" style="width:100%;" onclick="alert('Checkout process initiated!')">Proceed to Checkout</button>
                </div>
            </div>
        </section>
    `;
}

function renderWishlist() {
    if (state.wishlist.length === 0) {
        return `
            <section class="section page-container" style="text-align:center; padding-top:100px;">
                <h2 class="title-lg">Your Wishlist is Empty</h2>
                <p style="margin:20px 0; color:var(--text-muted);">Save items you love here.</p>
                <button class="btn-primary" onclick="navigate('shop')">Explore Collection</button>
            </section>
        `;
    }
    
    return `
        <section class="section page-container">
            <h2 class="title-lg" style="margin-bottom:30px;">Your Wishlist</h2>
            <div class="grid">
                ${state.wishlist.map(id => productCardHTML(products.find(p => p.id === id))).join('')}
            </div>
        </section>
    `;
}

function renderLogin() {
    return `
        <section class="section page-container">
            <div class="auth-container">
                <h2 class="title-md" style="text-align:center; margin-bottom:30px;">Sign In</h2>
                <div class="form-group">
                    <input type="email" id="login-email" placeholder="Email Address">
                </div>
                <div class="form-group">
                    <input type="password" id="login-password" placeholder="Password">
                </div>
                <button class="btn-primary" id="btn-login" style="width:100%; margin-bottom:15px;" onclick="handleLogin()">Login</button>
                <div style="text-align:center; color:var(--text-muted);">
                    <a href="#">Forgot Password?</a><br><br>
                    Don't have an account? <a href="#" style="color:var(--gold);" onclick="navigate('register'); return false;">Sign Up</a>
                </div>
            </div>
        </section>
    `;
}

function productCardHTML(product) {
    const inWishlist = state.wishlist.includes(product.id);
    return `
        <div class="product-card">
            <button class="wishlist-btn ${inWishlist ? 'active' : ''}" onclick="toggleWishlist('${product.id}', event)">
                <i class="${inWishlist ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
            </button>
            <div class="product-img-wrapper" onclick="navigate('shop')">
                <img src="${product.image}" class="product-img" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:10px;">${product.style} / ${product.strap}</p>
                <div class="product-price">₹${product.price.toLocaleString('en-IN')}</div>
                <div class="product-actions">
                    <button class="btn-outline" onclick="navigate('shop')">Details</button>
                    <button class="btn-primary" onclick="addToCart('${product.id}')">Cart</button>
                    <button class="btn-primary" style="background:var(--gold); color:#000;" onclick="buyNow('${product.id}')">Buy Now</button>
                </div>
            </div>
        </div>
    `;
}

// Actions
function navigate(page) {
    state.currentPage = page;
    renderPage();
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = state.cart.find(item => item.id === id);
    if(existing) {
        existing.quantity += 1;
    } else {
        state.cart.push({...product, quantity: 1});
    }
    updateNav();
    alert(product.name + ' added to cart!');
}

function buyNow(id) {
    if (!state.user) {
        alert('Please login to place an order.');
        navigate('login');
        return;
    }
    const product = products.find(p => p.id === id);
    state.checkoutItems = [{...product, quantity: 1}];
    navigate('checkout');
}

function checkoutCart() {
    if (!state.user) {
        alert('Please login to checkout.');
        navigate('login');
        return;
    }
    if (state.cart.length === 0) return;
    state.checkoutItems = [...state.cart];
    navigate('checkout');
}

function removeFromCart(id) {
    state.cart = state.cart.filter(item => item.id !== id);
    if(state.currentPage === 'cart') renderPage();
    updateNav();
}

function toggleWishlist(id, event) {
    if(event) event.stopPropagation();
    const index = state.wishlist.indexOf(id);
    if(index > -1) {
        state.wishlist.splice(index, 1);
    } else {
        state.wishlist.push(id);
    }
    renderPage();
}

async function handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    const btn = document.getElementById('btn-login');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Logging in...';
    btn.disabled = true;

    try {
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        
        // Fetch user profile from Supabase
        const { data: profile } = await window.supabaseClient.from('profiles').select('*').eq('id', data.user.id).single();
        
        state.user = {
            id: data.user.id,
            name: (profile?.first_name || '') + ' ' + (profile?.last_name || ''),
            email: data.user.email,
            avatar: "https://ui-avatars.com/api/?name=" + encodeURIComponent(profile?.first_name || data.user.email) + "&background=d4af37&color=000"
        };
        
        navigate('home');
        
    } catch (err) {
        alert(err.message);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

function updateNav() {
    const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').innerText = cartCount;
    
    const authBtn = document.getElementById('auth-btn-group');
    if (!authBtn) return;
    
    if(state.user) {
        authBtn.onclick = null;
        authBtn.innerHTML = `
            <div class="profile-dropdown-container" onclick="toggleDropdown(event)">
                <img src="${state.user.avatar}" alt="User" class="nav-avatar">
                <div class="profile-dropdown" id="profile-dropdown">
                    <div class="dropdown-header">
                        <img src="${state.user.avatar}" alt="User" class="dropdown-avatar">
                        <div class="dropdown-user-info">
                            <span class="dropdown-name">${state.user.name}</span>
                            <span class="dropdown-email">${state.user.email}</span>
                        </div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <a href="#" onclick="navigate('dashboard'); event.stopPropagation(); return false;"><i class="fa-regular fa-user"></i> My Profile</a>
                    <a href="#" onclick="navigate('my-orders'); event.stopPropagation(); return false;"><i class="fa-solid fa-box"></i> My Orders</a>
                    <a href="#" onclick="alert('Account/Settings'); event.stopPropagation(); return false;"><i class="fa-solid fa-gear"></i> Account/Settings</a>
                    <div class="dropdown-divider"></div>
                    <a href="#" onclick="handleLogout(); event.stopPropagation(); return false;" class="logout-btn"><i class="fa-solid fa-arrow-right-from-bracket"></i> Logout</a>
                </div>
            </div>
            <a href="/admin/login" class="login-text" style="text-decoration:none; color:var(--text-muted); margin-left:15px;">Admin</a>
        `;
    } else {
        authBtn.onclick = null;
        authBtn.innerHTML = `
            <!-- Desktop Auth Links -->
            <a href="#" onclick="navigate('login'); return false;" class="login-text" style="text-decoration:none; color:inherit;">Login</a>
            <a href="#" onclick="navigate('register'); return false;" class="login-text" style="text-decoration:none; color:inherit;">Sign Up</a>
            <a href="/admin/login" class="login-text" style="text-decoration:none; color:var(--text-muted);">Admin</a>
            
            <!-- Mobile fallback icon -->
            <i class="fa-regular fa-user login-icon-mobile" onclick="navigate('login')"></i>
        `;
    }
}

function toggleDropdown(event) {
    event.stopPropagation();
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

async function handleLogout() {
    if (window.supabaseClient) {
        await window.supabaseClient.auth.signOut();
    }
    state.user = null;
    navigate('home');
}

// Click outside to close dropdown
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown && dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
    }
});

let otpInterval;

function renderRegister() {
    return `
        <section class="section page-container">
            <div class="auth-container" style="max-width: 500px;" id="register-container">
                <h2 class="title-md" style="text-align:center; margin-bottom:30px;">Create Account</h2>
                
                <div id="registration-form">
                    <div class="form-group">
                        <input type="text" id="reg-name" placeholder="Full Name" required>
                    </div>
                    <div class="form-group">
                        <input type="tel" id="reg-mobile" placeholder="Mobile Number (10 digits)" required>
                    </div>
                    <div class="form-group">
                        <input type="email" id="reg-email" placeholder="Email Address" required>
                    </div>
                    <div class="form-group">
                        <input type="password" id="reg-password" placeholder="Password" required>
                    </div>
                    <div class="form-group">
                        <input type="text" id="reg-address" placeholder="Complete Address" required>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <div class="form-group" style="flex:1;">
                            <input type="text" id="reg-city" placeholder="City" required>
                        </div>
                        <div class="form-group" style="flex:1;">
                            <input type="text" id="reg-state" placeholder="State" required>
                        </div>
                        <div class="form-group" style="flex:1;">
                            <input type="text" id="reg-pin" placeholder="PIN Code" required>
                        </div>
                    </div>
                    <button class="btn-primary" id="btn-register" style="width:100%; margin-bottom:15px;" onclick="handleRegister()">Create Account</button>
                    <div style="text-align:center; color:var(--text-muted);">
                        Already have an account? <a href="#" style="color:var(--gold);" onclick="navigate('login'); return false;">Sign In</a>
                    </div>
                </div>

                <div id="verification-message" style="display:none; text-align:center;">
                    <h3 style="margin-bottom:15px;">Check Your Email</h3>
                    <p style="color:var(--text-muted); margin-bottom:20px;">Please verify your email address before continuing.</p>
                    <button class="btn-primary" style="width:100%; margin-bottom:15px;" onclick="navigate('login')">Go to Login</button>
                </div>
            </div>
        </section>
    `;
}

async function handleRegister() {
    const name = document.getElementById('reg-name').value.trim();
    const mobile = document.getElementById('reg-mobile').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const address = document.getElementById('reg-address').value.trim();
    const city = document.getElementById('reg-city').value.trim();
    const stateInput = document.getElementById('reg-state').value.trim();
    const pin = document.getElementById('reg-pin').value.trim();

    // 1. Empty checks
    if (!name || !mobile || !email || !password || !address || !city || !stateInput || !pin) {
        alert("Please fill in all required fields.");
        return;
    }

    // 2. Full Name Validation: >= 2 chars, not only numbers, not only special chars
    if (name.length < 2 || /^[0-9]+$/.test(name) || /^[^a-zA-Z0-9]+$/.test(name)) {
        alert("Please enter a valid full name.");
        return;
    }

    // 3. Indian Mobile Validation: exactly 10 digits, starts with 6-9
    if (!/^[6-9]\d{9}$/.test(mobile)) {
        alert("Please enter a valid 10-digit Indian mobile number.");
        return;
    }

    // 4. Email Validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // 5. PIN Code Validation: exactly 6 digits
    if (!/^\d{6}$/.test(pin)) {
        alert("Please enter a valid 6-digit PIN code.");
        return;
    }

    const btn = document.getElementById('btn-register');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Creating Account...';
    btn.disabled = true;

    try {
        if (!window.supabaseClient) {
            throw new Error("Database connection not established. Please try again later.");
        }

        const { data, error } = await window.supabaseClient.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: name.split(' ')[0],
                    last_name: name.split(' ').slice(1).join(' '),
                    phone: mobile,
                    address_street: address,
                    address_city: city,
                    address_state: stateInput,
                    address_pin: pin
                }
            }
        });

        if (error) throw error;

        if (data.user && data.user.identities && data.user.identities.length === 0) {
            throw new Error("An account with this email already exists. Please sign in.");
        }

        // Show verification message
        document.getElementById('registration-form').style.display = 'none';
        document.getElementById('verification-message').style.display = 'block';

    } catch (err) {
        alert(err.message);
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

function startOTPTimer() {
    clearInterval(otpInterval);
    document.getElementById('btn-resend-otp').style.display = 'none';
    const timerDisplay = document.getElementById('otp-timer');
    
    otpInterval = setInterval(() => {
        const remaining = state.otpExpiry - Date.now();
        if (remaining <= 0) {
            clearInterval(otpInterval);
            timerDisplay.innerText = "OTP Expired";
            timerDisplay.style.color = "#ff4444";
            document.getElementById('btn-resend-otp').style.display = 'block';
            state.currentOTP = null;
        } else {
            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            timerDisplay.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            timerDisplay.style.color = "var(--text-muted)";
        }
    }, 1000);
}

function handleVerifyOTP() {
    const enteredOTP = document.getElementById('reg-otp').value;
    const btn = document.getElementById('btn-verify-otp');
    
    if (!enteredOTP) {
        alert("Please enter the OTP.");
        return;
    }
    
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Verifying...';
    btn.disabled = true;

    setTimeout(() => {
        if (!state.currentOTP || Date.now() > state.otpExpiry) {
            alert("OTP has expired. Please click Resend OTP to get a new one.");
            btn.innerHTML = 'Verify & Create Account';
            btn.disabled = false;
            return;
        }
        
        if (enteredOTP === state.currentOTP) {
            clearInterval(otpInterval);
            
            // Create user securely in localStorage database
            const user = {
                id: 'USER_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                ...state.pendingRegistration,
                avatar: "https://ui-avatars.com/api/?name=" + encodeURIComponent(state.pendingRegistration.name) + "&background=d4af37&color=000",
                createdAt: new Date().toISOString()
            };
            
            let usersDb = JSON.parse(localStorage.getItem('aether_users') || '[]');
            usersDb.push(user);
            localStorage.setItem('aether_users', JSON.stringify(usersDb));
            
            // Log user in
            state.user = user;
            state.currentOTP = null;
            state.pendingRegistration = null;
            
            alert("Account verified and created successfully!");
            navigate('dashboard');
        } else {
            alert("Incorrect OTP. Please check the code and try again.");
            btn.innerHTML = 'Verify & Create Account';
            btn.disabled = false;
        }
    }, 800);
}

function editMobileNumber() {
    clearInterval(otpInterval);
    document.getElementById('otp-verification').style.display = 'none';
    document.getElementById('registration-form').style.display = 'block';
}

function renderDashboard() {
    if (!state.user) {
        setTimeout(() => navigate('login'), 0);
        return '';
    }
    
    return `
        <section class="section page-container">
            <h2 class="title-lg" style="margin-bottom:30px;">My Dashboard</h2>
            <div class="shop-layout">
                <aside class="filters-sidebar">
                    <div style="text-align:center; padding-bottom:20px; border-bottom:1px solid var(--border-color); margin-bottom:20px;">
                        <img src="${state.user.avatar}" style="width:100px; height:100px; border-radius:50%; border:2px solid var(--gold); margin-bottom:15px;">
                        <h3 style="font-size:1.2rem;">${state.user.name}</h3>
                        <p style="color:var(--text-muted); font-size:0.9rem;">${state.user.mobile}</p>
                    </div>
                    <div class="filter-group">
                        <label style="color:var(--gold);"><i class="fa-regular fa-user" style="width:20px;"></i> My Profile</label>
                        <label onclick="navigate('cart')"><i class="fa-solid fa-box" style="width:20px;"></i> My Orders</label>
                        <label onclick="navigate('wishlist')"><i class="fa-regular fa-heart" style="width:20px;"></i> Wishlist</label>
                        <label onclick="handleLogout()"><i class="fa-solid fa-arrow-right-from-bracket" style="width:20px;"></i> Logout</label>
                    </div>
                </aside>
                
                <div class="shop-content" style="background:var(--card-bg); padding:30px; border:1px solid var(--border-color); border-radius:8px;">
                    <h2 class="title-md" style="margin-bottom:30px; border-bottom:1px solid var(--border-color); padding-bottom:15px;">Personal Information</h2>
                    
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:30px;">
                        <div>
                            <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:5px;">Full Name</p>
                            <p style="font-size:1.1rem;">${state.user.name}</p>
                        </div>
                        <div>
                            <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:5px;">Mobile Number</p>
                            <p style="font-size:1.1rem;">${state.user.mobile}</p>
                        </div>
                        <div>
                            <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:5px;">Email Address</p>
                            <p style="font-size:1.1rem;">${state.user.email || 'N/A'}</p>
                        </div>
                        <div>
                            <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:5px;">User ID</p>
                            <p style="font-size:1.1rem; font-family:monospace; color:var(--gold);">${state.user.id}</p>
                        </div>
                    </div>
                    
                    <h2 class="title-md" style="margin-bottom:20px; border-bottom:1px solid var(--border-color); padding-bottom:15px; margin-top:40px;">Shipping Address</h2>
                    
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
                        <div style="grid-column: 1 / -1;">
                            <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:5px;">Complete Address</p>
                            <p style="font-size:1.1rem;">${state.user.address}</p>
                        </div>
                        <div>
                            <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:5px;">City</p>
                            <p style="font-size:1.1rem;">${state.user.city}</p>
                        </div>
                        <div>
                            <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:5px;">State & PIN</p>
                            <p style="font-size:1.1rem;">${state.user.state} - ${state.user.pin}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

// Search Functionality
function toggleSearch() {
    const overlay = document.getElementById('search-overlay');
    if (!overlay) return;
    
    overlay.classList.toggle('active');
    
    if (overlay.classList.contains('active')) {
        const input = document.getElementById('search-input');
        if(input) {
            input.value = '';
            input.focus();
        }
        const results = document.getElementById('search-results');
        if(results) results.innerHTML = '';
        document.body.style.overflow = 'hidden'; // Prevent scrolling behind overlay
    } else {
        document.body.style.overflow = 'auto';
    }
}

function handleSearch(event) {
    const query = event.target.value.toLowerCase().trim();
    const resultsContainer = document.getElementById('search-results');
    
    if (query.length === 0) {
        resultsContainer.innerHTML = '';
        return;
    }
    
    // Search products from data.js
    const results = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query) ||
        p.style.toLowerCase().includes(query)
    );
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="search-no-results">No watches found.</div>';
    } else {
        resultsContainer.innerHTML = results.map(p => `
            <div class="search-result-item">
                <img src="${p.image}" class="search-result-img" alt="${p.name}">
                <div class="search-result-info">
                    <div class="search-result-title">${p.name}</div>
                    <div class="search-result-price">₹${p.price.toLocaleString('en-IN')}</div>
                </div>
                <button class="btn-outline" onclick="viewProduct('${p.id}')">View Product</button>
            </div>
        `).join('');
    }
}

function viewProduct(id) {
    toggleSearch(); // Close search overlay
    state.currentProduct = products.find(p => p.id === id);
    navigate('product'); // Navigate to product details
}

function renderProductDetails() {
    if (!state.currentProduct) {
        setTimeout(() => navigate('shop'), 0);
        return '';
    }
    
    const p = state.currentProduct;
    return `
        <section class="section page-container">
            <div class="shop-layout" style="grid-template-columns: 1fr 1fr; gap: 50px; margin-top: 40px;">
                <div style="background: rgba(255,255,255,0.02); padding: 40px; border-radius: 8px; border: 1px solid var(--border-color); text-align: center;">
                    <img src="${p.image}" style="max-width: 100%; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" alt="${p.name}">
                </div>
                <div>
                    <h2 class="title-lg" style="margin-bottom: 10px;">${p.name}</h2>
                    <p style="color: var(--text-muted); margin-bottom: 20px;">Category: ${p.category} | Style: ${p.style}</p>
                    
                    <div style="font-size: 2rem; color: var(--gold); margin-bottom: 30px;">
                        ₹${p.price.toLocaleString('en-IN')}
                    </div>
                    
                    <p style="color: var(--text-muted); line-height: 1.8; margin-bottom: 30px;">
                        An exquisite piece of craftsmanship, the ${p.name} embodies the pinnacle of luxury watchmaking. 
                        Designed for those who appreciate the finer things in life, featuring a beautiful ${p.strap} strap.
                    </p>
                    
                    <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                        <button class="btn-primary" style="flex: 1; padding: 15px;" onclick="addToCart('${p.id}')">
                            <i class="fa-solid fa-cart-plus"></i> Add to Cart
                        </button>
                        <button class="btn-primary" style="flex: 1; padding: 15px; background:var(--gold); color:#000;" onclick="buyNow('${p.id}')">
                            <i class="fa-solid fa-bolt"></i> Buy Now
                        </button>
                    </div>
                    <div style="display: flex; gap: 20px; margin-bottom: 40px;">
                        <button class="btn-outline" style="flex: 1; padding: 15px;" onclick="toggleWishlist('${p.id}', event)">
                            <i class="${state.wishlist.includes(p.id) ? 'fa-solid' : 'fa-regular'} fa-heart"></i> 
                            ${state.wishlist.includes(p.id) ? 'Saved' : 'Wishlist'}
                        </button>
                    </div>
                    
                    <div style="border-top: 1px solid var(--border-color); padding-top: 20px;">
                        <h4 style="margin-bottom: 15px; color: var(--gold);">Specifications</h4>
                        <ul style="color: var(--text-muted); line-height: 1.8; list-style-position: inside;">
                            <li>Movement: Automatic Self-Winding</li>
                            <li>Water Resistance: 100m</li>
                            <li>Case Material: Premium Stainless Steel</li>
                            <li>Strap: ${p.strap}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    `;
}

// Init
// ---------------- CHECKOUT & ORDERS ---------------- //

window.renderCheckout = function() {
    if (!state.user) {
        navigate('login');
        return '';
    }
    const items = state.checkoutItems || [];
    if (items.length === 0) {
        return `<section class="section page-container"><h2 class="title-lg">No items to checkout</h2><button class="btn-primary" onclick="navigate('shop')">Shop</button></section>`;
    }
    
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 0; // Free shipping for now
    const total = subtotal + shipping;
    
    return `
        <section class="section page-container">
            <h2 class="title-lg" style="margin-bottom:30px;">Checkout</h2>
            <div class="shop-layout">
                <div>
                    <h3>Delivery Details</h3>
                    <form id="checkout-form" onsubmit="handlePlaceOrder(event)" style="margin-top:20px;">
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" id="chk-name" required value="${state.user.user_metadata?.first_name || ''} ${state.user.user_metadata?.last_name || ''}">
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="chk-email" required value="${state.user.email || ''}">
                        </div>
                        <div class="form-group">
                            <label>Phone Number (10 digits)</label>
                            <input type="tel" id="chk-phone" pattern="[0-9]{10}" required value="${state.user.user_metadata?.phone || ''}">
                        </div>
                        <div class="form-group">
                            <label>Complete Address</label>
                            <input type="text" id="chk-address" required value="${state.user.user_metadata?.address_street || ''}">
                        </div>
                        <div style="display:flex; gap:10px;">
                            <div class="form-group" style="flex:1;">
                                <label>City</label>
                                <input type="text" id="chk-city" required value="${state.user.user_metadata?.address_city || ''}">
                            </div>
                            <div class="form-group" style="flex:1;">
                                <label>State</label>
                                <input type="text" id="chk-state" required value="${state.user.user_metadata?.address_state || ''}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>PIN Code</label>
                            <input type="text" id="chk-pin" pattern="[0-9]{6}" required value="${state.user.user_metadata?.address_pin || ''}">
                        </div>
                        
                        <h3 style="margin-top:30px; margin-bottom:15px;">Payment Method</h3>
                        <div class="form-group">
                            <label><input type="radio" name="payment_method" value="razorpay" required> Razorpay (Credit/Debit/Netbanking)</label><br>
                            <label><input type="radio" name="payment_method" value="cashfree" required> Cashfree Payments</label><br>
                            <label><input type="radio" name="payment_method" value="cod" required checked> Cash on Delivery (COD)</label>
                        </div>
                        
                        <button type="submit" class="btn-primary" style="width:100%; margin-top:20px; font-size:1.1rem; padding:15px;" id="btn-place-order">Place Order</button>
                    </form>
                </div>
                
                <div style="background:var(--card-bg); padding:30px; border:1px solid var(--border-color); height:fit-content;">
                    <h3 style="margin-bottom:20px; font-family:var(--font-heading);">Order Summary</h3>
                    ${items.map(item => `
                        <div style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid var(--border-color); padding-bottom:15px;">
                            <div style="display:flex; gap:10px;">
                                <img src="${item.image_url || item.image}" style="width:50px; height:50px; object-fit:cover;">
                                <div>
                                    <div style="font-weight:bold;">${item.name}</div>
                                    <div style="font-size:0.8rem; color:var(--text-muted);">Qty: ${item.quantity}</div>
                                </div>
                            </div>
                            <div>₹${(item.price * item.quantity).toLocaleString('en-IN')}</div>
                        </div>
                    `).join('')}
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                        <span>Subtotal</span>
                        <span>₹${subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:20px;">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:1.2rem; border-top:1px solid var(--border-color); padding-top:20px;">
                        <span>Total</span>
                        <span>₹${total.toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>
        </section>
    `;
}

window.handlePlaceOrder = async function(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-place-order');
    btn.innerText = 'Processing...';
    btn.disabled = true;

    try {
        const { data: sessionData } = await window.supabaseClient.auth.getSession();
        if (!sessionData || !sessionData.session) {
            alert("Please login before placing your order.");
            btn.innerHTML = 'Place Order';
            btn.disabled = false;
            return;
        }

        const customer_name = document.getElementById('chk-name').value.trim();
        const customer_email = document.getElementById('chk-email').value.trim();
        const customer_phone = document.getElementById('chk-phone').value.trim();
        const shipping_address = document.getElementById('chk-address').value.trim();
        const city = document.getElementById('chk-city').value.trim();
        const stateInput = document.getElementById('chk-state').value.trim();
        const pincode = document.getElementById('chk-pin').value.trim();

        if (!customer_name || !customer_email || !customer_phone || !shipping_address || !city || !stateInput || !pincode) {
            throw new Error("Please fill in all required fields.");
        }
        if (!/^[6-9]\d{9}$/.test(customer_phone)) {
            throw new Error("Please enter a valid 10-digit Indian mobile number.");
        }
        if (!/^\d{6}$/.test(pincode)) {
            throw new Error("Please enter a valid 6-digit PIN code.");
        }

        const orderData = {
            customer_name,
            customer_email,
            customer_phone,
            shipping_address,
            city,
            state: stateInput,
            pincode,
            payment_method: document.querySelector('input[name="payment_method"]:checked').value,
            items: state.checkoutItems,
            subtotal: state.checkoutItems.reduce((s, i) => s + (i.price * i.quantity), 0)
        };

        const res = await fetch('/api/payment/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionData.session.access_token}`
            },
            body: JSON.stringify(orderData)
        });
        
        let data = {};
        const text = await res.text();
        if (text) {
            try {
                data = JSON.parse(text);
            } catch(e) {
                console.error("Failed to parse backend response:", text);
            }
        }
        
        if (!res.ok) {
            console.error("ORDER CREATION ERROR (Backend):", data.error || text);
            throw new Error(data.error || data.message || 'Unknown server error during order creation. Check backend logs.');
        }
        
        if (orderData.payment_method === 'cod') {
            state.cart = []; // clear cart if checkout succeeds
            state.lastOrder = data.order;
            navigate('order-success');
        } else if (orderData.payment_method === 'razorpay') {
            // Load razorpay script if not exists
            if (!window.Razorpay) {
                await new Promise(r => { const s=document.createElement('script'); s.src='https://checkout.razorpay.com/v1/checkout.js'; s.onload=r; document.head.appendChild(s); });
            }
            const options = {
                key: data.key,
                amount: data.amount,
                currency: "INR",
                name: "AETHER Watches",
                description: "Purchase Order",
                order_id: data.gateway_order_id,
                handler: async function (response) {
                    const verifyRes = await fetch('/api/payment/verify/razorpay', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            order_id: data.order.id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    });
                    const verifyData = await verifyRes.json();
                    if(verifyData.success) {
                        state.cart = [];
                        state.lastOrder = data.order;
                        navigate('order-success');
                    } else {
                        alert('Payment verification failed.');
                    }
                },
                prefill: {
                    name: orderData.customer_name,
                    email: orderData.customer_email,
                    contact: orderData.customer_phone
                },
                theme: { color: "#d4af37" }
            };
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response){
                alert("Payment Failed: " + response.error.description);
            });
            rzp.open();
        } else if (orderData.payment_method === 'cashfree') {
            if (!window.Cashfree) {
                await new Promise(r => { const s=document.createElement('script'); s.src='https://sdk.cashfree.com/js/v3/cashfree.js'; s.onload=r; document.head.appendChild(s); });
            }
            const cashfree = window.Cashfree({
                mode: data.mode
            });
            const checkoutOptions = {
                paymentSessionId: data.payment_session_id,
                redirectTarget: "_modal",
            };
            cashfree.checkout(checkoutOptions).then((result) => {
                if(result.error){
                    alert("Payment Error: " + result.error.message);
                    btn.innerText = 'Place Order';
                    btn.disabled = false;
                }
                if(result.paymentDetails){
                    fetch('/api/payment/verify/cashfree', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ order_id: data.order.id })
                    }).then(r => r.json()).then(verifyData => {
                        if(verifyData.success) {
                            state.cart = [];
                            state.lastOrder = data.order;
                            navigate('order-success');
                        } else {
                            alert('Payment verification failed or pending.');
                            btn.innerText = 'Place Order';
                            btn.disabled = false;
                        }
                    });
                }
            });
        }
    } catch (err) {
        alert(err.message);
        btn.innerText = 'Place Order';
        btn.disabled = false;
    }
}

window.renderOrderSuccess = function() {
    return `
        <section class="section page-container" style="text-align:center; padding-top:100px;">
            <i class="fa-solid fa-circle-check" style="font-size:4rem; color:var(--gold); margin-bottom:20px;"></i>
            <h2 class="title-lg">Order Confirmed!</h2>
            <p style="margin:20px 0; color:var(--text-muted);">Thank you for shopping with AETHER. Your order #${state.lastOrder?.order_number || state.lastOrder?.id?.split('-')[0] || ''} has been placed successfully.</p>
            <button class="btn-primary" onclick="navigate('my-orders')">View My Orders</button>
        </section>
    `;
}

window.renderMyOrders = function() {
    // We will inject the data asynchronously
    setTimeout(loadMyOrders, 0);
    return `
        <section class="section page-container">
            <h2 class="title-lg" style="margin-bottom:30px;">My Orders</h2>
            <div id="my-orders-container">Loading your orders...</div>
        </section>
    `;
}

async function loadMyOrders() {
    const container = document.getElementById('my-orders-container');
    if(!container) return;
    
    try {
        const res = await fetch('/api/user/orders', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ user_id: state.user.id })
        });
        const data = await res.json();
        
        if (!data || data.length === 0) {
            container.innerHTML = '<p>You have no past orders.</p>';
            return;
        }
        
        container.innerHTML = data.map(order => `
            <div style="background:var(--card-bg); padding:20px; border:1px solid var(--border-color); margin-bottom:20px;">
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border-color); padding-bottom:10px; margin-bottom:15px;">
                    <div><strong>Order #${order.order_number || order.id.split('-')[0]}</strong></div>
                    <div>${new Date(order.created_at).toLocaleDateString()}</div>
                </div>
                <div style="display:flex; justify-content:space-between; gap:20px; flex-wrap:wrap;">
                    <div style="flex:2;">
                        ${order.order_items.map(item => `
                            <div style="display:flex; gap:10px; margin-bottom:10px;">
                                <img src="${item.product_image || 'https://via.placeholder.com/50'}" style="width:50px; height:50px; object-fit:cover;">
                                <div>
                                    <div>${item.product_name || 'Product'}</div>
                                    <div style="font-size:0.8rem; color:var(--text-muted);">Qty: ${item.quantity} | ₹${item.unit_price}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div style="flex:1; border-left:1px solid var(--border-color); padding-left:20px;">
                        <p><strong>Total:</strong> ₹${order.total_amount}</p>
                        <p><strong>Status:</strong> <span class="status-badge status-${order.status}">${order.status.toUpperCase()}</span></p>
                        <p><strong>Payment:</strong> <span class="status-badge">${order.payment_method?.toUpperCase()} | ${order.payment_status || 'Pending'}</span></p>
                    </div>
                </div>
            </div>
        `).join('');
    } catch(e) {
        container.innerHTML = '<p style="color:red;">Error loading orders.</p>';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    let rendered = false;

    // Safety timeout: render page after 3s even if Supabase never initializes
    const safetyTimeout = setTimeout(() => {
        if (!rendered) {
            rendered = true;
            console.warn('Supabase init timeout — rendering page without data');
            renderPage();
        }
    }, 3000);

    // Initialize Supabase check
    const initCheck = setInterval(async () => {
        if (window.supabaseClient) {
            clearInterval(initCheck);

            try {
                // Check for existing session
                const sessionResult = await window.supabaseClient.auth.getSession();
                const session = sessionResult?.data?.session || null;

                if (session) {
                    try {
                        const { data: profile } = await window.supabaseClient.from('profiles').select('*').eq('id', session.user.id).single();
                        if (profile && profile.role === 'customer') {
                            state.user = {
                                id: session.user.id,
                                name: (profile.first_name || '') + ' ' + (profile.last_name || ''),
                                email: session.user.email,
                                avatar: "https://ui-avatars.com/api/?name=" + encodeURIComponent(profile.first_name || session.user.email) + "&background=d4af37&color=000"
                            };
                        }
                    } catch (profileErr) {
                        console.warn('Could not load user profile:', profileErr.message);
                    }
                }
            } catch (authErr) {
                console.warn('Could not check auth session:', authErr.message);
            }

            try {
                // Fetch products from Supabase
                const { data, error } = await window.supabaseClient.from('products').select('*').eq('is_active', true);
                if (data && !error) {
                    products = data.map(p => ({
                        ...p,
                        image: p.image_url || 'https://via.placeholder.com/300'
                    }));
                } else if (error) {
                    console.warn('Could not fetch products:', error.message);
                }
            } catch (fetchErr) {
                console.warn('Products fetch failed:', fetchErr.message);
            }

            if (!rendered) {
                rendered = true;
                clearTimeout(safetyTimeout);
                renderPage();
            }
        }
    }, 100);
});

// Expose functions to window for inline onclick handlers (required for ES modules)
window.navigate = navigate;
window.toggleSearch = toggleSearch;
window.handleSearch = handleSearch;
window.addToCart = addToCart;
window.buyNow = buyNow;
window.checkoutCart = checkoutCart;
window.removeFromCart = removeFromCart;
window.toggleWishlist = toggleWishlist;
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.handleRegister = handleRegister;
window.handleVerifyOTP = handleVerifyOTP;
window.editMobileNumber = editMobileNumber;
window.toggleDropdown = toggleDropdown;
window.viewProduct = viewProduct;
window.loadMyOrders = loadMyOrders;
