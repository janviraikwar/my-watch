const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

// Use the secret key found in .env
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-secret-key';
const supabase = createClient(process.env.VITE_SUPABASE_URL, serviceRoleKey);

async function setupAdminServiceRole() {
    console.log("Setting up admin using service role key...");
    
    // Check if user exists
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    let adminUser = users?.users?.find(u => u.email === 'janvi808100@gmail.com');
    
    if (!adminUser) {
        console.log("User not found, creating and auto-confirming...");
        const { data, error } = await supabase.auth.admin.createUser({
            email: 'janvi808100@gmail.com',
            password: '11111111',
            email_confirm: true, // Auto-confirm!
            user_metadata: { first_name: 'Janvi', last_name: 'Admin' }
        });
        
        if (error) {
            console.error("Error creating user:", error.message);
            return;
        }
        adminUser = data.user;
        console.log("User created:", adminUser.id);
    } else {
        console.log("User already exists:", adminUser.id);
        
        // Confirm email just in case it wasn't
        await supabase.auth.admin.updateUserById(adminUser.id, { email_confirm: true, password: '11111111' });
    }
    
    console.log("Updating role to admin in profiles table...");
    const { error: updateError } = await supabase.from('profiles')
        .update({ role: 'admin' })
        .eq('id', adminUser.id);
        
    if (updateError) {
        console.error("Error updating role:", updateError.message);
    } else {
        console.log("Role updated successfully! Admin setup complete.");
    }
}

setupAdminServiceRole();
