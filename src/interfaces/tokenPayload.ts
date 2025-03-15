export interface TokenPayload {
  id: number
  email: string
  username: string
  fullname?: string | null
  iat?: number
  exp?: number
}
