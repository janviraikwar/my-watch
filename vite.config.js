import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig({
  appType: 'mpa',
  server: {
    port: 5173,
  },
  plugins: [
    {
      name: 'admin-rewrite',
      enforce: 'pre',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const getBody = () => new Promise((resolve, reject) => {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
                try {
                    resolve(body ? JSON.parse(body) : {});
                } catch (e) {
                    reject(new Error("Invalid JSON body"));
                }
            });
          });

          // Supabase client helper
          const getSupabase = async () => {
            const { createClient } = await import('@supabase/supabase-js');
            const fs = await import('fs');
            const envContent = fs.readFileSync(resolve(__dirname, '.env'), 'utf-8');
            const envVars = {};
            envContent.split('\n').forEach(line => {
                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) envVars[match[1].trim()] = match[2].trim();
            });
            return createClient(
                envVars.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL,
                envVars.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-secret-key'
            );
          };

          const dbMgr = require('./server_db.js');

          // --- API Endpoints ---
          if (req.method === 'POST') console.log("INCOMING POST:", req.url);
          try {
            const verifyAdmin = async (request, supabase) => {
                const authHeader = request.headers.authorization;
                if (!authHeader || !authHeader.startsWith('Bearer ')) throw new Error("Unauthorized");
                const token = authHeader.split(' ')[1];
                const { data: authData, error: authErr } = await supabase.auth.getUser(token);
                if (authErr || !authData || !authData.user) throw new Error("Unauthorized");
                const { data: profile } = await supabase.from('profiles').select('role').eq('id', authData.user.id).single();
                if (!profile || profile.role !== 'admin') throw new Error("Unauthorized: Admin only");
            };

            if (req.url === '/api/payment/create-order' && req.method === 'POST') {
              const orderData = await getBody();
              const supabase = await getSupabase();
              
              const authHeader = req.headers.authorization;
              if (!authHeader || !authHeader.startsWith('Bearer ')) {
                  throw new Error("Unauthorized: Missing or invalid token");
              }
              const token = authHeader.split(' ')[1];
              const { data: authData, error: authErr } = await supabase.auth.getUser(token);
              if (authErr || !authData || !authData.user) {
                  throw new Error("Unauthorized: " + (authErr ? authErr.message : "User not found"));
              }
              
              // Force using the authenticated user's ID
              orderData.user_id = authData.user.id;
              
              const order_number = 'ORD-' + Date.now();
              const payment_status = orderData.payment_method === 'cod' ? 'COD Pending' : 'Pending';
              const crypto = require('crypto');
              
              let shipping_address_id = null;
              try {
                  let { data: addressData } = await supabase.from('addresses').select('id').eq('user_id', orderData.user_id).limit(1);
                  if (addressData && addressData.length > 0) {
                      shipping_address_id = addressData[0].id;
                  } else {
                      const { data: newAddr } = await supabase.from('addresses').insert({
                          user_id: orderData.user_id,
                          street_address: orderData.shipping_address || 'N/A',
                          city: orderData.city || 'N/A',
                          state: orderData.state || 'N/A',
                          postal_code: orderData.pincode || '000000',
                          country: 'India'
                      }).select();
                      if (newAddr && newAddr.length > 0) {
                          shipping_address_id = newAddr[0].id;
                      }
                  }
              } catch (addrErr) {
                  console.warn("Could not manage shipping address", addrErr);
              }

              // Insert ONLY existing columns in Supabase
              const { data: order, error: orderErr } = await supabase.from('orders').insert({
                  user_id: orderData.user_id,
                  status: 'pending',
                  shipping_address_id: shipping_address_id,
                  total_amount: orderData.subtotal
              }).select().single();
              
              if (orderErr) {
                  throw new Error("Order Creation Failed: " + (orderErr.message || JSON.stringify(orderErr)));
              }

              const orderItems = orderData.items.map(item => ({
                  order_id: order.id,
                  product_id: item.id,
                  quantity: item.quantity,
                  unit_price: item.price
              }));
              const { error: itemsErr } = await supabase.from('order_items').insert(orderItems);
              if (itemsErr) {
                  // Rollback order since items failed
                  await supabase.from('orders').delete().eq('id', order.id);
                  throw new Error("Failed to insert order items: " + (itemsErr.message || JSON.stringify(itemsErr)));
              }

              // Save extra fields in local JSON
              dbMgr.updateOrderExtra(order.id, {
                  order_number,
                  customer_name: orderData.customer_name,
                  customer_email: orderData.customer_email,
                  customer_phone: orderData.customer_phone,
                  shipping_address: orderData.shipping_address,
                  city: orderData.city,
                  state: orderData.state,
                  pincode: orderData.pincode,
                  subtotal: orderData.subtotal,
                  payment_method: orderData.payment_method,
                  payment_status: payment_status,
                  created_at: new Date().toISOString()
              });
              
              const extraItems = orderData.items.map(item => ({
                  product_id: item.id,
                  product_name: item.name,
                  product_image: item.image_url || item.image,
                  subtotal: item.price * item.quantity
              }));
              dbMgr.saveOrderItemsExtra(order.id, extraItems);
              
              const settings = dbMgr.getPaymentSettings();

              if (orderData.payment_method === 'razorpay') {
                  const rzp = settings.razorpay;
                  const Razorpay = require('razorpay');
                  const instance = new Razorpay({ key_id: rzp.key_id, key_secret: rzp.secret_key });
                  const rzpOrder = await instance.orders.create({
                      amount: orderData.subtotal * 100,
                      currency: "INR",
                      receipt: order_number
                  });
                  if (rzpOrder.error) throw new Error(rzpOrder.error.description);

                  dbMgr.savePayment(order.id, {
                      order_id: order.id,
                      user_id: orderData.user_id,
                      gateway: 'razorpay',
                      gateway_order_id: rzpOrder.id,
                      amount: orderData.subtotal,
                      status: 'Pending'
                  });

                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({ 
                      order: { ...order, ...dbMgr.getOrderExtra(order.id) },
                      gateway_order_id: rzpOrder.id,
                      amount: orderData.subtotal * 100,
                      key: rzp.key_id
                  }));
              } 
              else if (orderData.payment_method === 'cashfree') {
                  const cf = settings.cashfree;
                  if (!cf || !cf.key_id || !cf.secret_key) throw new Error("Cashfree payment gateway is not configured correctly.");
                  
                  const cfEndpoint = cf.mode === 'live' ? 'https://api.cashfree.com/pg/orders' : 'https://sandbox.cashfree.com/pg/orders';
                  const response = await fetch(cfEndpoint, {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                          'x-api-version': '2023-08-01',
                          'x-client-id': cf.key_id,
                          'x-client-secret': cf.secret_key
                      },
                      body: JSON.stringify({
                          order_amount: orderData.subtotal,
                          order_currency: 'INR',
                          order_id: order_number,
                          customer_details: {
                              customer_id: 'CUST_' + orderData.user_id.replace(/[^a-zA-Z0-9]/g, '').substring(0, 20),
                              customer_phone: orderData.customer_phone || '9999999999',
                              customer_email: orderData.customer_email || 'test@example.com'
                          }
                      })
                  });
                  const cfOrder = await response.json();
                  if (cfOrder.message || !cfOrder.payment_session_id) {
                      throw new Error("Cashfree Error: " + (cfOrder.message || "No payment session returned"));
                  }
                  
                  dbMgr.savePayment(order.id, {
                      order_id: order.id,
                      user_id: orderData.user_id,
                      gateway: 'cashfree',
                      gateway_order_id: cfOrder.order_id,
                      amount: orderData.subtotal,
                      status: 'Pending'
                  });
                  
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({ 
                      order: { ...order, ...dbMgr.getOrderExtra(order.id) },
                      payment_session_id: cfOrder.payment_session_id,
                      mode: cf.mode === 'live' ? 'production' : 'sandbox'
                  }));
              }

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ order: { ...order, ...dbMgr.getOrderExtra(order.id) } }));
            }
            
            if (req.url === '/api/payment/verify/razorpay' && req.method === 'POST') {
              const data = await getBody();
              const settings = dbMgr.getPaymentSettings().razorpay;
              const crypto = require('crypto');
              const expectedSignature = crypto.createHmac('sha256', settings.secret_key)
                                              .update(data.razorpay_order_id + "|" + data.razorpay_payment_id)
                                              .digest('hex');
              
              if (expectedSignature === data.razorpay_signature) {
                  const supabase = await getSupabase();
                  await supabase.from('orders').update({ status: 'processing' }).eq('id', data.order_id);
                  dbMgr.updateOrderExtra(data.order_id, { payment_status: 'Paid', payment_transaction_id: data.razorpay_payment_id });
                  dbMgr.savePayment(data.order_id, { status: 'Paid', gateway_payment_id: data.razorpay_payment_id });
                  res.statusCode = 200;
                  return res.end(JSON.stringify({ success: true }));
              }
              res.statusCode = 400;
              return res.end(JSON.stringify({ success: false, error: 'Invalid signature' }));
            }

            if (req.url === '/api/payment/verify/cashfree' && req.method === 'POST') {
                const data = await getBody();
                const cf = dbMgr.getPaymentSettings().cashfree;
                const orderExtra = dbMgr.getOrderExtra(data.order_id);
                const cfEndpoint = cf.mode === 'live' ? 'https://api.cashfree.com/pg/orders/' : 'https://sandbox.cashfree.com/pg/orders/';
                
                const response = await fetch(cfEndpoint + orderExtra.order_number, {
                    headers: {
                        'x-api-version': '2023-08-01',
                        'x-client-id': cf.key_id,
                        'x-client-secret': cf.secret_key
                    }
                });
                const cfOrder = await response.json();
                if (cfOrder.order_status === 'PAID') {
                    const supabase = await getSupabase();
                    await supabase.from('orders').update({ status: 'processing' }).eq('id', data.order_id);
                    dbMgr.updateOrderExtra(data.order_id, { payment_status: 'Paid', payment_transaction_id: cfOrder.cf_order_id });
                    dbMgr.savePayment(data.order_id, { status: 'Paid', gateway_payment_id: cfOrder.cf_order_id });
                    res.statusCode = 200;
                    return res.end(JSON.stringify({ success: true }));
                }
                res.statusCode = 400;
                return res.end(JSON.stringify({ success: false }));
            }

            if (req.url === '/api/admin/customers') {
              const supabase = await getSupabase();
              const { data, error } = await supabase.auth.admin.listUsers();
              if (error) { res.statusCode = 500; return res.end(JSON.stringify({ error: error.message })); }
              const { data: profiles } = await supabase.from('profiles').select('id, role');
              const roleMap = {};
              if (profiles) profiles.forEach(p => roleMap[p.id] = p.role);
              const customers = data.users.filter(u => roleMap[u.id] !== 'admin').map(u => ({
                  id: u.id, email: u.email,
                  first_name: u.user_metadata?.first_name || '', last_name: u.user_metadata?.last_name || '',
                  phone: u.user_metadata?.phone || '', address_street: u.user_metadata?.address_street || '',
                  address_city: u.user_metadata?.address_city || '', address_state: u.user_metadata?.address_state || '',
                  address_pin: u.user_metadata?.address_pin || '', created_at: u.created_at, role: 'customer'
              }));
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify(customers));
            }
            
            if (req.url === '/api/user/orders' && req.method === 'POST') {
                const data = await getBody();
                const supabase = await getSupabase();
                const { data: orders } = await supabase.from('orders').select('*, order_items(*)').eq('user_id', data.user_id).order('created_at', { ascending: false });
                const fullOrders = (orders || []).map(o => {
                    const extra = dbMgr.getOrderExtra(o.id) || {};
                    const itemsExtra = dbMgr.getDb().order_items_extra[o.id] || [];
                    const items = (o.order_items || []).map(oi => {
                        const ex = itemsExtra.find(x => x.product_id === oi.product_id) || {};
                        return { ...oi, ...ex };
                    });
                    return { ...o, ...extra, order_items: items };
                });
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify(fullOrders));
            }

            if (req.url === '/api/admin/orders' && req.method === 'GET') {
                const supabase = await getSupabase();
                const { data: orders } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
                const fullOrders = (orders || []).map(o => {
                    const extra = dbMgr.getOrderExtra(o.id) || {};
                    const itemsExtra = dbMgr.getDb().order_items_extra[o.id] || [];
                    const items = (o.order_items || []).map(oi => {
                        const ex = itemsExtra.find(x => x.product_id === oi.product_id) || {};
                        return { ...oi, ...ex };
                    });
                    return { ...o, ...extra, order_items: items };
                });
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify(fullOrders));
            }

            if (req.url === '/api/admin/orders/update' && req.method === 'POST') {
                const data = await getBody();
                const supabase = await getSupabase();
                if (data.status) await supabase.from('orders').update({ status: data.status }).eq('id', data.id);
                const extraUpdates = {};
                if (data.payment_status) extraUpdates.payment_status = data.payment_status;
                if (data.status === 'approved') extraUpdates.approved_at = new Date().toISOString();
                if (data.status === 'shipped') extraUpdates.shipped_at = new Date().toISOString();
                if (data.status === 'delivered') extraUpdates.delivered_at = new Date().toISOString();
                if (data.status === 'cancelled') {
                    extraUpdates.cancelled_at = new Date().toISOString();
                    extraUpdates.cancellation_reason = data.cancellation_reason || '';
                }
                dbMgr.updateOrderExtra(data.id, extraUpdates);
                res.statusCode = 200;
                return res.end(JSON.stringify({ success: true }));
            }

            if (req.url === '/api/admin/payment_settings' && req.method === 'GET') {
                const supabase = await getSupabase();
                await verifyAdmin(req, supabase);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify(dbMgr.getPaymentSettings()));
            }

            if (req.url === '/api/admin/payment_settings' && req.method === 'POST') {
                const supabase = await getSupabase();
                await verifyAdmin(req, supabase);
                const data = await getBody();
                dbMgr.updatePaymentSettings(data.gateway, data.settings);
                res.statusCode = 200;
                return res.end(JSON.stringify({ success: true }));
            }

            if (req.url.startsWith('/admin') && !req.url.includes('.')) {
              const template = require('fs').readFileSync(resolve(__dirname, 'admin/index.html'), 'utf-8');
              const html = await server.transformIndexHtml(req.url, template);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'text/html');
              return res.end(html);
            }
          } catch (e) {
            if (req.url.startsWith('/api/')) {
                console.error("API ERROR:", req.url, e);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ error: e.message || 'Internal Server Error', stack: e.stack }));
            }
          }
          next();
        });
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin/index.html')
      }
    }
  }
});
