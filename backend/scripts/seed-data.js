const { Pool } = require('pg');
const bcrypt = require('bcrypt');

async function seedData() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:grabnchop@localhost:5432/credit_dispute_db',
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    
    // Create admin user
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const adminResult = await client.query(`
      INSERT INTO users (email, password_hash, first_name, last_name, role)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO UPDATE SET 
        password_hash = EXCLUDED.password_hash,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        role = EXCLUDED.role
      RETURNING id
    `, ['admin@example.com', adminPasswordHash, 'Admin', 'User', 'admin']);
    
    const adminId = adminResult.rows[0].id;
    console.log('Admin user created/updated with ID:', adminId);
    
    // Create regular user
    const userPasswordHash = await bcrypt.hash('user123', 10);
    const userResult = await client.query(`
      INSERT INTO users (email, password_hash, first_name, last_name, role)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO UPDATE SET 
        password_hash = EXCLUDED.password_hash,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        role = EXCLUDED.role
      RETURNING id
    `, ['user@example.com', userPasswordHash, 'John', 'Doe', 'user']);
    
    const userId = userResult.rows[0].id;
    console.log('Regular user created/updated with ID:', userId);
    
    // Create credit profile for user
    const profileResult = await client.query(`
      INSERT INTO credit_profiles (user_id, credit_score, report_date, total_accounts, open_accounts, total_balance, payment_history_score, credit_utilization, length_of_history_months)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT DO NOTHING
      RETURNING id
    `, [userId, 720, '2024-01-15', 5, 3, 15000.00, 85, 35.5, 48]);
    
    let profileId;
    if (profileResult.rows.length > 0) {
      profileId = profileResult.rows[0].id;
    } else {
      // Profile already exists, get its ID
      const existingProfile = await client.query('SELECT id FROM credit_profiles WHERE user_id = $1', [userId]);
      profileId = existingProfile.rows[0].id;
    }
    console.log('Credit profile created/updated with ID:', profileId);
    
    // Create credit report items
    const items = [
      {
        account_name: 'Chase Freedom Credit Card',
        account_type: 'Credit Card',
        account_status: 'Open',
        balance: 2500.00,
        payment_status: 'Current',
        date_opened: '2020-03-15',
        last_activity: '2024-01-10'
      },
      {
        account_name: 'Wells Fargo Auto Loan',
        account_type: 'Auto Loan',
        account_status: 'Open',
        balance: 12000.00,
        payment_status: 'Current',
        date_opened: '2022-06-20',
        last_activity: '2024-01-05'
      },
      {
        account_name: 'Fraudulent Account XYZ',
        account_type: 'Credit Card',
        account_status: 'Open',
        balance: 500.00,
        payment_status: 'Late',
        date_opened: '2023-11-01',
        last_activity: '2023-12-20'
      }
    ];
    
    const itemIds = [];
    for (const item of items) {
      const itemResult = await client.query(`
        INSERT INTO credit_report_items (credit_profile_id, account_name, account_type, account_status, balance, payment_status, date_opened, last_activity)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
      `, [profileId, item.account_name, item.account_type, item.account_status, item.balance, item.payment_status, item.date_opened, item.last_activity]);
      
      itemIds.push(itemResult.rows[0].id);
    }
    console.log('Credit report items created with IDs:', itemIds);
    
    // Create disputes
    const disputes = [
      {
        credit_report_item_id: itemIds[2], // Fraudulent account
        dispute_reason: 'This account is fraudulent and was opened without my authorization. I have never applied for or used this credit card.',
        status: 'pending'
      },
      {
        credit_report_item_id: itemIds[0], // Chase card
        dispute_reason: 'The balance reported is incorrect. I have documentation showing the actual balance is $1,800, not $2,500.',
        status: 'under_review'
      }
    ];
    
    for (const dispute of disputes) {
      const disputeResult = await client.query(`
        INSERT INTO disputes (user_id, credit_report_item_id, dispute_reason, status)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `, [userId, dispute.credit_report_item_id, dispute.dispute_reason, dispute.status]);
      
      console.log('Dispute created with ID:', disputeResult.rows[0].id);
    }
    
    console.log('Database seeded successfully!');
    console.log('Admin login: admin@example.com / admin123');
    console.log('User login: user@example.com / user123');
    
    client.release();
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedData();
