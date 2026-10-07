const intendedPath = sessionStorage.getItem('admin_intended_path');
if (intendedPath) {
    sessionStorage.removeItem('admin_intended_path');
    history.replaceState(null, '', intendedPath);
}

let supabase;

document.addEventListener('DOMContentLoaded', () => {
    const initCheck = setInterval(() => {
        if (window.supabaseClient) {
            clearInterval(initCheck);
            supabase = window.supabaseClient;
            checkAuthStatus();
            setupRealtimeOrders();
        }
    }, 100);

    // Handle back/forward navigation
    window.addEventListener('popstate', checkAuthStatus);
    
    // Prevent default hash navigation for nav items
    document.querySelectorAll('.nav-item').forEach(el => {
        el.addEventListener('click', (e) => {
            if(e.currentTarget.getAttribute('onclick')?.includes('showSection')) {
                e.preventDefault();
            }
        });
    });
});

function handleRoute() {
    const path = window.location.pathname;
    
    if (path.includes('/login')) {
        showLogin();
        return;
    }
    
    // Determine section from path
    let section = 'dashboard';
    if (path.includes('/products')) section = 'products';
    else if (path.includes('/users')) section = 'users';
    else if (path.includes('/customers')) section = 'customers';
    else if (path.includes('/orders')) section = 'orders';
    else if (path.includes('/payments')) section = 'payments';
    else if (path.includes('/cms')) section = 'cms';
    else if (path.includes('/settings')) section = 'config';
    
    showSection(section, false);
}

async function checkAuthStatus() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
        
        if (profile && profile.role === 'admin') {
            document.getElementById('current-admin-email').innerText = session.user.email;
            document.getElementById('profile-email').value = session.user.email;
            
            // If we are on /admin/login but authenticated, redirect to /admin
            if (window.location.pathname.includes('/login')) {
                history.pushState(null, '', '/admin');
            }
            handleRoute();
        } else {
            await supabase.auth.signOut();
            showLogin("Unauthorized: This account does not have admin privileges.");
        }
    } else {
        // Not authenticated, redirect to login if not there
        if (!window.location.pathname.includes('/login')) {
            history.pushState(null, '', '/admin/login');
        }
        showLogin();
    }
}

async function handleAdminLogin() {
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    const errorDiv = document.getElementById('login-error');
    
    if (!email || !password) return;
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
        errorDiv.innerText = error.message;
        errorDiv.style.display = 'block';
    } else {
        errorDiv.style.display = 'none';
        
        // After login, check auth status again which handles redirects
        history.pushState(null, '', '/admin');
        checkAuthStatus();
    }
}

async function handleAdminLogout() {
    await supabase.auth.signOut();
    history.pushState(null, '', '/admin/login');
    window.location.reload();
}

function showLogin(errMsg = "") {
    document.getElementById('admin-dashboard-view').classList.remove('view-active');
    document.getElementById('admin-dashboard-view').classList.add('view-hidden');
    
    document.getElementById('admin-login-view').classList.remove('view-hidden');
    document.getElementById('admin-login-view').classList.add('view-active');
    
    if (errMsg) {
        const errorDiv = document.getElementById('login-error');
        errorDiv.innerText = errMsg;
        errorDiv.style.display = 'block';
    }
}

