const bcrypt = require('bcrypt');

async function hashPassword(password){
    const saltRounds = 12;
    const hashedPassword = bcrypt.hash(password, saltRounds);

    return hashedPassword;
};

async function verifyPassword(password, hashedPassword){
    return bcrypt.compare(password, hashedPassword);
};

module.exports = {
    hashPassword,
    verifyPassword,
}
