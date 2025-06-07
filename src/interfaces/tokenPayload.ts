export interface TokenPayload {
  id: number
  email: string
  username: string
  fullname?: string | null
  profilePictureURL?: string | null
  iat?: number
  exp?: number
}
