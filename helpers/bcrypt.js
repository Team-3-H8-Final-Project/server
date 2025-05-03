const bcrypt = require('bcryptjs');

async function hashPassword(inputPassword) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(inputPassword, salt);
    return hash
}

async function comparePassword(inputPassword, hashedPassword) {
    const isValid = await bcrypt.compare(inputPassword, hashedPassword)
    return isValid
}


module.exports = {
    hashPassword,
    comparePassword
}