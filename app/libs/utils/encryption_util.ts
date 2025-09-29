import appConfig from '#app/configs/app_config'
import Cryptr from 'cryptr'

class EncryptUtil {
  private KEY_1: string
  private KEY_2: string
  private cryptr1: Cryptr
  private cryptr2: Cryptr

  constructor() {
    this.KEY_1 = appConfig.ENCRYPTION_KEY_1
    this.KEY_2 = appConfig.ENCRYPTION_KEY_2
    this.cryptr1 = new Cryptr(this.KEY_1)
    this.cryptr2 = new Cryptr(this.KEY_2)
  }

  encryptPrivateKey = (privateKey: string) => {
    const encryptedPrivateKey1 = this.cryptr1.encrypt(privateKey)
    const encryptedPrivateKey2 = this.cryptr2.encrypt(encryptedPrivateKey1)

    return encryptedPrivateKey2
  }

  decryptPrivateKey = (encryptedPrivateKey: string) => {
    const decryptedPrivateKey1 = this.cryptr2.decrypt(encryptedPrivateKey)
    const decryptedPrivateKey2 = this.cryptr1.decrypt(decryptedPrivateKey1)

    return decryptedPrivateKey2
  }
}

export default new EncryptUtil()

