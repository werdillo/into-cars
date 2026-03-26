import { z } from "zod";

export const idSchema = z.string().min(1);

export const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug");

export const timestampSchema = z.coerce.date();

export const baseEntitySchema = z.object({
  id: idSchema,
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

export const seoSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  description: z.string().min(1).max(300).optional(),
  image: z.string().url().optional(),
});

export const localeSchema = z.enum(["ru", "en"]);

export const translationSchema = z.object({
  locale: localeSchema,
  title: z.string().min(1),
  description: z.string().optional(),
});

export const carBodyTypeSchema = z.enum([
  "sedan",
  "suv",
  "hatchback",
  "wagon",
  "coupe",
  "convertible",
  "pickup",
  "van",
]);

export const fuelTypeSchema = z.enum([
  "gasoline",
  "diesel",
  "hybrid",
  "electric",
  "lpg",
]);

export const transmissionSchema = z.enum([
  "manual",
  "automatic",
  "robot",
  "cvt",
]);

export const driveTypeSchema = z.enum(["fwd", "rwd", "awd", "4wd"]);

export const carSchema = baseEntitySchema.extend({
  slug: slugSchema,
  brand: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  bodyType: carBodyTypeSchema,
  fuelType: fuelTypeSchema,
  transmission: transmissionSchema,
  driveType: driveTypeSchema,
  mileage: z.number().int().nonnegative(),
  price: z.number().nonnegative(),
  currency: z.string().length(3),
  color: z.string().min(1).optional(),
  vin: z.string().min(1).optional(),
  photos: z.array(z.string().url()).default([]),
  seo: seoSchema.optional(),
});

export const createCarSchema = carSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateCarSchema = createCarSchema.partial();

export const carListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  brand: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
  bodyType: carBodyTypeSchema.optional(),
  fuelType: fuelTypeSchema.optional(),
  transmission: transmissionSchema.optional(),
  driveType: driveTypeSchema.optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  minYear: z.coerce.number().int().optional(),
  maxYear: z.coerce.number().int().optional(),
});

export const cmsUserRoleSchema = z.enum(["admin", "editor"]);

export const cmsUserSchema = baseEntitySchema.extend({
  email: z.string().email(),
  name: z.string().min(1),
  role: cmsUserRoleSchema,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const sessionSchema = z.object({
  token: z.string().min(1),
  user: cmsUserSchema,
});

export type Id = z.infer<typeof idSchema>;
export type Slug = z.infer<typeof slugSchema>;
export type Timestamp = z.infer<typeof timestampSchema>;
export type BaseEntity = z.infer<typeof baseEntitySchema>;
export type Seo = z.infer<typeof seoSchema>;
export type Locale = z.infer<typeof localeSchema>;
export type Translation = z.infer<typeof translationSchema>;
export type CarBodyType = z.infer<typeof carBodyTypeSchema>;
export type FuelType = z.infer<typeof fuelTypeSchema>;
export type Transmission = z.infer<typeof transmissionSchema>;
export type DriveType = z.infer<typeof driveTypeSchema>;
export type Car = z.infer<typeof carSchema>;
export type CreateCar = z.infer<typeof createCarSchema>;
export type UpdateCar = z.infer<typeof updateCarSchema>;
export type CarListQuery = z.infer<typeof carListQuerySchema>;
export type CmsUserRole = z.infer<typeof cmsUserRoleSchema>;
export type CmsUser = z.infer<typeof cmsUserSchema>;
export type Login = z.infer<typeof loginSchema>;
export type Session = z.infer<typeof sessionSchema>;
