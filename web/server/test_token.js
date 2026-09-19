const jwt = require('jsonwebtoken');
const token = jwt.sign({ id: '6a3f9b62824e79fd3b51aabd', role: 'admin' }, 'my_secret_key_543210', { expiresIn: '1h' });
console.log(token);
