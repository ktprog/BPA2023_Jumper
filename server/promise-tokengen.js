const crypto = require('crypto');

/**
 * Purpose: Generates a random string of characters and numbers, using a number for its bytes. The string length is the size * 2.
 * @param {number} bytes 
 * @returns A randomly generated token/string.
 */
const GenerateToken = (size) => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(size, (err, buffer) => {
            if(err)
                return reject(err);
            resolve(buffer.toString('hex'))
        });
    });
};

module.exports = { GenerateToken };