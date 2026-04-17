type CookieOptions = {
  maxAge?: number
  path?: string
  sameSite?: "Strict" | "Lax" | "None"
  secure?: boolean
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${encodeURIComponent(name)}=`))
  return match ? decodeURIComponent(match.slice(match.indexOf("=") + 1)) : null
}

export function setCookie(name: string, value: string, options: CookieOptions = {}) {
  const {
    maxAge,
    path = "/",
    sameSite = "Lax",
    secure = window.location.protocol === "https:",
  } = options

  const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`]
  parts.push(`path=${path}`)
  parts.push(`SameSite=${sameSite}`)
  if (maxAge !== undefined) parts.push(`max-age=${maxAge}`)
  if (secure) parts.push("Secure")

  document.cookie = parts.join("; ")
}

export function removeCookie(name: string, path = "/") {
  document.cookie = `${encodeURIComponent(name)}=; path=${path}; max-age=0`
}
