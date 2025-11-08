export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+62|08)[0-9]{9,}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}

export const validateLicensePlate = (plate: string): boolean => {
  return plate.trim().length > 0 && plate.length <= 20
}

export const validateFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"]

  if (file.size > maxSize) {
    return { valid: false, error: "File size exceeds 5MB limit" }
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Only JPG, PNG, and WEBP formats are allowed" }
  }

  return { valid: true }
}

export const generateMemberNumber = (): string => {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "")
  const randomNum = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  return `MBW-${dateStr}-${randomNum}`
}
