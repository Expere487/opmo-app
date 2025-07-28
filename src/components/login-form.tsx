"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { GalleryVerticalEnd } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LoginFormProps extends React.ComponentProps<"div"> {
  onSuccess?: () => void;
}

export function LoginForm({
  className,
  onSuccess,
  ...props
}: LoginFormProps) {
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    teamName: "",
  })
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (isRegister) {
        // Register işlemi
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            username: formData.username,
            password: formData.password,
            teamName: formData.teamName,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || "Bir hata oluştu")
          return
        }

        // Başarılı kayıt sonrası otomatik login
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (result?.error) {
          setError("Kayıt başarılı ancak giriş yapılamadı")
          return
        }

        if (onSuccess) {
          onSuccess()
        } else {
          router.push("/sites")
        }
      } else {
        // Login işlemi
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (result?.error) {
          setError("Email veya parola hatalı")
          return
        }

        if (onSuccess) {
          onSuccess()
        } else {
          router.push("/sites")
        }
      }
    } catch (error) {
      setError("Bağlantı hatası")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Opmo App</span>
            </a>
            <h1 className="text-xl font-bold">
              {isRegister ? "Hesap Oluştur" : "Hoş Geldiniz"}
            </h1>
            <div className="text-center text-sm">
              {isRegister ? (
                <>
                  Zaten hesabınız var mı?{" "}
                  <button
                    type="button"
                    onClick={() => setIsRegister(false)}
                    className="underline underline-offset-4"
                  >
                    Giriş yapın
                  </button>
                </>
              ) : (
                <>
                  Hesabınız yok mu?{" "}
                  <button
                    type="button"
                    onClick={() => setIsRegister(true)}
                    className="underline underline-offset-4"
                  >
                    Kayıt olun
                  </button>
                </>
              )}
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            {isRegister && (
              <div className="grid gap-2">
                <Label htmlFor="username">Kullanıcı Adı</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="kullaniciadi"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="password">Parola</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={isRegister ? "En az 8 karakter, 1 büyük harf, 1 sayı" : "Parolanız"}
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            {isRegister && (
              <div className="grid gap-2">
                <Label htmlFor="teamName">Takım Adı</Label>
                <Input
                  id="teamName"
                  name="teamName"
                  type="text"
                  placeholder="Takım adınız"
                  value={formData.teamName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Lütfen bekleyin..." : (isRegister ? "Kayıt Ol" : "Giriş Yap")}
            </Button>
          </div>
        </div>
      </form>
      
      <div className="text-muted-foreground text-center text-xs text-balance">
        {isRegister && (
          <>
            Devam ederek <a href="#" className="underline underline-offset-4">Kullanım Şartları</a>{" "}
            ve <a href="#" className="underline underline-offset-4">Gizlilik Politikası</a>'nı kabul etmiş olursunuz.
          </>
        )}
      </div>
    </div>
  )
}
