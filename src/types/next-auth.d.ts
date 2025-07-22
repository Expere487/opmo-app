import "next-auth"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username?: string
      teams?: Array<{
        id: number
        name: string
        role: string
      }>
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    username?: string
    teams?: Array<{
      id: number
      name: string
      role: string
    }>
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string
    teams?: Array<{
      id: number
      name: string
      role: string
    }>
  }
} 