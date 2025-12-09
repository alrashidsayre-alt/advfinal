export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  // At least 8 characters
  return password.length >= 8;
}

export function validateUsername(username) {
  // 3-50 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,50}$/;
  return usernameRegex.test(username);
}

export function validateRegistration(data) {
  const errors = {};
  
  if (!data.username || !validateUsername(data.username)) {
    errors.username = 'Username must be 3-50 characters and contain only letters, numbers, and underscores';
  }
  
  if (!data.email || !validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!data.password || !validatePassword(data.password)) {
    errors.password = 'Password must be at least 8 characters long';
  }
  
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateWorkoutSession(data) {
  const errors = {};
  
  if (!data.session_date) {
    errors.session_date = 'Session date is required';
  }
  
  if (data.duration_minutes && (data.duration_minutes < 0 || data.duration_minutes > 600)) {
    errors.duration_minutes = 'Duration must be between 0 and 600 minutes';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}