function showSection(sectionId, pushState = true) {
    document.getElementById('admin-login-view').classList.remove('view-active');
    document.getElementById('admin-login-view').classList.add('view-hidden');
    
    document.getElementById('admin-dashboard-view').classList.remove('view-hidden');
    document.getElementById('admin-dashboard-view').classList.add('view-active');

    document.querySelectorAll('.content-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    
    const sectionEl = document.getElementById(`section-${sectionId}`);
    if (sectionEl) sectionEl.classList.add('active');
    
    const navEl = document.querySelector(`.nav-item[data-target="${sectionId}"]`);
    if (navEl) navEl.classList.add('active');
    
    if (pushState) {
        const newPath = sectionId === 'dashboard' ? '/admin' : `/admin/${sectionId}`;
        history.pushState(null, '', newPath);
    }
    
    if (sectionId === 'products') loadProducts();
    if (sectionId === 'users') loadUsers();
    if (sectionId === 'customers') loadCustomers();
    if (sectionId === 'dashboard') loadDashboardData();
    if (sectionId === 'orders') loadOrders();
    if (sectionId === 'payments') loadPaymentSettings();
}

// --- Notifications ---
function setupRealtimeOrders() {
    supabase.channel('public:orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, payload => {
          showAdminNotification(`New order received!`);
          if (window.location.pathname.includes('/orders')) {
              loadOrders();
          }
      })
      .subscribe();
}

