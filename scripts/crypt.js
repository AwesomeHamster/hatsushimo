const crypto = require('crypto')
const { readFileSync, writeFileSync } = require('fs')

const { cac } = require('cac')

try {
  require('dotenv').config()
} catch (e) {}

const algorithm = 'aes-256-ctr'

function hash(/** @type {string} */ input, /** @type {number} */ length) {
  const hashed = crypto.createHash('sha256').update(Buffer.from(input)).digest('base64')
  if (length && length > 0 && length <= 32) {
    return hashed.substring(0, length)
  }
  return hashed
}

function encrypt(/** @type {Buffer} */ content, /** @type {string} */ key) {
  const hashedKey = hash(key, 32)
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, hashedKey, iv)
  const result = Buffer.concat([iv, cipher.update(content), cipher.final()])
  return result
}

function decrypt(/** @type {Buffer} */ encrypted, /** @type {string} */ key) {
  const hashedKey = hash(key, 32)
  const iv = encrypted.slice(0, 16)
  const rest = encrypted.slice(16)
  const decipher = crypto.createDecipheriv(algorithm, hashedKey, iv)
  const result = Buffer.concat([decipher.update(rest), decipher.final()])
  return result
}

const files = [
  `accounts/${process.env['HATSUSHIMO_ONEBOT_SELF_ID']}/device.json`,
  `accounts/${process.env['HATSUSHIMO_ONEBOT_SELF_ID']}/session.token`,
]

const argv = cac('crypt')

argv.command('encrypt', 'encrypt a file').action(() => {
  for (const file of files) {
    const encrypted = encrypt(readFileSync(file), process.env['HATSUSHIMO_ENCRYPT_KEY'])
    const outputName = `accounts/enc/${hash(file, 16)}`
    writeFileSync(outputName, encrypted)
  }
})

argv.command('decrypt', 'decrypt a file').action(() => {
  for (const file of files) {
    const filename = `accounts/enc/${hash(file, 16)}`
    const decryped = decrypt(readFileSync(filename), process.env['HATSUSHIMO_ENCRYPT_KEY'])
    writeFileSync(file, decryped)
  }
})

argv.help()
argv.parse()
