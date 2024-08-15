import crypto from "crypto";



export function generateId(prefix) {
  return `${prefix}${crypto.randomBytes(8).toString("hex")}`;
}


export function hashString(input, algorithm = "sha256", encoding = "hex") {
  const hash = crypto.createHash(algorithm);
  hash.update(input);
  return hash.digest(encoding);
}

export function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;
}
