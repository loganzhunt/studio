import { z } from "zod";

// Worldview validation schemas
export const WorldviewNameSchema = z
  .string()
  .min(1, "Worldview name is required")
  .max(100, "Worldview name must be less than 100 characters")
  .regex(
    /^[a-zA-Z0-9\s\-_.]+$/,
    "Worldview name can only contain letters, numbers, spaces, hyphens, underscores, and periods"
  );

export const WorldviewDescriptionSchema = z
  .string()
  .max(1000, "Description must be less than 1000 characters")
  .optional();

export const FacetScoreSchema = z
  .number()
  .min(0, "Score must be between 0 and 1")
  .max(1, "Score must be between 0 and 1");

export const WorldviewDataSchema = z.object({
  id: z.string().uuid().optional(),
  name: WorldviewNameSchema,
  description: WorldviewDescriptionSchema,
  scores: z.record(z.string().min(1), FacetScoreSchema),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// User input validation for forms
export const UserInputFormSchema = z.object({
  worldviewName: WorldviewNameSchema,
  description: WorldviewDescriptionSchema,
  selectedFacet: z.string().min(1).optional(),
  score: FacetScoreSchema.optional(),
});

// Simple user input validation for strings (matching test expectations)
export const UserInputSchema = z
  .string()
  .min(1, "Input cannot be empty")
  .max(1000, "Input must be less than 1000 characters")
  .refine((value) => {
    // Check for script tags
    if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(value)) {
      return false;
    }
    // Check for SQL injection patterns
    if (
      /('|(\\)|;|--|\/\*|\*\/|xp_|sp_|@|\bexec\b|\bunion\b|\bselect\b|\binsert\b|\bupdate\b|\bdelete\b|\bdrop\b)/i.test(
        value
      )
    ) {
      return false;
    }
    return true;
  }, "Input contains potentially malicious content");

// Assessment input validation
export const AssessmentInputSchema = z.object({
  facetId: z.string().min(1, "Facet ID is required"),
  score: FacetScoreSchema,
  confidence: z.number().min(0).max(1).optional(),
  notes: z
    .string()
    .max(500, "Notes must be less than 500 characters")
    .optional(),
});

// Environment variable validation (matching test expectations)
export const EnvironmentSchema = z.object({
  NEXT_PUBLIC_FIREBASE_API_KEY: z
    .string()
    .min(1, "Firebase API key is required"),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z
    .string()
    .min(1, "Firebase auth domain is required"),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z
    .string()
    .min(1, "Firebase project ID is required"),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z
    .string()
    .min(1, "Firebase storage bucket is required"),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z
    .string()
    .min(1, "Firebase messaging sender ID is required"),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1, "Firebase app ID is required"),
});

// Legacy alias for internal use
export const EnvSchema = EnvironmentSchema;

// Validation helper functions
export const validateEnvVars = () => {
  try {
    EnvSchema.parse({
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID:
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
        process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
        process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Environment validation failed:", error.errors);
      return {
        success: false,
        errors: error.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
      };
    }
    return { success: false, errors: ["Unknown validation error"] };
  }
};

export const validateUserInput = (input: unknown) => {
  return UserInputSchema.safeParse(input);
};

export const validateUserInputForm = (input: unknown) => {
  return UserInputFormSchema.safeParse(input);
};

export const validateWorldviewData = (data: unknown) => {
  return WorldviewDataSchema.safeParse(data);
};

export const validateAssessmentInput = (input: unknown) => {
  return AssessmentInputSchema.safeParse(input);
};

export const validateEnvironment = (env: unknown) => {
  const result = EnvironmentSchema.safeParse(env);
  if (!result.success) {
    throw new Error(
      `Environment validation failed: ${result.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join(", ")}`
    );
  }
  return result.data;
};

// Sanitization helpers
export const sanitizeString = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocols
    .replace(/data:/gi, ""); // Remove data: protocols
};

export const sanitizeHtml = (input: string): string => {
  // Simple HTML sanitization - for production use a proper library like DOMPurify
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "");
};

// Type exports
export type WorldviewData = z.infer<typeof WorldviewDataSchema>;
export type UserInput = z.infer<typeof UserInputSchema>;
export type UserInputForm = z.infer<typeof UserInputFormSchema>;
export type AssessmentInput = z.infer<typeof AssessmentInputSchema>;
export type Environment = z.infer<typeof EnvironmentSchema>;
