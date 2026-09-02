const path = require('path');

const serverRoot = path.join(__dirname, '../server');
require(path.join(serverRoot, 'node_modules/dotenv')).config({
  path: path.join(serverRoot, '.env'),
  quiet: true,
});
const jwt = require(path.join(serverRoot, 'node_modules/jsonwebtoken'));
const db = require(path.join(serverRoot, 'config/db'));

const username = process.argv[2] || 'admin.rama';

(async () => {
  const [rows] = await db.query(
    'SELECT id, username, role FROM users WHERE username = ? LIMIT 1',
    [username]
  );
  if (!rows.length) {
    console.error('User not found');
    process.exit(1);
  }
  const user = rows[0];
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
  process.stdout.write(token);
  process.exit(0);
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
