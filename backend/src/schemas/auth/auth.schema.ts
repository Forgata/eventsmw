import z from "zod";

export const RegisterSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Name must be alt least 2 characters")
      .max(30, "Name is too long"),
    email: z.email("Inavlid email format").trim().toLowerCase(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    phoneNumber: z.string().optional(),
    interests: z.array(z.string()).optional(),
  }),
});

export const LoginSchema = z.object({
  body: z.object({
    email: z.email("Invalid email format").trim().toLowerCase(),
    password: z
      .string()
      .min(3, "Password must be at least 3 characters")
      .max(100, "Password is too long"),
  }),
});

export const RefreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().nonempty("Refresh token is required"),
  }),
});

export const LogoutSchema = z.object({
  body: z.object({
    refreshToken: z.string().nonempty("Refresh token is required"),
  }),
});

export type RefreshTokenBody = z.infer<typeof RefreshTokenSchema>["body"];
export type LogoutBody = z.infer<typeof LogoutSchema>["body"];
export type LoginBody = z.infer<typeof LoginSchema>["body"];
export type RegisterBody = z.infer<typeof RegisterSchema>["body"];
