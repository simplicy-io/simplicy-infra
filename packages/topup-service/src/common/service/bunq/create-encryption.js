// eslint-disable-next-line @typescript-eslint/no-var-requires
const forge = require('node-forge');
/**
 * Example on how to generate a random AES key and re-use it afterwards
 * @param password
 * @param iv
 * @returns {{key: the|*, iv: the|*}}
 */
const derivePassword = (password, keySize = 32, iv = false) => {
    // generate a random iv
    let passwordIv;
    if (iv) {
        // turn existing iv into bytes
        passwordIv = forge.util.hexToBytes(iv);
    } else {
        // generate a new random iv
        passwordIv = forge.random.getBytesSync(keySize);
    }

    // amount of pbkdf2 iterations,
    const iterations = 300000;

    // derive a 16 bit key from the password and iv
    const derivedBytes = forge.pkcs5.pbkdf2(password, passwordIv, iterations, keySize);

    // turn derivedBytes into a readable string
    const encryptionKey = forge.util.bytesToHex(derivedBytes);

    // turn passwordIv into a readable string
    const encryptionIv = forge.util.bytesToHex(passwordIv);

    return {
        key: encryptionKey,
        iv: encryptionIv
    };
};

/**
 * Basic function just to generate a random AES key
 * @param keySize
 */
const generateRandomKey = (keySize = 16) => {
    // random bytes
    const key = forge.random.getBytesSync(keySize);

    // straight to hex and return it
    return forge.util.bytesToHex(key);
};

module.exports = { generateRandomKey, derivePassword };
