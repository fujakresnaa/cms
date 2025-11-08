-- Seed admin user for login
-- Default credentials: admin@mbw205ci.id / password123
-- To generate a new hash: node -e "console.log(require('crypto').createHash('sha256').update('password123').digest('hex'))"

DELETE FROM admin_users WHERE email = 'admin@mbw205ci.id';

INSERT INTO admin_users (id, email, password_hash, name, is_active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@mbw205ci.id',
  'ef92b778bafe771e89245d171bafcd74f588f1ef8bccf2d7f792fe5fdd884e90',
  'Admin',
  TRUE,
  NOW(),
  NOW()
);
