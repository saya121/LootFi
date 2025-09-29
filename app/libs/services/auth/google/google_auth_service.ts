import { OAuth2Client } from 'google-auth-library'
import AppException from '#app/exceptions/app_exception'
import ErrorCode from '#app/exceptions/error_codes'
import appConfig from '#app/configs/app_config'

const GoogleAuthService = {
  verify: async function (token: string, device: string) {
    try {
      const client = new OAuth2Client()
      let audience = ''
      if (device === 'IOS') {
        audience = appConfig.IOS_GOOGLE_CLIENT_ID
      } else {
        audience = appConfig.ANDROID_GOOGLE_CLIENT_ID
      }
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience
      })

      return ticket.getPayload()

    } catch (e) {
      console.log(`Google Auth Error: ${e}`)
      throw new AppException(
        403,
        ErrorCode.INVALID_ACCESS_TOKEN,
        'Invalid Google token'
      )
    }
  }
}

export default GoogleAuthService
