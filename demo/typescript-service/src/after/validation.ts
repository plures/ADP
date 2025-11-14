// Validation utilities - pure functions
export function validateUserId(id: string | undefined): void {
  if (!id) throw new Error('ID is required');
}

export function validateUserName(name: string | undefined): void {
  if (!name) throw new Error('Name is required');
}

export function validateUserEmail(email: string | undefined): void {
  if (!email) throw new Error('Email is required');
  if (!email.includes('@')) throw new Error('Invalid email format');
}

export function validateUserAge(age: number | undefined): void {
  if (!age) throw new Error('Age is required');
  if (age <= 0 || age >= 150) throw new Error('Invalid age');
}

export function validateUserRole(role: string | undefined): void {
  if (!role) throw new Error('Role is required');
  const validRoles = ['admin', 'user', 'moderator'];
  if (!validRoles.includes(role)) throw new Error('Invalid role');
}

export function validateUserData(userData: any): void {
  validateUserId(userData?.id);
  validateUserName(userData?.name);
  validateUserEmail(userData?.email);
  validateUserAge(userData?.age);
  validateUserRole(userData?.role);
}