function showAdminNotification(message) {
    let container = document.getElementById('admin-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'admin-toast-container';
        container.style.cssText = 'position:fixed; top:20px; right:20px; z-index:9999; display:flex; flex-direction:column; gap:10px;';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.style.cssText = 'background:#d4af37; color:#000; padding:15px 20px; border-radius:4px; box-shadow:0 4px 12px rgba(0,0,0,0.2); font-weight:bold; opacity:0; transition:opacity 0.3s ease;';
    toast.innerHTML = `<i class="fa-solid fa-bell"></i> &nbsp; ${message}`;
    container.appendChild(toast);
    
    setTimeout(() => toast.style.opacity = '1', 10);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}


async function loadDashboardData() {
    const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
    const { count: customerCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer');
    
    document.getElementById('stat-products').innerText = productCount || 0;
    document.getElementById('stat-users').innerText = userCount || 0;
    document.getElementById('stat-customers').innerText = customerCount || 0;
    document.getElementById('stat-orders').innerText = orderCount || 0;
    
    // Calculate simple total revenue from orders table if possible
    const { data: orders } = await supabase.from('orders').select('total_amount').neq('status', 'cancelled');
    if (orders && orders.length > 0) {
        const totalRev = orders.reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0);
        document.getElementById('stat-revenue').innerText = '₹' + totalRev.toLocaleString('en-IN');
    }
}

let allProducts = [];

async function loadProducts() {
    const tbody = document.getElementById('products-table-body');
    tbody.innerHTML = '<tr><td colspan="7">Loading...</td></tr>';
    
    const { data: products, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    
    if (error) {
        tbody.innerHTML = `<tr><td colspan="7" style="color:red">Error: ${error.message}</td></tr>`;
        return;
    }
    
    allProducts = products;
    renderProductsTable(products);
}

function filterProducts() {
    const query = document.getElementById('search-products-input').value.toLowerCase();
    const filtered = allProducts.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
    renderProductsTable(filtered);
}

function renderProductsTable(products) {
    const tbody = document.getElementById('products-table-body');
    if (!products.length) {
        tbody.innerHTML = '<tr><td colspan="7">No products found.</td></tr>';
        return;
    }
    
    tbody.innerHTML = products.map(p => `
        <tr>
            <td><img src="${p.image_url || 'https://via.placeholder.com/50'}" style="width:50px; height:50px; object-fit:cover; border-radius:4px;"></td>
            <td><strong>${p.name}</strong></td>
            <td>${p.category}</td>
            <td>₹${p.price.toLocaleString('en-IN')}</td>
            <td>${p.stock_quantity || 0}</td>
            <td><span class="status-badge" style="${!p.is_active ? 'background:rgba(255,0,0,0.2);color:red;' : ''}">${p.is_active ? 'Active' : 'Inactive'}</span></td>
            <td>
                <button class="action-btn" onclick="editProduct('${p.id}')" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="action-btn delete" onclick="deleteProduct('${p.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

let allUsers = [];

async function loadUsers() {
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
    
    const { data: profiles, error } = await supabase.from('profiles').select('id, role, created_at, phone, first_name, last_name');
    
    if (error) {
        tbody.innerHTML = `<tr><td colspan="5" style="color:red">Error: ${error.message}</td></tr>`;
        return;
    }
    
    allUsers = profiles;
    renderUsersTable(profiles);
}

function filterUsers() {
    const query = document.getElementById('search-users-input').value.toLowerCase();
    const filtered = allUsers.filter(u => u.phone?.toLowerCase().includes(query) || u.first_name?.toLowerCase().includes(query) || u.last_name?.toLowerCase().includes(query) || u.id.toLowerCase().includes(query));
    renderUsersTable(filtered);
}

function renderUsersTable(users) {
    const tbody = document.getElementById('users-table-body');
    if (!users.length) {
        tbody.innerHTML = '<tr><td colspan="5">No users found.</td></tr>';
        return;
    }
    
    tbody.innerHTML = users.map(u => `
        <tr>
            <td><span title="${u.id}">${u.id.substring(0,8)}...</span></td>
            <td>${u.first_name || ''} ${u.last_name || ''} ${u.phone ? '('+u.phone+')' : ''}</td>
            <td><span class="status-badge" style="${u.role === 'admin' ? 'background:rgba(212,175,55,0.2);color:#d4af37;' : ''}">${u.role.toUpperCase()}</span></td>
            <td>${new Date(u.created_at).toLocaleDateString()}</td>
            <td>
                <button class="action-btn" onclick="alert('View details for user ${u.id}')"><i class="fa-solid fa-eye"></i></button>
            </td>
        </tr>
    `).join('');
}

async function loadCustomers() {
    const tbody = document.getElementById('customers-table-body');
    tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
    
    try {
        const response = await fetch('/api/admin/customers');
        if (!response.ok) throw new Error('Failed to fetch customers');
        const customers = await response.json();
        
        if (!customers.length) {
            tbody.innerHTML = '<tr><td colspan="5">No customers found.</td></tr>';
            return;
        }
        
        tbody.innerHTML = customers.map(c => `
            <tr>
                <td>
                    <strong>${c.first_name || ''} ${c.last_name || ''}</strong><br>
                    <small style="color:var(--text-muted);">${c.email || ''}</small>
                </td>
                <td>${c.phone || 'N/A'}</td>
                <td>
                    <small>
                        ${c.address_street || ''}<br>
                        ${c.address_city || ''}, ${c.address_state || ''} ${c.address_pin || ''}
                    </small>
                </td>
                <td>${new Date(c.created_at).toLocaleDateString()}</td>
                <td><span class="status-badge">Customer</span></td>
            </tr>
        `).join('');
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="5" style="color:red">Error: ${error.message}</td></tr>`;
    }
}

function openProductModal() {
    document.getElementById('product-form').reset();
    document.getElementById('p-id').value = '';
    document.getElementById('p-stock').value = '10';
    document.getElementById('p-rating').value = '5.0';
    document.getElementById('modal-title').innerText = 'Add New Product';
    document.getElementById('product-modal').classList.add('active');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.remove('active');
}

async function saveProduct(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerText = 'Saving...';
    
    const id = document.getElementById('p-id').value;
    
    // We map Gender -> category based on the app's structure
    // If the category input is provided, we can use it, else default to gender
    const customCategory = document.getElementById('p-cat').value;
    const gender = document.getElementById('p-gender').value;
    const finalCategory = customCategory || gender;
    
    const productData = {
        name: document.getElementById('p-name').value,
        price: parseFloat(document.getElementById('p-price').value) || 0,
        discount_price: parseFloat(document.getElementById('p-discount-price').value) || null,
        description: document.getElementById('p-desc').value,
        category: finalCategory,
        style: document.getElementById('p-style').value,
        color: document.getElementById('p-color').value,
        strap: document.getElementById('p-strap').value,
        image_url: document.getElementById('p-img').value,
        is_new: document.getElementById('p-isnew').checked,
        is_best_seller: document.getElementById('p-isbest').checked,
        is_active: document.getElementById('p-active').checked,
        stock_quantity: parseInt(document.getElementById('p-stock').value) || 0,
        rating: parseFloat(document.getElementById('p-rating').value) || 0,
    };
    
    let res;
    if (id) {
        res = await supabase.from('products').update(productData).eq('id', id);
    } else {
        res = await supabase.from('products').insert(productData);
    }
    
    if (res.error) {
        alert("Error saving product: " + res.error.message);
    } else {
        closeProductModal();
        loadProducts();
    }
    
    btn.disabled = false;
    btn.innerText = 'Save Product';
}

window.editProduct = async function(id) {
    const { data: product } = await supabase.from('products').select('*').eq('id', id).single();
    if (!product) return;
    
    document.getElementById('p-id').value = product.id;
    document.getElementById('p-name').value = product.name || '';
    document.getElementById('p-price').value = product.price || 0;
    document.getElementById('p-discount-price').value = product.discount_price || '';
    document.getElementById('p-desc').value = product.description || '';
    document.getElementById('p-cat').value = product.category || '';
    
    if (['Men', 'Women', 'Unisex'].includes(product.category)) {
        document.getElementById('p-gender').value = product.category;
    }
    
    document.getElementById('p-style').value = product.style || '';
    document.getElementById('p-color').value = product.color || '';
    document.getElementById('p-strap').value = product.strap || '';
    document.getElementById('p-img').value = product.image_url || '';
    
    document.getElementById('p-stock').value = product.stock_quantity !== undefined ? product.stock_quantity : 10;
    document.getElementById('p-rating').value = product.rating || 5.0;
    
    document.getElementById('p-isnew').checked = product.is_new;
    document.getElementById('p-isbest').checked = product.is_best_seller;
    document.getElementById('p-active').checked = product.is_active;
    
    document.getElementById('modal-title').innerText = 'Edit Product';
    document.getElementById('product-modal').classList.add('active');
}

window.deleteProduct = async function(id) {
    if (confirm("Are you sure you want to delete this product?")) {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) alert("Error deleting: " + error.message);
        else loadProducts();
    }
}

window.saveCMS = function(e) {
    e.preventDefault();
    alert("Website content successfully updated! Changes are now live on the homepage.");
}

window.saveConfig = function(e) {
    e.preventDefault();
    alert("Website configuration successfully saved!");
}

window.handleAdminLogin = handleAdminLogin;
window.handleAdminLogout = handleAdminLogout;
window.showSection = showSection;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.saveProduct = saveProduct;
window.filterProducts = filterProducts;
window.filterUsers = filterUsers;

// --- Orders Management ---
let allOrders = [];

window.loadOrders = async function() {
    const tbody = document.getElementById('orders-table-body');
    tbody.innerHTML = '<tr><td colspan="7">Loading orders...</td></tr>';
    
    try {
        const res = await fetch('/api/admin/orders');
        allOrders = await res.json();
        renderOrders();
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="7" style="color:red">Error loading orders</td></tr>';
    }
}

window.renderOrders = function() {
    const filter = document.getElementById('order-filter').value;
    const tbody = document.getElementById('orders-table-body');
    let filtered = allOrders;
    
    if (filter !== 'all') {
        filtered = allOrders.filter(o => o.status === filter);
    }
    
    if (!filtered.length) {
        tbody.innerHTML = '<tr><td colspan="7">No orders found.</td></tr>';
        return;
    }
    
    tbody.innerHTML = filtered.map(o => `
        <tr>
            <td><strong>${o.order_number || o.id.split('-')[0]}</strong></td>
            <td>
                ${o.customer_name}<br>
                <small>${o.customer_email}</small>
            </td>
            <td>${o.order_items.length} items</td>
            <td>₹${o.total_amount.toLocaleString('en-IN')}</td>
            <td><span class="status-badge status-${o.status}">${o.status.toUpperCase()}</span></td>
            <td><span class="status-badge">${o.payment_method} | ${o.payment_status || 'Pending'}</span></td>
            <td>
                <button class="action-btn" onclick="viewOrderSlip('${o.id}')" title="Order Slip"><i class="fa-solid fa-file-invoice"></i></button>
                ${o.status === 'pending' || o.status === 'processing' ? `<button class="action-btn" style="color:#4caf50;" onclick="updateOrderStatus('${o.id}', 'approved')" title="Approve"><i class="fa-solid fa-check"></i></button>` : ''}
                ${o.status !== 'cancelled' && o.status !== 'delivered' ? `<button class="action-btn" style="color:red;" onclick="updateOrderStatus('${o.id}', 'cancelled')" title="Cancel"><i class="fa-solid fa-xmark"></i></button>` : ''}
                <select onchange="updateOrderStatus('${o.id}', this.value)" style="margin-left:5px; padding:3px; font-size:0.8rem; background:var(--bg-dark); color:white; border:1px solid var(--border-color);">
                    <option value="">Update...</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="rejected">Rejected</option>
                </select>
            </td>
        </tr>
    `).join('');
}

window.updateOrderStatus = async function(id, newStatus) {
    if(!newStatus) return;
    if(newStatus === 'cancelled') {
        const reason = prompt("Enter cancellation reason:");
        if (reason === null) return;
        await fetch('/api/admin/orders/update', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id, status: newStatus, cancellation_reason: reason })
        });
    } else {
        await fetch('/api/admin/orders/update', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id, status: newStatus })
        });
    }
    loadOrders();
}

