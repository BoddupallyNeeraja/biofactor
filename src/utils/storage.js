// Utility functions for localStorage management

export const saveUser = (userData) => {
  const users = getUsers();
  const userExists = users.find(user => user.email === userData.email);
  
  if (userExists) {
    return { success: false, message: 'User with this email already exists' };
  }
  
  users.push(userData);
  localStorage.setItem('biofactor_users', JSON.stringify(users));
  return { success: true, message: 'Account created successfully!' };
};

export const getUsers = () => {
  const users = localStorage.getItem('biofactor_users');
  return users ? JSON.parse(users) : [];
};

export const authenticateUser = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    localStorage.setItem('biofactor_currentUser', JSON.stringify(user));
    return { success: true, user };
  }
  
  return { success: false, message: 'Invalid email or password' };
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('biofactor_currentUser');
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem('biofactor_currentUser');
};


