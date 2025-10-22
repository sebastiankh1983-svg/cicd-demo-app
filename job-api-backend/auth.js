const users = []; // In-memory user storage

function register(username, password) {
  if (!username || !password) {
    throw new Error('Username and password required');
  }

  if (users.find(u => u.username === username)) {
    throw new Error('User already exists');
  }

  const user = { id: users.length + 1, username, password };
  users.push(user);
  return { id: user.id, username: user.username };
}

function login(username, password) {
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  return { id: user.id, username: user.username, token: 'fake-jwt-token' };
}

function getAllUsers() {
  return users.map(u => ({ id: u.id, username: u.username }));
}

module.exports = { register, login, getAllUsers };

