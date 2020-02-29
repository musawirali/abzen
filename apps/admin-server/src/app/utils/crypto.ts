import crypto from 'crypto';

/**
 * Generate random bytes to use as encryption salt.
 */
export const generateSalt = () => crypto.randomBytes(16).toString('hex');

/**
 * Encrypts password using the salt
 *
 * @param password
 * @param salt
 */
export const encryptPassword = (password: string, salt: string): string => {
  const hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  return hash.digest('hex');
};