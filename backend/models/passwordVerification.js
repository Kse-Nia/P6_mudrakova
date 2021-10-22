const passwordValidation = require('password-validator');

// Create a schema
const schema = new passwordValidation();

passwordSchema
    .is().min(8) // Min length 8
    .is().max(100) // Max length 100
    .has().uppercase() // Uppercase letters
    .has().lowercase() // Lowercase letters
    .has().digits(2) // At least 2 digits
    .has().not().spaces() // No space
    .is().not().oneOf(['Passw0rd', 'Password123']); // Interdiction

module.exports = passwordSchema;