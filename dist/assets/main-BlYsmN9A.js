import"./supabase-init-DwNNH3oa.js";if(window.location.pathname.startsWith(`/admin`)&&!window.location.pathname.includes(`.html`))throw sessionStorage.setItem(`admin_intended_path`,window.location.pathname),window.location.href=`/admin/index.html`,Error(`Admin Route Intercepted - Redirecting to real file`);function e(){let e=document.getElementById(`main-content`);switch(e.innerHTML=``,window.scrollTo(0,0),state.currentPage){case`home`:e.innerHTML=t();break;case`shop`:e.innerHTML=n();break;case`cart`:e.innerHTML=r();break;case`wishlist`:e.innerHTML=i();break;case`login`:e.innerHTML=a();break;case`register`:e.innerHTML=v();break;case`checkout`:e.innerHTML=renderCheckout();break;case`order-success`:e.innerHTML=renderOrderSuccess();break;case`my-orders`:e.innerHTML=renderMyOrders();break;case`dashboard`:e.innerHTML=S();break;case`product`:e.innerHTML=E();break;default:e.innerHTML=t()}m()}function t(){return`
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
                    ${products.slice(0,3).map(e=>o(e)).join(``)}
                </div>
            </div>
        </section>
    `}function n(){return`
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
                        ${products.map(e=>o(e)).join(``)}
                    </div>
                </div>
            </div>
        </section>
    `}function r(){if(state.cart.length===0)return`
            <section class="section page-container" style="text-align:center; padding-top:100px;">
                <h2 class="title-lg">Your Cart is Empty</h2>
                <p style="margin:20px 0; color:var(--text-muted);">Explore our collection to find your perfect timepiece.</p>
                <button class="btn-primary" onclick="navigate('shop')">Continue Shopping</button>
            </section>
        `;let e=state.cart.reduce((e,t)=>e+t.price*t.quantity,0);return`
        <section class="section page-container">
            <h2 class="title-lg" style="margin-bottom:30px;">Shopping Cart</h2>
            <div class="shop-layout">
                <div>
                    ${state.cart.map(e=>`
                        <div style="display:flex; gap:20px; background:var(--card-bg); padding:20px; margin-bottom:15px; border:1px solid var(--border-color);">
                            <img src="${e.image}" style="width:100px; height:100px; object-fit:cover;">
                            <div>
                                <h4 style="font-size:1.2rem;">${e.name}</h4>
                                <p style="color:var(--gold); margin:5px 0;">₹${e.price.toLocaleString(`en-IN`)}</p>
                                <p>Qty: ${e.quantity}</p>
                                <button style="color:#ff4444; margin-top:10px;" onclick="removeFromCart('${e.id}')">Remove</button>
                            </div>
                        </div>
                    `).join(``)}
                </div>
                <div style="background:var(--card-bg); padding:30px; border:1px solid var(--border-color); height:fit-content;">
                    <h3 style="margin-bottom:20px;">Order Summary</h3>
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                        <span>Subtotal</span>
                        <span>₹${e.toLocaleString(`en-IN`)}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:20px;">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                    <hr style="border-color:var(--border-color); margin-bottom:20px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:30px; font-size:1.2rem; color:var(--gold);">
                        <span>Total</span>
                        <span>₹${e.toLocaleString(`en-IN`)}</span>
                    </div>
                    <button class="btn-primary" style="width:100%;" onclick="alert('Checkout process initiated!')">Proceed to Checkout</button>
                </div>
            </div>
        </section>
    `}function i(){return state.wishlist.length===0?`
            <section class="section page-container" style="text-align:center; padding-top:100px;">
                <h2 class="title-lg">Your Wishlist is Empty</h2>
                <p style="margin:20px 0; color:var(--text-muted);">Save items you love here.</p>
                <button class="btn-primary" onclick="navigate('shop')">Explore Collection</button>
            </section>
        `:`
        <section class="section page-container">
            <h2 class="title-lg" style="margin-bottom:30px;">Your Wishlist</h2>
            <div class="grid">
                ${state.wishlist.map(e=>o(products.find(t=>t.id===e))).join(``)}
            </div>
        </section>
    `}function a(){return`
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
    `}function o(e){let t=state.wishlist.includes(e.id);return`
        <div class="product-card">
            <button class="wishlist-btn ${t?`active`:``}" onclick="toggleWishlist('${e.id}', event)">
                <i class="${t?`fa-solid`:`fa-regular`} fa-heart"></i>
            </button>
            <div class="product-img-wrapper" onclick="navigate('shop')">
                <img src="${e.image}" class="product-img" alt="${e.name}">
            </div>
            <div class="product-info">
                <h3 class="product-name">${e.name}</h3>
                <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:10px;">${e.style} / ${e.strap}</p>
                <div class="product-price">₹${e.price.toLocaleString(`en-IN`)}</div>
                <div class="product-actions">
                    <button class="btn-outline" onclick="navigate('shop')">Details</button>
                    <button class="btn-primary" onclick="addToCart('${e.id}')">Cart</button>
                    <button class="btn-primary" style="background:var(--gold); color:#000;" onclick="buyNow('${e.id}')">Buy Now</button>
                </div>
            </div>
        </div>
    `}function s(t){state.currentPage=t,e()}function c(e){let t=products.find(t=>t.id===e),n=state.cart.find(t=>t.id===e);n?n.quantity+=1:state.cart.push({...t,quantity:1}),m(),alert(t.name+` added to cart!`)}function l(e){if(!state.user){alert(`Please login to place an order.`),s(`login`);return}let t=products.find(t=>t.id===e);state.checkoutItems=[{...t,quantity:1}],s(`checkout`)}function u(){if(!state.user){alert(`Please login to checkout.`),s(`login`);return}state.cart.length!==0&&(state.checkoutItems=[...state.cart],s(`checkout`))}function d(t){state.cart=state.cart.filter(e=>e.id!==t),state.currentPage===`cart`&&e(),m()}function f(t,n){n&&n.stopPropagation();let r=state.wishlist.indexOf(t);r>-1?state.wishlist.splice(r,1):state.wishlist.push(t),e()}async function p(){let e=document.getElementById(`login-email`).value.trim(),t=document.getElementById(`login-password`).value;if(!e||!t){alert(`Please enter both email and password.`);return}let n=document.getElementById(`btn-login`),r=n.innerHTML;n.innerHTML=`<i class="fa-solid fa-circle-notch fa-spin"></i> Logging in...`,n.disabled=!0;try{let{data:n,error:r}=await window.supabaseClient.auth.signInWithPassword({email:e,password:t});if(r)throw r;let{data:i}=await window.supabaseClient.from(`profiles`).select(`*`).eq(`id`,n.user.id).single();state.user={id:n.user.id,name:(i?.first_name||``)+` `+(i?.last_name||``),email:n.user.email,avatar:`https://ui-avatars.com/api/?name=`+encodeURIComponent(i?.first_name||n.user.email)+`&background=d4af37&color=000`},s(`home`)}catch(e){alert(e.message)}finally{n.innerHTML=r,n.disabled=!1}}function m(){let e=state.cart.reduce((e,t)=>e+t.quantity,0);document.getElementById(`cart-count`).innerText=e;let t=document.getElementById(`auth-btn-group`);t&&(state.user?(t.onclick=null,t.innerHTML=`
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
        `):(t.onclick=null,t.innerHTML=`
            <!-- Desktop Auth Links -->
            <a href="#" onclick="navigate('login'); return false;" class="login-text" style="text-decoration:none; color:inherit;">Login</a>
            <a href="#" onclick="navigate('register'); return false;" class="login-text" style="text-decoration:none; color:inherit;">Sign Up</a>
            <a href="/admin/login" class="login-text" style="text-decoration:none; color:var(--text-muted);">Admin</a>
            
            <!-- Mobile fallback icon -->
            <i class="fa-regular fa-user login-icon-mobile" onclick="navigate('login')"></i>
        `))}function h(e){e.stopPropagation();let t=document.getElementById(`profile-dropdown`);t&&t.classList.toggle(`show`)}async function g(){window.supabaseClient&&await window.supabaseClient.auth.signOut(),state.user=null,s(`home`)}document.addEventListener(`click`,function(e){let t=document.getElementById(`profile-dropdown`);t&&t.classList.contains(`show`)&&t.classList.remove(`show`)});var _;function v(){return`
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
    `}async function y(){let e=document.getElementById(`reg-name`).value.trim(),t=document.getElementById(`reg-mobile`).value.trim(),n=document.getElementById(`reg-email`).value.trim(),r=document.getElementById(`reg-password`).value,i=document.getElementById(`reg-address`).value.trim(),a=document.getElementById(`reg-city`).value.trim(),o=document.getElementById(`reg-state`).value.trim(),s=document.getElementById(`reg-pin`).value.trim();if(!e||!t||!n||!r||!i||!a||!o||!s){alert(`Please fill in all required fields.`);return}if(e.length<2||/^[0-9]+$/.test(e)||/^[^a-zA-Z0-9]+$/.test(e)){alert(`Please enter a valid full name.`);return}if(!/^[6-9]\d{9}$/.test(t)){alert(`Please enter a valid 10-digit Indian mobile number.`);return}if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(n)){alert(`Please enter a valid email address.`);return}if(!/^\d{6}$/.test(s)){alert(`Please enter a valid 6-digit PIN code.`);return}let c=document.getElementById(`btn-register`),l=c.innerHTML;c.innerHTML=`<i class="fa-solid fa-circle-notch fa-spin"></i> Creating Account...`,c.disabled=!0;try{if(!window.supabaseClient)throw Error(`Database connection not established. Please try again later.`);let{data:c,error:l}=await window.supabaseClient.auth.signUp({email:n,password:r,options:{data:{first_name:e.split(` `)[0],last_name:e.split(` `).slice(1).join(` `),phone:t,address_street:i,address_city:a,address_state:o,address_pin:s}}});if(l)throw l;if(c.user&&c.user.identities&&c.user.identities.length===0)throw Error(`An account with this email already exists. Please sign in.`);document.getElementById(`registration-form`).style.display=`none`,document.getElementById(`verification-message`).style.display=`block`}catch(e){alert(e.message),c.innerHTML=l,c.disabled=!1}}function b(){let e=document.getElementById(`reg-otp`).value,t=document.getElementById(`btn-verify-otp`);if(!e){alert(`Please enter the OTP.`);return}t.innerHTML=`<i class="fa-solid fa-circle-notch fa-spin"></i> Verifying...`,t.disabled=!0,setTimeout(()=>{if(!state.currentOTP||Date.now()>state.otpExpiry){alert(`OTP has expired. Please click Resend OTP to get a new one.`),t.innerHTML=`Verify & Create Account`,t.disabled=!1;return}if(e===state.currentOTP){clearInterval(_);let e={id:`USER_`+Math.random().toString(36).substr(2,9).toUpperCase(),...state.pendingRegistration,avatar:`https://ui-avatars.com/api/?name=`+encodeURIComponent(state.pendingRegistration.name)+`&background=d4af37&color=000`,createdAt:new Date().toISOString()},t=JSON.parse(localStorage.getItem(`aether_users`)||`[]`);t.push(e),localStorage.setItem(`aether_users`,JSON.stringify(t)),state.user=e,state.currentOTP=null,state.pendingRegistration=null,alert(`Account verified and created successfully!`),s(`dashboard`)}else alert(`Incorrect OTP. Please check the code and try again.`),t.innerHTML=`Verify & Create Account`,t.disabled=!1},800)}function x(){clearInterval(_),document.getElementById(`otp-verification`).style.display=`none`,document.getElementById(`registration-form`).style.display=`block`}function S(){return state.user?`
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
                            <p style="font-size:1.1rem;">${state.user.email||`N/A`}</p>
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
    `:(setTimeout(()=>s(`login`),0),``)}function C(){let e=document.getElementById(`search-overlay`);if(e){if(e.classList.toggle(`active`),e.classList.contains(`active`)){let e=document.getElementById(`search-input`);e&&(e.value=``,e.focus());let t=document.getElementById(`search-results`);t&&(t.innerHTML=``),document.body.style.overflow=`hidden`}else document.body.style.overflow=`auto`}}function w(e){let t=e.target.value.toLowerCase().trim(),n=document.getElementById(`search-results`);if(t.length===0){n.innerHTML=``;return}let r=products.filter(e=>e.name.toLowerCase().includes(t)||e.category.toLowerCase().includes(t)||e.style.toLowerCase().includes(t));n.innerHTML=r.length===0?`<div class="search-no-results">No watches found.</div>`:r.map(e=>`
            <div class="search-result-item">
                <img src="${e.image}" class="search-result-img" alt="${e.name}">
                <div class="search-result-info">
                    <div class="search-result-title">${e.name}</div>
                    <div class="search-result-price">₹${e.price.toLocaleString(`en-IN`)}</div>
                </div>
                <button class="btn-outline" onclick="viewProduct('${e.id}')">View Product</button>
            </div>
        `).join(``)}function T(e){C(),state.currentProduct=products.find(t=>t.id===e),s(`product`)}function E(){if(!state.currentProduct)return setTimeout(()=>s(`shop`),0),``;let e=state.currentProduct;return`
        <section class="section page-container">
            <div class="shop-layout" style="grid-template-columns: 1fr 1fr; gap: 50px; margin-top: 40px;">
                <div style="background: rgba(255,255,255,0.02); padding: 40px; border-radius: 8px; border: 1px solid var(--border-color); text-align: center;">
                    <img src="${e.image}" style="max-width: 100%; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" alt="${e.name}">
                </div>
                <div>
                    <h2 class="title-lg" style="margin-bottom: 10px;">${e.name}</h2>
                    <p style="color: var(--text-muted); margin-bottom: 20px;">Category: ${e.category} | Style: ${e.style}</p>
                    
                    <div style="font-size: 2rem; color: var(--gold); margin-bottom: 30px;">
                        ₹${e.price.toLocaleString(`en-IN`)}
                    </div>
                    
                    <p style="color: var(--text-muted); line-height: 1.8; margin-bottom: 30px;">
                        An exquisite piece of craftsmanship, the ${e.name} embodies the pinnacle of luxury watchmaking. 
                        Designed for those who appreciate the finer things in life, featuring a beautiful ${e.strap} strap.
                    </p>
                    
                    <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                        <button class="btn-primary" style="flex: 1; padding: 15px;" onclick="addToCart('${e.id}')">
                            <i class="fa-solid fa-cart-plus"></i> Add to Cart
                        </button>
                        <button class="btn-primary" style="flex: 1; padding: 15px; background:var(--gold); color:#000;" onclick="buyNow('${e.id}')">
                            <i class="fa-solid fa-bolt"></i> Buy Now
                        </button>
                    </div>
                    <div style="display: flex; gap: 20px; margin-bottom: 40px;">
                        <button class="btn-outline" style="flex: 1; padding: 15px;" onclick="toggleWishlist('${e.id}', event)">
                            <i class="${state.wishlist.includes(e.id)?`fa-solid`:`fa-regular`} fa-heart"></i> 
                            ${state.wishlist.includes(e.id)?`Saved`:`Wishlist`}
                        </button>
                    </div>
                    
                    <div style="border-top: 1px solid var(--border-color); padding-top: 20px;">
                        <h4 style="margin-bottom: 15px; color: var(--gold);">Specifications</h4>
                        <ul style="color: var(--text-muted); line-height: 1.8; list-style-position: inside;">
                            <li>Movement: Automatic Self-Winding</li>
                            <li>Water Resistance: 100m</li>
                            <li>Case Material: Premium Stainless Steel</li>
                            <li>Strap: ${e.strap}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    `}window.renderCheckout=function(){if(!state.user)return s(`login`),``;let e=state.checkoutItems||[];if(e.length===0)return`<section class="section page-container"><h2 class="title-lg">No items to checkout</h2><button class="btn-primary" onclick="navigate('shop')">Shop</button></section>`;let t=e.reduce((e,t)=>e+t.price*t.quantity,0),n=t+0;return`
        <section class="section page-container">
            <h2 class="title-lg" style="margin-bottom:30px;">Checkout</h2>
            <div class="shop-layout">
                <div>
                    <h3>Delivery Details</h3>
                    <form id="checkout-form" onsubmit="handlePlaceOrder(event)" style="margin-top:20px;">
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" id="chk-name" required value="${state.user.user_metadata?.first_name||``} ${state.user.user_metadata?.last_name||``}">
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="chk-email" required value="${state.user.email||``}">
                        </div>
                        <div class="form-group">
                            <label>Phone Number (10 digits)</label>
                            <input type="tel" id="chk-phone" pattern="[0-9]{10}" required value="${state.user.user_metadata?.phone||``}">
                        </div>
                        <div class="form-group">
                            <label>Complete Address</label>
                            <input type="text" id="chk-address" required value="${state.user.user_metadata?.address_street||``}">
                        </div>
                        <div style="display:flex; gap:10px;">
                            <div class="form-group" style="flex:1;">
                                <label>City</label>
                                <input type="text" id="chk-city" required value="${state.user.user_metadata?.address_city||``}">
                            </div>
                            <div class="form-group" style="flex:1;">
                                <label>State</label>
                                <input type="text" id="chk-state" required value="${state.user.user_metadata?.address_state||``}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>PIN Code</label>
                            <input type="text" id="chk-pin" pattern="[0-9]{6}" required value="${state.user.user_metadata?.address_pin||``}">
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
                    ${e.map(e=>`
                        <div style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid var(--border-color); padding-bottom:15px;">
                            <div style="display:flex; gap:10px;">
                                <img src="${e.image_url||e.image}" style="width:50px; height:50px; object-fit:cover;">
                                <div>
                                    <div style="font-weight:bold;">${e.name}</div>
                                    <div style="font-size:0.8rem; color:var(--text-muted);">Qty: ${e.quantity}</div>
                                </div>
                            </div>
                            <div>₹${(e.price*e.quantity).toLocaleString(`en-IN`)}</div>
                        </div>
                    `).join(``)}
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                        <span>Subtotal</span>
                        <span>₹${t.toLocaleString(`en-IN`)}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:20px;">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:1.2rem; border-top:1px solid var(--border-color); padding-top:20px;">
                        <span>Total</span>
                        <span>₹${n.toLocaleString(`en-IN`)}</span>
                    </div>
                </div>
            </div>
        </section>
    `},window.handlePlaceOrder=async function(e){e.preventDefault();let t=document.getElementById(`btn-place-order`);t.innerText=`Processing...`,t.disabled=!0;try{let{data:e}=await window.supabaseClient.auth.getSession();if(!e||!e.session){alert(`Please login before placing your order.`),t.innerHTML=`Place Order`,t.disabled=!1;return}let n=document.getElementById(`chk-name`).value.trim(),r=document.getElementById(`chk-email`).value.trim(),i=document.getElementById(`chk-phone`).value.trim(),a=document.getElementById(`chk-address`).value.trim(),o=document.getElementById(`chk-city`).value.trim(),c=document.getElementById(`chk-state`).value.trim(),l=document.getElementById(`chk-pin`).value.trim();if(!n||!r||!i||!a||!o||!c||!l)throw Error(`Please fill in all required fields.`);if(!/^[6-9]\d{9}$/.test(i))throw Error(`Please enter a valid 10-digit Indian mobile number.`);if(!/^\d{6}$/.test(l))throw Error(`Please enter a valid 6-digit PIN code.`);let u={customer_name:n,customer_email:r,customer_phone:i,shipping_address:a,city:o,state:c,pincode:l,payment_method:document.querySelector(`input[name="payment_method"]:checked`).value,items:state.checkoutItems,subtotal:state.checkoutItems.reduce((e,t)=>e+t.price*t.quantity,0)},d=await fetch(`/api/payment/create-order`,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer ${e.session.access_token}`},body:JSON.stringify(u)}),f={},p=await d.text();if(p)try{f=JSON.parse(p)}catch{console.error(`Failed to parse backend response:`,p)}if(!d.ok)throw console.error(`ORDER CREATION ERROR (Backend):`,f.error||p),Error(f.error||f.message||`Unknown server error during order creation. Check backend logs.`);if(u.payment_method===`cod`)state.cart=[],state.lastOrder=f.order,s(`order-success`);else if(u.payment_method===`razorpay`){window.Razorpay||await new Promise(e=>{let t=document.createElement(`script`);t.src=`https://checkout.razorpay.com/v1/checkout.js`,t.onload=e,document.head.appendChild(t)});let e={key:f.key,amount:f.amount,currency:`INR`,name:`AETHER Watches`,description:`Purchase Order`,order_id:f.gateway_order_id,handler:async function(e){(await(await fetch(`/api/payment/verify/razorpay`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({order_id:f.order.id,razorpay_payment_id:e.razorpay_payment_id,razorpay_order_id:e.razorpay_order_id,razorpay_signature:e.razorpay_signature})})).json()).success?(state.cart=[],state.lastOrder=f.order,s(`order-success`)):alert(`Payment verification failed.`)},prefill:{name:u.customer_name,email:u.customer_email,contact:u.customer_phone},theme:{color:`#d4af37`}},t=new window.Razorpay(e);t.on(`payment.failed`,function(e){alert(`Payment Failed: `+e.error.description)}),t.open()}else if(u.payment_method===`cashfree`){window.Cashfree||await new Promise(e=>{let t=document.createElement(`script`);t.src=`https://sdk.cashfree.com/js/v3/cashfree.js`,t.onload=e,document.head.appendChild(t)});let e=window.Cashfree({mode:f.mode}),n={paymentSessionId:f.payment_session_id,redirectTarget:`_modal`};e.checkout(n).then(e=>{e.error&&(alert(`Payment Error: `+e.error.message),t.innerText=`Place Order`,t.disabled=!1),e.paymentDetails&&fetch(`/api/payment/verify/cashfree`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({order_id:f.order.id})}).then(e=>e.json()).then(e=>{e.success?(state.cart=[],state.lastOrder=f.order,s(`order-success`)):(alert(`Payment verification failed or pending.`),t.innerText=`Place Order`,t.disabled=!1)})})}}catch(e){alert(e.message),t.innerText=`Place Order`,t.disabled=!1}},window.renderOrderSuccess=function(){return`
        <section class="section page-container" style="text-align:center; padding-top:100px;">
            <i class="fa-solid fa-circle-check" style="font-size:4rem; color:var(--gold); margin-bottom:20px;"></i>
            <h2 class="title-lg">Order Confirmed!</h2>
            <p style="margin:20px 0; color:var(--text-muted);">Thank you for shopping with AETHER. Your order #${state.lastOrder?.order_number||state.lastOrder?.id?.split(`-`)[0]||``} has been placed successfully.</p>
            <button class="btn-primary" onclick="navigate('my-orders')">View My Orders</button>
        </section>
    `},window.renderMyOrders=function(){return setTimeout(D,0),`
        <section class="section page-container">
            <h2 class="title-lg" style="margin-bottom:30px;">My Orders</h2>
            <div id="my-orders-container">Loading your orders...</div>
        </section>
    `};async function D(){let e=document.getElementById(`my-orders-container`);if(e)try{let t=await(await fetch(`/api/user/orders`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({user_id:state.user.id})})).json();if(!t||t.length===0){e.innerHTML=`<p>You have no past orders.</p>`;return}e.innerHTML=t.map(e=>`
            <div style="background:var(--card-bg); padding:20px; border:1px solid var(--border-color); margin-bottom:20px;">
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border-color); padding-bottom:10px; margin-bottom:15px;">
                    <div><strong>Order #${e.order_number||e.id.split(`-`)[0]}</strong></div>
                    <div>${new Date(e.created_at).toLocaleDateString()}</div>
                </div>
                <div style="display:flex; justify-content:space-between; gap:20px; flex-wrap:wrap;">
                    <div style="flex:2;">
                        ${e.order_items.map(e=>`
                            <div style="display:flex; gap:10px; margin-bottom:10px;">
                                <img src="${e.product_image||`https://via.placeholder.com/50`}" style="width:50px; height:50px; object-fit:cover;">
                                <div>
                                    <div>${e.product_name||`Product`}</div>
                                    <div style="font-size:0.8rem; color:var(--text-muted);">Qty: ${e.quantity} | ₹${e.unit_price}</div>
                                </div>
                            </div>
                        `).join(``)}
                    </div>
                    <div style="flex:1; border-left:1px solid var(--border-color); padding-left:20px;">
                        <p><strong>Total:</strong> ₹${e.total_amount}</p>
                        <p><strong>Status:</strong> <span class="status-badge status-${e.status}">${e.status.toUpperCase()}</span></p>
                        <p><strong>Payment:</strong> <span class="status-badge">${e.payment_method?.toUpperCase()} | ${e.payment_status||`Pending`}</span></p>
                    </div>
                </div>
            </div>
        `).join(``)}catch{e.innerHTML=`<p style="color:red;">Error loading orders.</p>`}}document.addEventListener(`DOMContentLoaded`,()=>{let t=setInterval(async()=>{if(window.supabaseClient){clearInterval(t);let{data:{session:n}}=await window.supabaseClient.auth.getSession();if(n){let{data:e}=await window.supabaseClient.from(`profiles`).select(`*`).eq(`id`,n.user.id).single();e&&e.role===`customer`&&(state.user={id:n.user.id,name:(e.first_name||``)+` `+(e.last_name||``),email:n.user.email,avatar:`https://ui-avatars.com/api/?name=`+encodeURIComponent(e.first_name||n.user.email)+`&background=d4af37&color=000`})}let{data:r,error:i}=await window.supabaseClient.from(`products`).select(`*`).eq(`is_active`,!0);r&&!i&&(products=r.map(e=>({...e,image:e.image_url||`https://via.placeholder.com/300`}))),e()}},100)}),window.navigate=s,window.toggleSearch=C,window.handleSearch=w,window.addToCart=c,window.buyNow=l,window.checkoutCart=u,window.removeFromCart=d,window.toggleWishlist=f,window.handleLogin=p,window.handleLogout=g,window.handleRegister=y,window.handleVerifyOTP=b,window.editMobileNumber=x,window.toggleDropdown=h,window.viewProduct=T,window.loadMyOrders=D;