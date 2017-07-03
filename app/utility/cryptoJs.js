/**
 * Created by hebao on 2017/5/24.
 */
import CryptoJS from 'crypto-js';

const _cryptoKey = CryptoJS.enc.Utf8.parse('q(S8E@9$');//密钥
const _cryptoIV = CryptoJS.enc.Hex.parse('14233241505F6E7D');//向量

export function CryptoDES(plainText) {
    return CryptoJS.DES.encrypt(plainText, _cryptoKey, {padding: CryptoJS.pad.Pkcs7, iv: _cryptoIV}).toString();
    // let _encryptedData = CryptoJS.DES.encrypt(plainText, _cryptoKey, {padding: CryptoJS.pad.Pkcs7, iv: _cryptoIV});
    // Util.log('xq debug===_encryptedData:' + _encryptedData + ';typeOf:' + typeof _encryptedData);//Object
    //
    // let _encryptedBase64Str = _encryptedData.toString();
    // Util.log('xq debug===_encryptedBase64Str:' + _encryptedBase64Str + ';typeOf:' + typeof _encryptedBase64Str);//string
    //
    // let _encryptedStr = _encryptedData.ciphertext.toString();
    // Util.log('xq debug===_encryptedStr:' + _encryptedStr + ';typeOf:' + typeof _encryptedStr);//string
    //
    // let _encryptedHexStr = CryptoJS.enc.Hex.parse(_encryptedStr);
    // Util.log('xq debug===_encryptedHexStr:' + _encryptedHexStr + ';typeOf:' + typeof _encryptedHexStr);//Object
    //
    // let _encryptedBase64Str_1 = CryptoJS.enc.Base64.stringify(_encryptedHexStr);
    // Util.log('xq debug===_encryptedBase64Str_1:' + _encryptedBase64Str_1 + ';typeOf:' + typeof _encryptedBase64Str_1);//string
    //
    // //解密
    // let _decryptedData = CryptoJS.DES.decrypt(_encryptedBase64Str_1, _key, {padding: CryptoJS.pad.Pkcs7, iv: _iv});
    // let decryptedStr = _decryptedData.toString(CryptoJS.enc.Utf8);
    // Util.log('xq debug===decryptedStr:' + decryptedStr + ';typeOf:' + typeof decryptedStr);//string
}

export function CryptoMD5(str) {
    return CryptoJS.MD5(str).toString();
}