import"./supabase-init-DwNNH3oa.js";if(window.location.pathname.startsWith(`/admin`)&&!window.location.pathname.includes(`.html`))throw sessionStorage.setItem(`admin_intended_path`,window.location.pathname),window.location.href=`/admin/index.html`,Error(`Admin Route Intercepted - Redirecting to real file`);var e=[],t={cart:[],wishlist:[],user:null,currentPage:`home`,searchQuery:``,filters:{category:`All`,gender:`All`,price:`All`,color:`All`},checkoutItems:null};function n(){let e=document.getElementById(`main-content`);switch(e.innerHTML=``,window.scrollTo(0,0),t.currentPage){case`home`:e.innerHTML=r();break;case`shop`:e.innerHTML=i();break;case`cart`:e.innerHTML=o();break;case`wishlist`:e.innerHTML=s();break;case`login`:e.innerHTML=c();break;case`register`:e.innerHTML=x();break;case`checkout`:e.innerHTML=renderCheckout();break;case`order-success`:e.innerHTML=renderOrderSuccess();break;case`my-orders`:e.innerHTML=renderMyOrders();break;case`dashboard`:e.innerHTML=T();break;case`product`:e.innerHTML=k();break;default:e.innerHTML=r()}_()}function r(){return`
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
                    ${e.slice(0,3).map(e=>l(e)).join(``)}
                </div>
            </div>
        </section>
    `}function i(){return`
        <section class="section">
            <div class="page-container">
                <div class="shop-layout">
                    <aside class="filters-sidebar">
                        <button class="filter-toggle-btn" onclick="toggleFilters(this)">
                            <span><i class="fa-solid fa-sliders"></i> Filters</span>
                            <i class="fa-solid fa-chevron-down"></i>
                        </button>
                        <div class="filters-collapsible">
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
                        </div>
                    </aside>
                    <div class="shop-content">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:10px;">
                            <h2 class="title-md">Collection</h2>
                            <select class="shop-sort-select">
                                <option>Sort: Newest</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                            </select>
                        </div>
                        <div class="grid">
                            ${e.map(e=>l(e)).join(``)}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `}function a(e){let t=e.closest(`.filters-sidebar`).querySelector(`.filters-collapsible`),n=e.querySelector(`.fa-chevron-down`);t.classList.toggle(`open`),n&&(n.style.transform=t.classList.contains(`open`)?`rotate(180deg)`:``)}window.toggleFilters=a;function o(){if(t.cart.length===0)return`
            <section class="section page-container" style="text-align:center; padding-top:80px;">
                <h2 class="title-lg">Your Cart is Empty</h2>
                <p style="margin:20px 0; color:var(--text-muted);">Explore our collection to find your perfect timepiece.</p>
                <button class="btn-primary" onclick="navigate('shop')">Continue Shopping</button>
            </section>
        `;let e=t.cart.reduce((e,t)=>e+t.price*t.quantity,0);return`
        <section class="section page-container">
            <h2 class="title-lg" style="margin-bottom:30px;">Shopping Cart</h2>
            <div class="cart-layout">
                <div>
                    ${t.cart.map(e=>`
                        <div class="cart-item">
                            <img src="${e.image}" class="cart-item-img" alt="${e.name}">
                            <div class="cart-item-details">
                                <h4>${e.name}</h4>
                                <p style="color:var(--gold); margin:5px 0;">₹${e.price.toLocaleString(`en-IN`)}</p>
                                <p style="color:var(--text-muted);">Qty: ${e.quantity}</p>
                                <button style="color:#ff4444; margin-top:10px; background:none; border:none; cursor:pointer;" onclick="removeFromCart('${e.id}')">Remove</button>
                            </div>
                        </div>
                    `).join(``)}
                </div>
                <div class="cart-summary-box">
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
                    <button class="btn-primary" style="width:100%;" onclick="checkoutCart()">Proceed to Checkout</button>
                </div>
            </div>
        </section>
    `}function s(){return t.wishlist.length===0?`
            <section class="section page-container" style="text-align:center; padding-top:100px;">
                <h2 class="title-lg">Your Wishlist is Empty</h2>
                <p style="margin:20px 0; color:var(--text-muted);">Save items you love here.</p>
                <button class="btn-primary" onclick="navigate('shop')">Explore Collection</button>
            </section>
        `:`
        <section class="section page-container">
            <h2 class="title-lg" style="margin-bottom:30px;">Your Wishlist</h2>
            <div class="grid">
                ${t.wishlist.map(t=>l(e.find(e=>e.id===t))).join(``)}
            </div>
        </section>
    `}function c(){return`
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
    `}function l(e){let n=t.wishlist.includes(e.id);return`
        <div class="product-card">
            <button class="wishlist-btn ${n?`active`:``}" onclick="toggleWishlist('${e.id}', event)">
                <i class="${n?`fa-solid`:`fa-regular`} fa-heart"></i>
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
    `}function u(e){t.currentPage=e,n()}function d(n){let r=e.find(e=>e.id===n),i=t.cart.find(e=>e.id===n);i?i.quantity+=1:t.cart.push({...r,quantity:1}),_(),alert(r.name+` added to cart!`)}function f(n){if(!t.user){alert(`Please login to place an order.`),u(`login`);return}t.checkoutItems=[{...e.find(e=>e.id===n),quantity:1}],u(`checkout`)}function p(){if(!t.user){alert(`Please login to checkout.`),u(`login`);return}t.cart.length!==0&&(t.checkoutItems=[...t.cart],u(`checkout`))}function m(e){t.cart=t.cart.filter(t=>t.id!==e),t.currentPage===`cart`&&n(),_()}function h(e,r){r&&r.stopPropagation();let i=t.wishlist.indexOf(e);i>-1?t.wishlist.splice(i,1):t.wishlist.push(e),n()}async function g(){let e=document.getElementById(`login-email`).value.trim(),n=document.getElementById(`login-password`).value;if(!e||!n){alert(`Please enter both email and password.`);return}let r=document.getElementById(`btn-login`),i=r.innerHTML;r.innerHTML=`<i class="fa-solid fa-circle-notch fa-spin"></i> Logging in...`,r.disabled=!0;try{let{data:r,error:i}=await window.supabaseClient.auth.signInWithPassword({email:e,password:n});if(i)throw i;let{data:a}=await window.supabaseClient.from(`profiles`).select(`*`).eq(`id`,r.user.id).single();t.user={id:r.user.id,name:(a?.first_name||``)+` `+(a?.last_name||``),email:r.user.email,avatar:`https://ui-avatars.com/api/?name=`+encodeURIComponent(a?.first_name||r.user.email)+`&background=d4af37&color=000`},u(`home`)}catch(e){alert(e.message)}finally{r.innerHTML=i,r.disabled=!1}}function _(){let e=t.cart.reduce((e,t)=>e+t.quantity,0);document.getElementById(`cart-count`).innerText=e;let n=document.getElementById(`auth-btn-group`);if(n){if(t.user){n.onclick=null,n.innerHTML=`
            <div class="profile-dropdown-container" onclick="toggleDropdown(event)">
                <img src="${t.user.avatar}" alt="User" class="nav-avatar">
                <div class="profile-dropdown" id="profile-dropdown">
                    <div class="dropdown-header">
                        <img src="${t.user.avatar}" alt="User" class="dropdown-avatar">
                        <div class="dropdown-user-info">
                            <span class="dropdown-name">${t.user.name}</span>
                            <span class="dropdown-email">${t.user.email}</span>
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
            <a href="/admin/index.html" class="login-text" style="text-decoration:none; color:var(--text-muted); margin-left:15px;">Admin</a>
        `;let e=document.getElementById(`mobile-nav-actions`);e&&(e.innerHTML=`
                <a href="#" onclick="navigate('dashboard'); closeMobileNav(); return false;"><i class="fa-regular fa-user"></i> My Profile (${t.user.name.split(` `)[0]})</a>
                <a href="#" onclick="navigate('my-orders'); closeMobileNav(); return false;"><i class="fa-solid fa-box"></i> My Orders</a>
                <a href="#" onclick="navigate('wishlist'); closeMobileNav(); return false;"><i class="fa-regular fa-heart"></i> Wishlist</a>
                <a href="/admin/index.html" style="color:var(--text-muted);" onclick="closeMobileNav()"><i class="fa-solid fa-lock"></i> Admin Panel</a>
                <a href="#" onclick="handleLogout(); closeMobileNav(); return false;" style="color:#ff6666;"><i class="fa-solid fa-arrow-right-from-bracket"></i> Logout</a>
            `)}else{n.onclick=null,n.innerHTML=`
            <!-- Desktop Auth Links -->
            <a href="#" onclick="navigate('login'); return false;" class="login-text" style="text-decoration:none; color:inherit;">Login</a>
            <a href="#" onclick="navigate('register'); return false;" class="login-text" style="text-decoration:none; color:inherit;">Sign Up</a>
            <a href="/admin/index.html" class="login-text" style="text-decoration:none; color:var(--text-muted);">Admin</a>
            
            <!-- Mobile fallback icon -->
            <i class="fa-regular fa-user login-icon-mobile" onclick="navigate('login')" style="cursor:pointer;"></i>
        `;let e=document.getElementById(`mobile-nav-actions`);e&&(e.innerHTML=`
                <a href="#" onclick="navigate('login'); closeMobileNav(); return false;">Login</a>
                <a href="#" onclick="navigate('register'); closeMobileNav(); return false;">Sign Up</a>
                <a href="/admin/index.html" style="color:var(--text-muted);" onclick="closeMobileNav()">Admin Panel</a>
            `)}}}function v(e){e.stopPropagation();let t=document.getElementById(`profile-dropdown`);t&&t.classList.toggle(`show`)}async function y(){window.supabaseClient&&await window.supabaseClient.auth.signOut(),t.user=null,u(`home`)}document.addEventListener(`click`,function(e){let t=document.getElementById(`profile-dropdown`);t&&t.classList.contains(`show`)&&t.classList.remove(`show`)});var b;function x(){return`
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
                    <div class="address-row">
                        <div class="form-group">
                            <input type="text" id="reg-city" placeholder="City" required>
                        </div>
                        <div class="form-group">
                            <input type="text" id="reg-state" placeholder="State" required>
                        </div>
                        <div class="form-group">
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
    `}async function S(){let e=document.getElementById(`reg-name`).value.trim(),t=document.getElementById(`reg-mobile`).value.trim(),n=document.getElementById(`reg-email`).value.trim(),r=document.getElementById(`reg-password`).value,i=document.getElementById(`reg-address`).value.trim(),a=document.getElementById(`reg-city`).value.trim(),o=document.getElementById(`reg-state`).value.trim(),s=document.getElementById(`reg-pin`).value.trim();if(!e||!t||!n||!r||!i||!a||!o||!s){alert(`Please fill in all required fields.`);return}if(e.length<2||/^[0-9]+$/.test(e)||/^[^a-zA-Z0-9]+$/.test(e)){alert(`Please enter a valid full name.`);return}if(!/^[6-9]\d{9}$/.test(t)){alert(`Please enter a valid 10-digit Indian mobile number.`);return}if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(n)){alert(`Please enter a valid email address.`);return}if(!/^\d{6}$/.test(s)){alert(`Please enter a valid 6-digit PIN code.`);return}let c=document.getElementById(`btn-register`),l=c.innerHTML;c.innerHTML=`<i class="fa-solid fa-circle-notch fa-spin"></i> Creating Account...`,c.disabled=!0;try{if(!window.supabaseClient)throw Error(`Database connection not established. Please try again later.`);let{data:c,error:l}=await window.supabaseClient.auth.signUp({email:n,password:r,options:{data:{first_name:e.split(` `)[0],last_name:e.split(` `).slice(1).join(` `),phone:t,address_street:i,address_city:a,address_state:o,address_pin:s}}});if(l)throw l;if(c.user&&c.user.identities&&c.user.identities.length===0)throw Error(`An account with this email already exists. Please sign in.`);document.getElementById(`registration-form`).style.display=`none`,document.getElementById(`verification-message`).style.display=`block`}catch(e){alert(e.message),c.innerHTML=l,c.disabled=!1}}function C(){let e=document.getElementById(`reg-otp`).value,n=document.getElementById(`btn-verify-otp`);if(!e){alert(`Please enter the OTP.`);return}n.innerHTML=`<i class="fa-solid fa-circle-notch fa-spin"></i> Verifying...`,n.disabled=!0,setTimeout(()=>{if(!t.currentOTP||Date.now()>t.otpExpiry){alert(`OTP has expired. Please click Resend OTP to get a new one.`),n.innerHTML=`Verify & Create Account`,n.disabled=!1;return}if(e===t.currentOTP){clearInterval(b);let e={id:`USER_`+Math.random().toString(36).substr(2,9).toUpperCase(),...t.pendingRegistration,avatar:`https://ui-avatars.com/api/?name=`+encodeURIComponent(t.pendingRegistration.name)+`&background=d4af37&color=000`,createdAt:new Date().toISOString()},n=JSON.parse(localStorage.getItem(`aether_users`)||`[]`);n.push(e),localStorage.setItem(`aether_users`,JSON.stringify(n)),t.user=e,t.currentOTP=null,t.pendingRegistration=null,alert(`Account verified and created successfully!`),u(`dashboard`)}else alert(`Incorrect OTP. Please check the code and try again.`),n.innerHTML=`Verify & Create Account`,n.disabled=!1},800)}function w(){clearInterval(b),document.getElementById(`otp-verification`).style.display=`none`,document.getElementById(`registration-form`).style.display=`block`}function T(){return t.user?`
        <section class="section page-container">
            <h2 class="title-lg" style="margin-bottom:30px;">My Dashboard</h2>
            <div class="dashboard-layout">
                <aside class="dashboard-sidebar">
                    <div style="text-align:center; padding-bottom:20px; border-bottom:1px solid var(--border-color); margin-bottom:20px;">
                        <img src="${t.user.avatar}" style="width:90px; height:90px; border-radius:50%; border:2px solid var(--gold); margin-bottom:15px; object-fit:cover;">
                        <h3 style="font-size:1.1rem; word-break:break-word;">${t.user.name}</h3>
                        <p style="color:var(--text-muted); font-size:0.85rem; word-break:break-all;">${t.user.email||``}</p>
                    </div>
                    <div class="filter-group">
                        <label style="color:var(--gold); cursor:default;"><i class="fa-regular fa-user" style="width:20px;"></i> My Profile</label>
                        <label onclick="navigate('my-orders')" style="cursor:pointer;"><i class="fa-solid fa-box" style="width:20px;"></i> My Orders</label>
                        <label onclick="navigate('wishlist')" style="cursor:pointer;"><i class="fa-regular fa-heart" style="width:20px;"></i> Wishlist</label>
                        <label onclick="handleLogout()" style="cursor:pointer; color:#ff6666;"><i class="fa-solid fa-arrow-right-from-bracket" style="width:20px;"></i> Logout</label>
                    </div>
                </aside>
                
                <div style="background:var(--card-bg); padding:30px; border:1px solid var(--border-color); border-radius:8px;">
                    <h2 class="title-md" style="margin-bottom:30px; border-bottom:1px solid var(--border-color); padding-bottom:15px;">Personal Information</h2>
                    
                    <div class="dashboard-info-grid">
                        <div>
                            <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:5px;">Full Name</p>
                            <p style="font-size:1.05rem; word-break:break-word;">${t.user.name}</p>
                        </div>
                        <div>
                            <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:5px;">Mobile Number</p>
                            <p style="font-size:1.05rem;">${t.user.mobile||`N/A`}</p>
                        </div>
                        <div>
                            <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:5px;">Email Address</p>
                            <p style="font-size:1.05rem; word-break:break-all;">${t.user.email||`N/A`}</p>
                        </div>
                        <div>
                            <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:5px;">User ID</p>
                            <p style="font-size:0.9rem; font-family:monospace; color:var(--gold); word-break:break-all;">${t.user.id}</p>
                        </div>
                    </div>
                    
                    <h2 class="title-md" style="margin-bottom:20px; border-bottom:1px solid var(--border-color); padding-bottom:15px; margin-top:40px;">Shipping Address</h2>
                    
                    <div class="dashboard-info-grid">
                        <div style="grid-column: 1 / -1;">
                            <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:5px;">Complete Address</p>
                            <p style="font-size:1.05rem;">${t.user.address||`N/A`}</p>
                        </div>
                        <div>
                            <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:5px;">City</p>
                            <p style="font-size:1.05rem;">${t.user.city||`N/A`}</p>
                        </div>
                        <div>
                            <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:5px;">State &amp; PIN</p>
                            <p style="font-size:1.05rem;">${(t.user.state||``)+(t.user.pin?` - `+t.user.pin:``)||`N/A`}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `:(setTimeout(()=>u(`login`),0),``)}function E(){let e=document.getElementById(`search-overlay`);if(e){if(e.classList.toggle(`active`),e.classList.contains(`active`)){let e=document.getElementById(`search-input`);e&&(e.value=``,e.focus());let t=document.getElementById(`search-results`);t&&(t.innerHTML=``),document.body.style.overflow=`hidden`}else document.body.style.overflow=`auto`}}function D(t){let n=t.target.value.toLowerCase().trim(),r=document.getElementById(`search-results`);if(n.length===0){r.innerHTML=``;return}let i=e.filter(e=>e.name.toLowerCase().includes(n)||e.category.toLowerCase().includes(n)||e.style.toLowerCase().includes(n));r.innerHTML=i.length===0?`<div class="search-no-results">No watches found.</div>`:i.map(e=>`
            <div class="search-result-item">
                <img src="${e.image}" class="search-result-img" alt="${e.name}">
                <div class="search-result-info">
                    <div class="search-result-title">${e.name}</div>
                    <div class="search-result-price">₹${e.price.toLocaleString(`en-IN`)}</div>
                </div>
                <button class="btn-outline" onclick="viewProduct('${e.id}')">View Product</button>
            </div>
        `).join(``)}function O(n){E(),t.currentProduct=e.find(e=>e.id===n),u(`product`)}function k(){if(!t.currentProduct)return setTimeout(()=>u(`shop`),0),``;let e=t.currentProduct;return`
        <section class="section page-container">
            <div class="product-detail-layout">
                <div class="product-detail-img-box">
                    <img src="${e.image}" alt="${e.name}">
                </div>
                <div>
                    <h2 class="title-lg" style="margin-bottom: 10px;">${e.name}</h2>
                    <p style="color: var(--text-muted); margin-bottom: 20px;">Category: ${e.category} | Style: ${e.style}</p>
                    
                    <div style="font-size: clamp(1.5rem, 3vw, 2rem); color: var(--gold); margin-bottom: 30px; font-family:var(--font-heading);">
                        ₹${e.price.toLocaleString(`en-IN`)}
                    </div>
                    
                    <p style="color: var(--text-muted); line-height: 1.8; margin-bottom: 30px;">
                        An exquisite piece of craftsmanship, the ${e.name} embodies the pinnacle of luxury watchmaking. 
                        Designed for those who appreciate the finer things in life, featuring a beautiful ${e.strap} strap.
                    </p>
                    
                    <div class="product-detail-actions">
                        <button class="btn-primary" onclick="addToCart('${e.id}')">
                            <i class="fa-solid fa-cart-plus"></i> Add to Cart
                        </button>
                        <button class="btn-primary" onclick="buyNow('${e.id}')">
                            <i class="fa-solid fa-bolt"></i> Buy Now
                        </button>
                    </div>
                    <div style="margin-bottom: 30px;">
                        <button class="btn-outline" style="width:100%; padding:15px;" onclick="toggleWishlist('${e.id}', event)">
                            <i class="${t.wishlist.includes(e.id)?`fa-solid`:`fa-regular`} fa-heart"></i> 
                            ${t.wishlist.includes(e.id)?`Saved to Wishlist`:`Add to Wishlist`}
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
    `}window.renderCheckout=function(){if(!t.user)return u(`login`),``;let e=t.checkoutItems||[];if(e.length===0)return`<section class="section page-container"><h2 class="title-lg">No items to checkout</h2><button class="btn-primary" onclick="navigate('shop')">Shop</button></section>`;let n=e.reduce((e,t)=>e+t.price*t.quantity,0),r=n+0;return`
        <section class="section page-container">
            <h2 class="title-lg" style="margin-bottom:30px;">Checkout</h2>
            <div class="checkout-layout">
                <div>
                    <h3 style="margin-bottom:20px;">Delivery Details</h3>
                    <form id="checkout-form" onsubmit="handlePlaceOrder(event)">
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" id="chk-name" required value="${t.user.user_metadata?.first_name||``} ${t.user.user_metadata?.last_name||``}">
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="chk-email" required value="${t.user.email||``}">
                        </div>
                        <div class="form-group">
                            <label>Phone Number (10 digits)</label>
                            <input type="tel" id="chk-phone" pattern="[0-9]{10}" required value="${t.user.user_metadata?.phone||``}">
                        </div>
                        <div class="form-group">
                            <label>Complete Address</label>
                            <input type="text" id="chk-address" required value="${t.user.user_metadata?.address_street||``}">
                        </div>
                        <div class="address-row">
                            <div class="form-group">
                                <label>City</label>
                                <input type="text" id="chk-city" required value="${t.user.user_metadata?.address_city||``}">
                            </div>
                            <div class="form-group">
                                <label>State</label>
                                <input type="text" id="chk-state" required value="${t.user.user_metadata?.address_state||``}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>PIN Code</label>
                            <input type="text" id="chk-pin" pattern="[0-9]{6}" required value="${t.user.user_metadata?.address_pin||``}">
                        </div>
                        
                        <h3 style="margin-top:30px; margin-bottom:15px;">Payment Method</h3>
                        <div class="form-group">
                            <label style="display:block; margin-bottom:12px; color:var(--text-main);"><input type="radio" name="payment_method" value="razorpay" required style="margin-right:8px;"> Razorpay (Credit/Debit/Netbanking)</label>
                            <label style="display:block; margin-bottom:12px; color:var(--text-main);"><input type="radio" name="payment_method" value="cashfree" required style="margin-right:8px;"> Cashfree Payments</label>
                            <label style="display:block; margin-bottom:12px; color:var(--text-main);"><input type="radio" name="payment_method" value="cod" required checked style="margin-right:8px;"> Cash on Delivery (COD)</label>
                        </div>
                        
                        <button type="submit" class="btn-primary" style="width:100%; margin-top:20px; font-size:1.1rem; padding:15px;" id="btn-place-order">Place Order</button>
                    </form>
                </div>
                
                <div class="checkout-summary-box">
                    <h3 style="margin-bottom:20px; font-family:var(--font-heading);">Order Summary</h3>
                    ${e.map(e=>`
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid var(--border-color); padding-bottom:15px; gap:10px;">
                            <div style="display:flex; gap:10px; align-items:center; flex:1; min-width:0;">
                                <img src="${e.image_url||e.image}" style="width:50px; height:50px; object-fit:cover; flex-shrink:0;">
                                <div style="min-width:0;">
                                    <div style="font-weight:bold; word-break:break-word; font-size:0.9rem;">${e.name}</div>
                                    <div style="font-size:0.8rem; color:var(--text-muted);">Qty: ${e.quantity}</div>
                                </div>
                            </div>
                            <div style="flex-shrink:0;">₹${(e.price*e.quantity).toLocaleString(`en-IN`)}</div>
                        </div>
                    `).join(``)}
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                        <span>Subtotal</span>
                        <span>₹${n.toLocaleString(`en-IN`)}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:20px;">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:1.2rem; border-top:1px solid var(--border-color); padding-top:20px;">
                        <span>Total</span>
                        <span>₹${r.toLocaleString(`en-IN`)}</span>
                    </div>
                </div>
            </div>
        </section>
    `},window.handlePlaceOrder=async function(e){e.preventDefault();let n=document.getElementById(`btn-place-order`);n.innerText=`Processing...`,n.disabled=!0;try{let{data:e}=await window.supabaseClient.auth.getSession();if(!e||!e.session){alert(`Please login before placing your order.`),n.innerHTML=`Place Order`,n.disabled=!1;return}let r=document.getElementById(`chk-name`).value.trim(),i=document.getElementById(`chk-email`).value.trim(),a=document.getElementById(`chk-phone`).value.trim(),o=document.getElementById(`chk-address`).value.trim(),s=document.getElementById(`chk-city`).value.trim(),c=document.getElementById(`chk-state`).value.trim(),l=document.getElementById(`chk-pin`).value.trim();if(!r||!i||!a||!o||!s||!c||!l)throw Error(`Please fill in all required fields.`);if(!/^[6-9]\d{9}$/.test(a))throw Error(`Please enter a valid 10-digit Indian mobile number.`);if(!/^\d{6}$/.test(l))throw Error(`Please enter a valid 6-digit PIN code.`);let d={customer_name:r,customer_email:i,customer_phone:a,shipping_address:o,city:s,state:c,pincode:l,payment_method:document.querySelector(`input[name="payment_method"]:checked`).value,items:t.checkoutItems,subtotal:t.checkoutItems.reduce((e,t)=>e+t.price*t.quantity,0)},f=await fetch(`/api/payment/create-order`,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer ${e.session.access_token}`},body:JSON.stringify(d)}),p={},m=await f.text();if(m)try{p=JSON.parse(m)}catch{console.error(`Failed to parse backend response:`,m)}if(!f.ok)throw console.error(`ORDER CREATION ERROR (Backend):`,p.error||m),Error(p.error||p.message||`Unknown server error during order creation. Check backend logs.`);if(d.payment_method===`cod`)t.cart=[],t.lastOrder=p.order,u(`order-success`);else if(d.payment_method===`razorpay`){window.Razorpay||await new Promise(e=>{let t=document.createElement(`script`);t.src=`https://checkout.razorpay.com/v1/checkout.js`,t.onload=e,document.head.appendChild(t)});let e={key:p.key,amount:p.amount,currency:`INR`,name:`AETHER Watches`,description:`Purchase Order`,order_id:p.gateway_order_id,handler:async function(e){(await(await fetch(`/api/payment/verify/razorpay`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({order_id:p.order.id,razorpay_payment_id:e.razorpay_payment_id,razorpay_order_id:e.razorpay_order_id,razorpay_signature:e.razorpay_signature})})).json()).success?(t.cart=[],t.lastOrder=p.order,u(`order-success`)):alert(`Payment verification failed.`)},prefill:{name:d.customer_name,email:d.customer_email,contact:d.customer_phone},theme:{color:`#d4af37`}},n=new window.Razorpay(e);n.on(`payment.failed`,function(e){alert(`Payment Failed: `+e.error.description)}),n.open()}else if(d.payment_method===`cashfree`){window.Cashfree||await new Promise(e=>{let t=document.createElement(`script`);t.src=`https://sdk.cashfree.com/js/v3/cashfree.js`,t.onload=e,document.head.appendChild(t)});let e=window.Cashfree({mode:p.mode}),r={paymentSessionId:p.payment_session_id,redirectTarget:`_modal`};e.checkout(r).then(e=>{e.error&&(alert(`Payment Error: `+e.error.message),n.innerText=`Place Order`,n.disabled=!1),e.paymentDetails&&fetch(`/api/payment/verify/cashfree`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({order_id:p.order.id})}).then(e=>e.json()).then(e=>{e.success?(t.cart=[],t.lastOrder=p.order,u(`order-success`)):(alert(`Payment verification failed or pending.`),n.innerText=`Place Order`,n.disabled=!1)})})}}catch(e){alert(e.message),n.innerText=`Place Order`,n.disabled=!1}},window.renderOrderSuccess=function(){return`
        <section class="section page-container" style="text-align:center; padding-top:100px;">
            <i class="fa-solid fa-circle-check" style="font-size:4rem; color:var(--gold); margin-bottom:20px;"></i>
            <h2 class="title-lg">Order Confirmed!</h2>
            <p style="margin:20px 0; color:var(--text-muted);">Thank you for shopping with AETHER. Your order #${t.lastOrder?.order_number||t.lastOrder?.id?.split(`-`)[0]||``} has been placed successfully.</p>
            <button class="btn-primary" onclick="navigate('my-orders')">View My Orders</button>
        </section>
    `},window.renderMyOrders=function(){return setTimeout(A,0),`
        <section class="section page-container">
            <h2 class="title-lg" style="margin-bottom:30px;">My Orders</h2>
            <div id="my-orders-container">Loading your orders...</div>
        </section>
    `};async function A(){let e=document.getElementById(`my-orders-container`);if(e)try{let n=await(await fetch(`/api/user/orders`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({user_id:t.user.id})})).json();if(!n||n.length===0){e.innerHTML=`<p>You have no past orders.</p>`;return}e.innerHTML=n.map(e=>`
            <div style="background:var(--card-bg); padding:20px; border:1px solid var(--border-color); margin-bottom:20px; border-radius:4px;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:10px; margin-bottom:15px; flex-wrap:wrap; gap:5px;">
                    <div><strong>Order #${e.order_number||e.id.split(`-`)[0]}</strong></div>
                    <div style="color:var(--text-muted); font-size:0.9rem;">${new Date(e.created_at).toLocaleDateString()}</div>
                </div>
                <div class="order-row">
                    <div class="order-items-col">
                        ${e.order_items.map(e=>`
                            <div style="display:flex; gap:10px; margin-bottom:10px; align-items:center;">
                                <img src="${e.product_image||`https://via.placeholder.com/50`}" style="width:50px; height:50px; object-fit:cover; flex-shrink:0;">
                                <div style="min-width:0;">
                                    <div style="word-break:break-word;">${e.product_name||`Product`}</div>
                                    <div style="font-size:0.8rem; color:var(--text-muted);">Qty: ${e.quantity} | ₹${e.unit_price}</div>
                                </div>
                            </div>
                        `).join(``)}
                    </div>
                    <div class="order-status-col">
                        <p style="margin-bottom:8px;"><strong>Total:</strong> ₹${e.total_amount}</p>
                        <p style="margin-bottom:8px;"><strong>Status:</strong> <span class="status-badge status-${e.status}">${e.status.toUpperCase()}</span></p>
                        <p><strong>Payment:</strong> <span class="status-badge">${e.payment_method?.toUpperCase()} | ${e.payment_status||`Pending`}</span></p>
                    </div>
                </div>
            </div>
        `).join(``)}catch{e.innerHTML=`<p style="color:red;">Error loading orders.</p>`}}document.addEventListener(`DOMContentLoaded`,()=>{let r=!1,i=setTimeout(()=>{r||(r=!0,console.warn(`Supabase init timeout — rendering page without data`),n())},3e3),a=setInterval(async()=>{if(window.supabaseClient){clearInterval(a);try{let e=(await window.supabaseClient.auth.getSession())?.data?.session||null;if(e)try{let{data:n}=await window.supabaseClient.from(`profiles`).select(`*`).eq(`id`,e.user.id).single();n&&n.role===`customer`&&(t.user={id:e.user.id,name:(n.first_name||``)+` `+(n.last_name||``),email:e.user.email,avatar:`https://ui-avatars.com/api/?name=`+encodeURIComponent(n.first_name||e.user.email)+`&background=d4af37&color=000`})}catch(e){console.warn(`Could not load user profile:`,e.message)}}catch(e){console.warn(`Could not check auth session:`,e.message)}try{let{data:t,error:n}=await window.supabaseClient.from(`products`).select(`*`).eq(`is_active`,!0);t&&!n?e=t.map(e=>({...e,image:e.image_url||`https://via.placeholder.com/300`})):n&&console.warn(`Could not fetch products:`,n.message)}catch(e){console.warn(`Products fetch failed:`,e.message)}r||(r=!0,clearTimeout(i),n())}},100)}),window.navigate=u,window.toggleSearch=E,window.handleSearch=D,window.addToCart=d,window.buyNow=f,window.checkoutCart=p,window.removeFromCart=m,window.toggleWishlist=h,window.handleLogin=g,window.handleLogout=y,window.handleRegister=S,window.handleVerifyOTP=C,window.editMobileNumber=w,window.toggleDropdown=v,window.viewProduct=O,window.loadMyOrders=A;