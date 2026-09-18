import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(1, "اسم المستخدم مطلوب"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const appSettingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});
