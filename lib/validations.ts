import { z } from "zod"

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  bio: z.string().min(10, "Bio must be at least 10 characters").max(500, "Bio must be less than 500 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .regex(
      /^[+]?[1-9][\d\s\-().]{8,20}$/,
      "Please enter a valid phone number (e.g., +1 (555) 123-4567 or 555-123-4567)",
    ),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must be less than 100 characters"),
})

export type ProfileFormData = z.infer<typeof profileSchema>
