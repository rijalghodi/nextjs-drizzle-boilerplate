import { z } from "zod";

export const getPasswordSchema = (minLength = 8) => {
  return z.string().min(minLength, {
    message: `Password harus lebih dari ${minLength} karakter`,
  });
  // .regex(/[A-Z]/, {
  //   message: "Password must contain at least one uppercase letter.",
  // })
  // .regex(/[a-z]/, {
  //   message: "Password must contain at least one lowercase letter.",
  // })
  // .regex(/\d/, {
  //   message: "Password must contain at least one number.",
  // })
  // .regex(/[!@#$%^&*(),.?":{}|<>]/, {
  //   message: "Password must contain at least one special character.",
  // });
};

export const booleanSchema = () => z.string().transform((val) => val === "true");
