'use strict';

const crypto = require('crypto');

const IV_LENGTH = 16; // For AES, this is always 16

const encrypt = (text, KEY) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(KEY), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

const decrypt = (text, KEY) => {
    const textParts = text.split(':');
    const iv = new Buffer(textParts.shift(), 'hex');
    const encryptedText = new Buffer(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(KEY), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}

module.exports = { decrypt, encrypt };