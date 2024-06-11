import crypto from 'crypto';

/**
 * Generates a random secure password.
 */
export function generateSecurePassword(length: number) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_+~`?><=';
    let password = '';
    const values = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
        password += charset[values[i] % charset.length];
    }

    return password;
}