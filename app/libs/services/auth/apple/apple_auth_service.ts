import axios from 'axios'
import jwt from 'jsonwebtoken'
import jwkToPem from 'jwk-to-pem'
import crypto from 'crypto'
import AppException from '#app/exceptions/app_exception'
import ErrorCodes from '#app/exceptions/error_codes'
import appConfig from '#app/configs/app_config'

const AppleAuthService = {
  verify: async function (
    identityToken: string,
    rawNonce: string
  ) {
    try {
      const clientId = appConfig.APPLE_CLIENT_ID

      // Step 1: Fetch Apple's public keys
      const appleKeysUrl = 'https://appleid.apple.com/auth/keys'
      const response = await axios.get(appleKeysUrl)
      const appleKeys = response.data.keys

      // Step 2: Decode the token's header to find the matching key
      const decodedToken = jwt.decode(identityToken, { complete: true })
      const appleKey = appleKeys.find(
        (key) => key.kid === decodedToken.header.kid
      )

      if (!appleKey) {
        throw new AppException(403, ErrorCodes.INVALID_ACCESS_TOKEN, 'Invalid Apple token')
      }

      // Step 3: Convert JWK (JSON Web Key) to PEM format for verification
      const publicKey = jwkToPem(appleKey)

      // Step 4: Verify the token's signature and extract the payload
      const verifiedPayload = jwt.verify(identityToken, publicKey, {
        algorithms: ['RS256']
      })

      // Step 5: Verify the `iss` field (Issuer)
      if (verifiedPayload.iss !== 'https://appleid.apple.com') {
        throw new AppException(403, ErrorCodes.INVALID_ACCESS_TOKEN, 'Invalid Apple token')
      }

      // Step 6: Verify the `aud` (client id)
      if (verifiedPayload.aud !== clientId) {
        throw new AppException(403, ErrorCodes.INVALID_ACCESS_TOKEN, 'Invalid Apple token')
      }

      // Step 7: Verify the `exp` field (Token expiration)
      const currentTime = Math.floor(Date.now() / 1000)
      if (currentTime > verifiedPayload.exp) {
        throw new AppException(403, ErrorCodes.INVALID_ACCESS_TOKEN, 'Invalid Apple token')
      }

      const expectedNonce = this.hashNonce(rawNonce)

      // Step 8: Verify the nonce
      if (verifiedPayload.nonce !== expectedNonce) {
        throw new AppException(403, ErrorCodes.INVALID_ACCESS_TOKEN, 'Invalid Apple token')
      }

      // Return verified payload if all checks pass
      return verifiedPayload
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppException(403, ErrorCodes.INVALID_ACCESS_TOKEN, 'Invalid Apple token')
      }

      throw new AppException(500, ErrorCodes.SYSTEM_ERROR, 'Internal server error')
    }
  },

  hashNonce (rawNonce: string) {
    return crypto.createHash('sha256').update(rawNonce).digest('hex')
  }
}

export default AppleAuthService