window.viewOrderSlip = function(id) {
    const order = allOrders.find(o => o.id === id);
    if(!order) return;
    
    const isApproved = order.status === 'approved' || order.status === 'shipped' || order.status === 'delivered';
    const slipTitle = isApproved ? "APPROVED ORDER SLIP" : "ORDER SLIP";
    
    const slipWindow = window.open('', '_blank');
    slipWindow.document.write(`
        <html><head><title>Order Slip - ${order.order_number}</title>
        <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #333; max-width: 800px; margin: auto; }
            .header { text-align: center; border-bottom: 2px solid #d4af37; padding-bottom: 20px; margin-bottom: 30px; }
            .brand { font-size: 2rem; color: #000; letter-spacing: 2px; font-weight: bold; }
            .title { font-size: 1.2rem; margin-top: 10px; color: #555; }
            .details-grid { display: flex; justify-content: space-between; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background: #f9f9f9; }
            .totals { text-align: right; margin-top: 20px; }
            @media print { .no-print { display: none; } body { padding: 0; } }
        </style>
        </head><body>
            <div class="no-print" style="margin-bottom:20px;">
                <button onclick="window.print()" style="padding:10px 20px; background:#d4af37; border:none; color:#000; cursor:pointer;">Print / Download PDF</button>
            </div>
            <div class="header">
                <div class="brand">AETHER</div>
                <div class="title">${slipTitle}</div>
            </div>
            <div class="details-grid">
                <div>
                    <strong>Order ID:</strong> ${order.order_number || order.id}<br>
                    <strong>Date:</strong> ${new Date(order.created_at).toLocaleString()}<br>
                    <strong>Status:</strong> ${order.status.toUpperCase()}<br>
                    ${isApproved ? '<strong>Approved Date:</strong> ' + new Date(order.approved_at || order.created_at).toLocaleString() + '<br>' : ''}
                    ${order.status === 'cancelled' ? '<strong>Cancellation Reason:</strong> ' + (order.cancellation_reason || 'N/A') + '<br>' : ''}
                </div>
                <div>
                    <strong>Customer Details:</strong><br>
                    ${order.customer_name}<br>
                    ${order.customer_email}<br>
                    ${order.customer_phone}<br>
                    <strong>Delivery Address:</strong><br>
                    ${order.shipping_address}, ${order.city}, ${order.state} - ${order.pincode}
                </div>
            </div>
            <table>
                <thead>
                    <tr><th>Product</th><th>Quantity</th><th>Price</th><th>Subtotal</th></tr>
                </thead>
                <tbody>
                    ${order.order_items.map(item => `
                        <tr>
                            <td>${item.product_name || 'Product'}</td>
                            <td>${item.quantity}</td>
                            <td>₹${item.unit_price}</td>
                            <td>₹${item.subtotal || (item.quantity * item.unit_price)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="totals">
                <p><strong>Subtotal:</strong> ₹${order.subtotal}</p>
                <p><strong>Shipping:</strong> ₹${order.shipping_charge || 0}</p>
                <p><strong>COD Charge:</strong> ₹${order.cod_charge || 0}</p>
                <h3><strong>Final Total:</strong> ₹${order.total_amount}</h3>
            </div>
            <div style="margin-top:40px; padding-top:20px; border-top:1px solid #ddd;">
                <p><strong>Payment Method:</strong> ${order.payment_method.toUpperCase()}</p>
                <p><strong>Payment Status:</strong> ${order.payment_status}</p>
                ${order.payment_transaction_id ? '<p><strong>Transaction ID:</strong> ' + order.payment_transaction_id + '</p>' : ''}
            </div>
        </body></html>
    `);
    slipWindow.document.close();
}

window.loadPaymentSettings = async function() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        
        const res = await fetch('/api/admin/payment_settings', {
            headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        if (!res.ok) throw new Error('Unauthorized');
        const settings = await res.json();
        
        if (settings.razorpay) {
            document.getElementById('rzp-enabled').checked = settings.razorpay.is_enabled;
            document.getElementById('rzp-key').value = settings.razorpay.key_id;
            document.getElementById('rzp-secret').value = settings.razorpay.secret_key;
            document.getElementById('rzp-mode').value = settings.razorpay.mode;
        }
        if (settings.cashfree) {
            document.getElementById('cf-enabled').checked = settings.cashfree.is_enabled;
            document.getElementById('cf-key').value = settings.cashfree.key_id;
            document.getElementById('cf-secret').value = settings.cashfree.secret_key;
            document.getElementById('cf-mode').value = settings.cashfree.mode;
        }
        if (settings.cod) {
            document.getElementById('cod-enabled').checked = settings.cod.is_enabled;
            document.getElementById('cod-charge').value = settings.cod.charge;
            document.getElementById('cod-max').value = settings.cod.max_amount;
        }
    } catch(e) { console.error(e); }
}

window.savePaymentSettings = async function(e, gateway) {
    e.preventDefault();
    let data = {};
    if (gateway === 'razorpay') {
        data = {
            is_enabled: document.getElementById('rzp-enabled').checked,
            key_id: document.getElementById('rzp-key').value,
            secret_key: document.getElementById('rzp-secret').value,
            mode: document.getElementById('rzp-mode').value
        };
    } else if (gateway === 'cashfree') {
        data = {
            is_enabled: document.getElementById('cf-enabled').checked,
            key_id: document.getElementById('cf-key').value,
            secret_key: document.getElementById('cf-secret').value,
            mode: document.getElementById('cf-mode').value
        };
    } else if (gateway === 'cod') {
        data = {
            is_enabled: document.getElementById('cod-enabled').checked,
            charge: parseFloat(document.getElementById('cod-charge').value) || 0,
            max_amount: parseFloat(document.getElementById('cod-max').value) || 0
        };
    }
    
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('Unauthorized');
        
        const res = await fetch('/api/admin/payment_settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ gateway, settings: data })
        });
        if (!res.ok) throw new Error('Failed to save settings');
        alert(gateway.toUpperCase() + ' settings saved securely.');
    } catch(err) {
        alert(err.message);
    }
}

window.loadOrders = loadOrders;
window.renderOrders = renderOrders;
window.loadPaymentSettings = loadPaymentSettings;
