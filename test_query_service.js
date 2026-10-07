const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-secret-key';
const supabase = createClient(process.env.VITE_SUPABASE_URL, serviceRoleKey);

async function testQuery() {
    let res = await supabase.from('profiles').select('*').limit(1);
    console.log("Profiles columns:", Object.keys(res.data[0] || {}));
}

testQuery();
