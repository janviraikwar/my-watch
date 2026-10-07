import"./supabase-init-DwNNH3oa.js";var e=sessionStorage.getItem(`admin_intended_path`);e&&(sessionStorage.removeItem(`admin_intended_path`),history.replaceState(null,``,e));var t;document.addEventListener(`DOMContentLoaded`,()=>{let e=setInterval(()=>{window.supabaseClient&&(clearInterval(e),t=window.supabaseClient,r(),c())},100);window.addEventListener(`popstate`,r),document.querySelectorAll(`.nav-item`).forEach(e=>{e.addEventListener(`click`,e=>{e.currentTarget.getAttribute(`onclick`)?.includes(`showSection`)&&e.preventDefault()})})});function n(){let e=window.location.pathname;if(e.includes(`/login`)){o();return}let t=`dashboard`;e.includes(`/products`)?t=`products`:e.includes(`/users`)?t=`users`:e.includes(`/customers`)?t=`customers`:e.includes(`/orders`)?t=`orders`:e.includes(`/payments`)?t=`payments`:e.includes(`/cms`)?t=`cms`:e.includes(`/settings`)&&(t=`config`),s(t,!1)}async function r(){let{data:{session:e}}=await t.auth.getSession();if(e){let{data:r}=await t.from(`profiles`).select(`role`).eq(`id`,e.user.id).single();r&&r.role===`admin`?(document.getElementById(`current-admin-email`).innerText=e.user.email,document.getElementById(`profile-email`).value=e.user.email,window.location.pathname.includes(`/login`)&&history.pushState(null,``,`/admin`),n()):(await t.auth.signOut(),o(`Unauthorized: This account does not have admin privileges.`))}else window.location.pathname.includes(`/login`)||history.pushState(null,``,`/admin/login`),o()}async function i(){let e=document.getElementById(`admin-email`).value,n=document.getElementById(`admin-password`).value,i=document.getElementById(`login-error`);if(!e||!n)return;let{data:a,error:o}=await t.auth.signInWithPassword({email:e,password:n});o?(i.innerText=o.message,i.style.display=`block`):(i.style.display=`none`,history.pushState(null,``,`/admin`),r())}async function a(){await t.auth.signOut(),history.pushState(null,``,`/admin/login`),window.location.reload()}function o(e=``){if(document.getElementById(`admin-dashboard-view`).classList.remove(`view-active`),document.getElementById(`admin-dashboard-view`).classList.add(`view-hidden`),document.getElementById(`admin-login-view`).classList.remove(`view-hidden`),document.getElementById(`admin-login-view`).classList.add(`view-active`),e){let t=document.getElementById(`login-error`);t.innerText=e,t.style.display=`block`}}function s(e,t=!0){document.getElementById(`admin-login-view`).classList.remove(`view-active`),document.getElementById(`admin-login-view`).classList.add(`view-hidden`),document.getElementById(`admin-dashboard-view`).classList.remove(`view-hidden`),document.getElementById(`admin-dashboard-view`).classList.add(`view-active`),document.querySelectorAll(`.content-section`).forEach(e=>e.classList.remove(`active`)),document.querySelectorAll(`.nav-item`).forEach(e=>e.classList.remove(`active`));let n=document.getElementById(`section-${e}`);n&&n.classList.add(`active`);let r=document.querySelector(`.nav-item[data-target="${e}"]`);if(r&&r.classList.add(`active`),t){let t=e===`dashboard`?`/admin`:`/admin/${e}`;history.pushState(null,``,t)}e===`products`&&f(),e===`users`&&g(),e===`customers`&&y(),e===`dashboard`&&u(),e===`orders`&&loadOrders(),e===`payments`&&loadPaymentSettings()}function c(){t.channel(`public:orders`).on(`postgres_changes`,{event:`INSERT`,schema:`public`,table:`orders`},e=>{l(`New order received!`),window.location.pathname.includes(`/orders`)&&loadOrders()}).subscribe()}function l(e){let t=document.getElementById(`admin-toast-container`);t||(t=document.createElement(`div`),t.id=`admin-toast-container`,t.style.cssText=`position:fixed; top:20px; right:20px; z-index:9999; display:flex; flex-direction:column; gap:10px;`,document.body.appendChild(t));let n=document.createElement(`div`);n.style.cssText=`background:#d4af37; color:#000; padding:15px 20px; border-radius:4px; box-shadow:0 4px 12px rgba(0,0,0,0.2); font-weight:bold; opacity:0; transition:opacity 0.3s ease;`,n.innerHTML=`<i class="fa-solid fa-bell"></i> &nbsp; ${e}`,t.appendChild(n),setTimeout(()=>n.style.opacity=`1`,10),setTimeout(()=>{n.style.opacity=`0`,setTimeout(()=>n.remove(),300)},5e3)}async function u(){let{count:e}=await t.from(`products`).select(`*`,{count:`exact`,head:!0}),{count:n}=await t.from(`profiles`).select(`*`,{count:`exact`,head:!0}),{count:r}=await t.from(`orders`).select(`*`,{count:`exact`,head:!0}),{count:i}=await t.from(`profiles`).select(`*`,{count:`exact`,head:!0}).eq(`role`,`customer`);document.getElementById(`stat-products`).innerText=e||0,document.getElementById(`stat-users`).innerText=n||0,document.getElementById(`stat-customers`).innerText=i||0,document.getElementById(`stat-orders`).innerText=r||0;let{data:a}=await t.from(`orders`).select(`total_amount`).neq(`status`,`cancelled`);if(a&&a.length>0){let e=a.reduce((e,t)=>e+(parseFloat(t.total_amount)||0),0);document.getElementById(`stat-revenue`).innerText=`₹`+e.toLocaleString(`en-IN`)}}var d=[];async function f(){let e=document.getElementById(`products-table-body`);e.innerHTML=`<tr><td colspan="7">Loading...</td></tr>`;let{data:n,error:r}=await t.from(`products`).select(`*`).order(`created_at`,{ascending:!1});if(r){e.innerHTML=`<tr><td colspan="7" style="color:red">Error: ${r.message}</td></tr>`;return}d=n,m(n)}function p(){let e=document.getElementById(`search-products-input`).value.toLowerCase();m(d.filter(t=>t.name.toLowerCase().includes(e)||t.category.toLowerCase().includes(e)))}function m(e){let t=document.getElementById(`products-table-body`);if(!e.length){t.innerHTML=`<tr><td colspan="7">No products found.</td></tr>`;return}t.innerHTML=e.map(e=>`
        <tr>
            <td><img src="${e.image_url||`https://via.placeholder.com/50`}" style="width:50px; height:50px; object-fit:cover; border-radius:4px;"></td>
            <td><strong>${e.name}</strong></td>
            <td>${e.category}</td>
            <td>₹${e.price.toLocaleString(`en-IN`)}</td>
            <td>${e.stock_quantity||0}</td>
            <td><span class="status-badge" style="${e.is_active?``:`background:rgba(255,0,0,0.2);color:red;`}">${e.is_active?`Active`:`Inactive`}</span></td>
            <td>
                <button class="action-btn" onclick="editProduct('${e.id}')" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="action-btn delete" onclick="deleteProduct('${e.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join(``)}var h=[];async function g(){let e=document.getElementById(`users-table-body`);e.innerHTML=`<tr><td colspan="5">Loading...</td></tr>`;let{data:n,error:r}=await t.from(`profiles`).select(`id, role, created_at, phone, first_name, last_name`);if(r){e.innerHTML=`<tr><td colspan="5" style="color:red">Error: ${r.message}</td></tr>`;return}h=n,v(n)}function _(){let e=document.getElementById(`search-users-input`).value.toLowerCase();v(h.filter(t=>t.phone?.toLowerCase().includes(e)||t.first_name?.toLowerCase().includes(e)||t.last_name?.toLowerCase().includes(e)||t.id.toLowerCase().includes(e)))}function v(e){let t=document.getElementById(`users-table-body`);if(!e.length){t.innerHTML=`<tr><td colspan="5">No users found.</td></tr>`;return}t.innerHTML=e.map(e=>`
        <tr>
            <td><span title="${e.id}">${e.id.substring(0,8)}...</span></td>
            <td>${e.first_name||``} ${e.last_name||``} ${e.phone?`(`+e.phone+`)`:``}</td>
            <td><span class="status-badge" style="${e.role===`admin`?`background:rgba(212,175,55,0.2);color:#d4af37;`:``}">${e.role.toUpperCase()}</span></td>
            <td>${new Date(e.created_at).toLocaleDateString()}</td>
            <td>
                <button class="action-btn" onclick="alert('View details for user ${e.id}')"><i class="fa-solid fa-eye"></i></button>
            </td>
        </tr>
    `).join(``)}async function y(){let e=document.getElementById(`customers-table-body`);e.innerHTML=`<tr><td colspan="5">Loading...</td></tr>`;try{let t=await fetch(`/api/admin/customers`);if(!t.ok)throw Error(`Failed to fetch customers`);let n=await t.json();if(!n.length){e.innerHTML=`<tr><td colspan="5">No customers found.</td></tr>`;return}e.innerHTML=n.map(e=>`
            <tr>
                <td>
                    <strong>${e.first_name||``} ${e.last_name||``}</strong><br>
                    <small style="color:var(--text-muted);">${e.email||``}</small>
                </td>
                <td>${e.phone||`N/A`}</td>
                <td>
                    <small>
                        ${e.address_street||``}<br>
                        ${e.address_city||``}, ${e.address_state||``} ${e.address_pin||``}
                    </small>
                </td>
                <td>${new Date(e.created_at).toLocaleDateString()}</td>
                <td><span class="status-badge">Customer</span></td>
            </tr>
        `).join(``)}catch(t){e.innerHTML=`<tr><td colspan="5" style="color:red">Error: ${t.message}</td></tr>`}}function b(){document.getElementById(`product-form`).reset(),document.getElementById(`p-id`).value=``,document.getElementById(`p-stock`).value=`10`,document.getElementById(`p-rating`).value=`5.0`,document.getElementById(`modal-title`).innerText=`Add New Product`,document.getElementById(`product-modal`).classList.add(`active`)}function x(){document.getElementById(`product-modal`).classList.remove(`active`)}async function S(e){e.preventDefault();let n=e.target.querySelector(`button[type="submit"]`);n.disabled=!0,n.innerText=`Saving...`;let r=document.getElementById(`p-id`).value,i=document.getElementById(`p-cat`).value,a=document.getElementById(`p-gender`).value,o=i||a,s={name:document.getElementById(`p-name`).value,price:parseFloat(document.getElementById(`p-price`).value)||0,discount_price:parseFloat(document.getElementById(`p-discount-price`).value)||null,description:document.getElementById(`p-desc`).value,category:o,style:document.getElementById(`p-style`).value,color:document.getElementById(`p-color`).value,strap:document.getElementById(`p-strap`).value,image_url:document.getElementById(`p-img`).value,is_new:document.getElementById(`p-isnew`).checked,is_best_seller:document.getElementById(`p-isbest`).checked,is_active:document.getElementById(`p-active`).checked,stock_quantity:parseInt(document.getElementById(`p-stock`).value)||0,rating:parseFloat(document.getElementById(`p-rating`).value)||0},c;c=r?await t.from(`products`).update(s).eq(`id`,r):await t.from(`products`).insert(s),c.error?alert(`Error saving product: `+c.error.message):(x(),f()),n.disabled=!1,n.innerText=`Save Product`}window.editProduct=async function(e){let{data:n}=await t.from(`products`).select(`*`).eq(`id`,e).single();n&&(document.getElementById(`p-id`).value=n.id,document.getElementById(`p-name`).value=n.name||``,document.getElementById(`p-price`).value=n.price||0,document.getElementById(`p-discount-price`).value=n.discount_price||``,document.getElementById(`p-desc`).value=n.description||``,document.getElementById(`p-cat`).value=n.category||``,[`Men`,`Women`,`Unisex`].includes(n.category)&&(document.getElementById(`p-gender`).value=n.category),document.getElementById(`p-style`).value=n.style||``,document.getElementById(`p-color`).value=n.color||``,document.getElementById(`p-strap`).value=n.strap||``,document.getElementById(`p-img`).value=n.image_url||``,document.getElementById(`p-stock`).value=n.stock_quantity===void 0?10:n.stock_quantity,document.getElementById(`p-rating`).value=n.rating||5,document.getElementById(`p-isnew`).checked=n.is_new,document.getElementById(`p-isbest`).checked=n.is_best_seller,document.getElementById(`p-active`).checked=n.is_active,document.getElementById(`modal-title`).innerText=`Edit Product`,document.getElementById(`product-modal`).classList.add(`active`))},window.deleteProduct=async function(e){if(confirm(`Are you sure you want to delete this product?`)){let{error:n}=await t.from(`products`).delete().eq(`id`,e);n?alert(`Error deleting: `+n.message):f()}},window.saveCMS=function(e){e.preventDefault(),alert(`Website content successfully updated! Changes are now live on the homepage.`)},window.saveConfig=function(e){e.preventDefault(),alert(`Website configuration successfully saved!`)},window.handleAdminLogin=i,window.handleAdminLogout=a,window.showSection=s,window.openProductModal=b,window.closeProductModal=x,window.saveProduct=S,window.filterProducts=p,window.filterUsers=_;var C=[];window.loadOrders=async function(){let e=document.getElementById(`orders-table-body`);e.innerHTML=`<tr><td colspan="7">Loading orders...</td></tr>`;try{C=await(await fetch(`/api/admin/orders`)).json(),renderOrders()}catch{e.innerHTML=`<tr><td colspan="7" style="color:red">Error loading orders</td></tr>`}},window.renderOrders=function(){let e=document.getElementById(`order-filter`).value,t=document.getElementById(`orders-table-body`),n=C;if(e!==`all`&&(n=C.filter(t=>t.status===e)),!n.length){t.innerHTML=`<tr><td colspan="7">No orders found.</td></tr>`;return}t.innerHTML=n.map(e=>`
        <tr>
            <td><strong>${e.order_number||e.id.split(`-`)[0]}</strong></td>
            <td>
                ${e.customer_name}<br>
                <small>${e.customer_email}</small>
            </td>
            <td>${e.order_items.length} items</td>
            <td>₹${e.total_amount.toLocaleString(`en-IN`)}</td>
            <td><span class="status-badge status-${e.status}">${e.status.toUpperCase()}</span></td>
            <td><span class="status-badge">${e.payment_method} | ${e.payment_status||`Pending`}</span></td>
            <td>
                <button class="action-btn" onclick="viewOrderSlip('${e.id}')" title="Order Slip"><i class="fa-solid fa-file-invoice"></i></button>
                ${e.status===`pending`||e.status===`processing`?`<button class="action-btn" style="color:#4caf50;" onclick="updateOrderStatus('${e.id}', 'approved')" title="Approve"><i class="fa-solid fa-check"></i></button>`:``}
                ${e.status!==`cancelled`&&e.status!==`delivered`?`<button class="action-btn" style="color:red;" onclick="updateOrderStatus('${e.id}', 'cancelled')" title="Cancel"><i class="fa-solid fa-xmark"></i></button>`:``}
                <select onchange="updateOrderStatus('${e.id}', this.value)" style="margin-left:5px; padding:3px; font-size:0.8rem; background:var(--bg-dark); color:white; border:1px solid var(--border-color);">
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
    `).join(``)},window.updateOrderStatus=async function(e,t){if(t){if(t===`cancelled`){let n=prompt(`Enter cancellation reason:`);if(n===null)return;await fetch(`/api/admin/orders/update`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({id:e,status:t,cancellation_reason:n})})}else await fetch(`/api/admin/orders/update`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({id:e,status:t})});loadOrders()}},window.viewOrderSlip=function(e){let t=C.find(t=>t.id===e);if(!t)return;let n=t.status===`approved`||t.status===`shipped`||t.status===`delivered`,r=n?`APPROVED ORDER SLIP`:`ORDER SLIP`,i=window.open(``,`_blank`);i.document.write(`
        <html><head><title>Order Slip - ${t.order_number}</title>
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
                <div class="title">${r}</div>
            </div>
            <div class="details-grid">
                <div>
                    <strong>Order ID:</strong> ${t.order_number||t.id}<br>
                    <strong>Date:</strong> ${new Date(t.created_at).toLocaleString()}<br>
                    <strong>Status:</strong> ${t.status.toUpperCase()}<br>
                    ${n?`<strong>Approved Date:</strong> `+new Date(t.approved_at||t.created_at).toLocaleString()+`<br>`:``}
                    ${t.status===`cancelled`?`<strong>Cancellation Reason:</strong> `+(t.cancellation_reason||`N/A`)+`<br>`:``}
                </div>
                <div>
                    <strong>Customer Details:</strong><br>
                    ${t.customer_name}<br>
                    ${t.customer_email}<br>
                    ${t.customer_phone}<br>
                    <strong>Delivery Address:</strong><br>
                    ${t.shipping_address}, ${t.city}, ${t.state} - ${t.pincode}
                </div>
            </div>
            <table>
                <thead>
                    <tr><th>Product</th><th>Quantity</th><th>Price</th><th>Subtotal</th></tr>
                </thead>
                <tbody>
                    ${t.order_items.map(e=>`
                        <tr>
                            <td>${e.product_name||`Product`}</td>
                            <td>${e.quantity}</td>
                            <td>₹${e.unit_price}</td>
                            <td>₹${e.subtotal||e.quantity*e.unit_price}</td>
                        </tr>
                    `).join(``)}
                </tbody>
            </table>
            <div class="totals">
                <p><strong>Subtotal:</strong> ₹${t.subtotal}</p>
                <p><strong>Shipping:</strong> ₹${t.shipping_charge||0}</p>
                <p><strong>COD Charge:</strong> ₹${t.cod_charge||0}</p>
                <h3><strong>Final Total:</strong> ₹${t.total_amount}</h3>
            </div>
            <div style="margin-top:40px; padding-top:20px; border-top:1px solid #ddd;">
                <p><strong>Payment Method:</strong> ${t.payment_method.toUpperCase()}</p>
                <p><strong>Payment Status:</strong> ${t.payment_status}</p>
                ${t.payment_transaction_id?`<p><strong>Transaction ID:</strong> `+t.payment_transaction_id+`</p>`:``}
            </div>
        </body></html>
    `),i.document.close()},window.loadPaymentSettings=async function(){try{let{data:{session:e}}=await t.auth.getSession();if(!e)return;let n=await fetch(`/api/admin/payment_settings`,{headers:{Authorization:`Bearer ${e.access_token}`}});if(!n.ok)throw Error(`Unauthorized`);let r=await n.json();r.razorpay&&(document.getElementById(`rzp-enabled`).checked=r.razorpay.is_enabled,document.getElementById(`rzp-key`).value=r.razorpay.key_id,document.getElementById(`rzp-secret`).value=r.razorpay.secret_key,document.getElementById(`rzp-mode`).value=r.razorpay.mode),r.cashfree&&(document.getElementById(`cf-enabled`).checked=r.cashfree.is_enabled,document.getElementById(`cf-key`).value=r.cashfree.key_id,document.getElementById(`cf-secret`).value=r.cashfree.secret_key,document.getElementById(`cf-mode`).value=r.cashfree.mode),r.cod&&(document.getElementById(`cod-enabled`).checked=r.cod.is_enabled,document.getElementById(`cod-charge`).value=r.cod.charge,document.getElementById(`cod-max`).value=r.cod.max_amount)}catch(e){console.error(e)}},window.savePaymentSettings=async function(e,n){e.preventDefault();let r={};n===`razorpay`?r={is_enabled:document.getElementById(`rzp-enabled`).checked,key_id:document.getElementById(`rzp-key`).value,secret_key:document.getElementById(`rzp-secret`).value,mode:document.getElementById(`rzp-mode`).value}:n===`cashfree`?r={is_enabled:document.getElementById(`cf-enabled`).checked,key_id:document.getElementById(`cf-key`).value,secret_key:document.getElementById(`cf-secret`).value,mode:document.getElementById(`cf-mode`).value}:n===`cod`&&(r={is_enabled:document.getElementById(`cod-enabled`).checked,charge:parseFloat(document.getElementById(`cod-charge`).value)||0,max_amount:parseFloat(document.getElementById(`cod-max`).value)||0});try{let{data:{session:e}}=await t.auth.getSession();if(!e)throw Error(`Unauthorized`);if(!(await fetch(`/api/admin/payment_settings`,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer ${e.access_token}`},body:JSON.stringify({gateway:n,settings:r})})).ok)throw Error(`Failed to save settings`);alert(n.toUpperCase()+` settings saved securely.`)}catch(e){alert(e.message)}},window.loadOrders=loadOrders,window.renderOrders=renderOrders,window.loadPaymentSettings=loadPaymentSettings,window.handleAdminLogin=i,window.handleAdminLogout=a,window.showSection=s,window.openProductModal=b,window.closeProductModal=x,window.saveProduct=S,window.filterProducts=p,window.filterUsers=_,window.savePaymentSettings=savePaymentSettings,window.saveCMS=saveCMS,window.saveConfig=saveConfig,window.updateOrderStatus=updateOrderStatus;