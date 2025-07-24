import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma"

// Parola doğrulama fonksiyonu
export function validatePassword(password: string): { isValid: boolean; message: string } {
  if (password.length < 8) {
    return { isValid: false, message: "Parola en az 8 karakter olmalıdır" };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: "Parola en az bir büyük harf içermelidir" };
  }
  
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: "Parola en az bir sayı içermelidir" };
  }
  
  return { isValid: true, message: "" };
}

// Email doğrulama fonksiyonu
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Username doğrulama fonksiyonu
export function validateUsername(username: string): { isValid: boolean; message: string } {
  if (username.length < 3) {
    return { isValid: false, message: "Kullanıcı adı en az 3 karakter olmalıdır" };
  }
  
  if (username.length > 20) {
    return { isValid: false, message: "Kullanıcı adı en fazla 20 karakter olabilir" };
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { isValid: false, message: "Kullanıcı adı sadece harf, sayı ve alt çizgi içerebilir" };
  }
  
  return { isValid: true, message: "" };
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Eksik bilgi");
          return null
        }

        const user = await prisma.users.findUnique({
          where: {
            user_mail: credentials.email
          },
          include: {
            team_users: {
              include: {
                teams: true
              }
            }
          }
        })

        if (!user) {
          console.log("Kullanıcı bulunamadı");
          return null
        }

        if (!user.hashedPassword) {
          console.log("Şifre alanı yok");
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        )

        if (!isPasswordValid) {
          console.log("Şifre yanlış");
          return null
        }

        return {
          id: user.id,
          email: user.user_mail,
          name: user.username,
          username: user.username,
          teams: user.team_users.map(tu => ({
            id: tu.teams.id,
            name: tu.teams.team_name,
            role: tu.role
          }))
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = (user as any).username
        token.teams = (user as any).teams
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        ;(session.user as any).username = token.username
        ;(session.user as any).teams = token.teams
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  }
}