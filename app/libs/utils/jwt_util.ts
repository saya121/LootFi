import jwt from 'jsonwebtoken'
import appConfig from '#app/configs/app_config'

export type JwtPayload = {
  sub: string
  steamId: string
}

const JwtUtil = {
  sign(payload: JwtPayload, expiresIn: string | number = '2h') {
    return jwt.sign(payload, appConfig.JWT_SECRET, { expiresIn })
  },
  verify<T = JwtPayload>(token: string): T {
    return jwt.verify(token, appConfig.JWT_SECRET) as T
  }
}

export default JwtUtil

