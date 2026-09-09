// Demo admin credentials for local testing: username "admin", password "Admin123".
// The password itself is never stored — this is the precomputed SHA-256 hex
// digest of "Admin123":
//   node -e "console.log(require('crypto').createHash('sha256').update('Admin123').digest('hex'))"
export const ADMIN_SEED = {
  username: 'admin',
  passwordHash: '3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2',
  email: 'admin@example.com',
  mustChangePassword: true,
}
