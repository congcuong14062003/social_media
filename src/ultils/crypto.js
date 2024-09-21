import JSEncrypt from 'jsencrypt';

export function decryptRSA(encryptedText, privateKey) {
  const decrypt = new JSEncrypt();
  decrypt.setPrivateKey(privateKey);
  const decrypted = decrypt.decrypt(encryptedText);
  return decrypted;
}
