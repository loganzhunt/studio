import { z } from "zod";
import {
  WorldviewDataSchema,
  UserInputSchema,
  EnvironmentSchema,
  validateWorldviewData,
  validateUserInput,
  validateEnvironment,
} from "@/lib/validation";

describe("Validation Schemas", () => {
  describe("WorldviewDataSchema", () => {
    const validWorldviewData = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Test Worldview",
      description: "A test worldview for validation",
      scores: {
        ontology: 0.5,
        epistemology: 0.7,
        axiology: 0.3,
      },
    };

    it("validates correct worldview data", () => {
      expect(() => WorldviewDataSchema.parse(validWorldviewData)).not.toThrow();
    });

    it("rejects invalid UUID", () => {
      const invalidData = {
        ...validWorldviewData,
        id: "invalid-uuid",
      };
      expect(() => WorldviewDataSchema.parse(invalidData)).toThrow();
    });

    it("rejects empty name", () => {
      const invalidData = {
        ...validWorldviewData,
        name: "",
      };
      expect(() => WorldviewDataSchema.parse(invalidData)).toThrow();
    });

    it("rejects name that is too long", () => {
      const invalidData = {
        ...validWorldviewData,
        name: "a".repeat(101), // Exceeds 100 character limit
      };
      expect(() => WorldviewDataSchema.parse(invalidData)).toThrow();
    });

    it("rejects scores outside valid range", () => {
      const invalidData = {
        ...validWorldviewData,
        scores: {
          ontology: 1.5, // Out of range
          epistemology: 0.7,
        },
      };
      expect(() => WorldviewDataSchema.parse(invalidData)).toThrow();
    });

    it("accepts optional id", () => {
      const { id, ...dataWithoutId } = validWorldviewData;
      expect(() => WorldviewDataSchema.parse(dataWithoutId)).not.toThrow();
    });
  });

  describe("UserInputSchema", () => {
    it("validates safe user input", () => {
      const safeInput = "This is a safe input without any harmful content";
      expect(() => UserInputSchema.parse(safeInput)).not.toThrow();
    });

    it("rejects input with script tags", () => {
      const maliciousInput = '<script>alert("xss")</script>';
      expect(() => UserInputSchema.parse(maliciousInput)).toThrow();
    });

    it("rejects input with SQL injection patterns", () => {
      const sqlInjection = "'; DROP TABLE users; --";
      expect(() => UserInputSchema.parse(sqlInjection)).toThrow();
    });

    it("rejects empty input", () => {
      expect(() => UserInputSchema.parse("")).toThrow();
    });

    it("rejects input that is too long", () => {
      const longInput = "a".repeat(1001); // Exceeds 1000 character limit
      expect(() => UserInputSchema.parse(longInput)).toThrow();
    });
  });

  describe("EnvironmentSchema", () => {
    const validEnv = {
      NEXT_PUBLIC_FIREBASE_API_KEY: "valid-api-key",
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "project.firebaseapp.com",
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: "project-id",
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "project.appspot.com",
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "123456789",
      NEXT_PUBLIC_FIREBASE_APP_ID: "1:123456789:web:abcdef123456",
    };

    it("validates complete environment variables", () => {
      expect(() => EnvironmentSchema.parse(validEnv)).not.toThrow();
    });

    it("rejects missing required variables", () => {
      const { NEXT_PUBLIC_FIREBASE_API_KEY, ...incompleteEnv } = validEnv;
      expect(() => EnvironmentSchema.parse(incompleteEnv)).toThrow();
    });

    it("rejects empty values", () => {
      const invalidEnv = {
        ...validEnv,
        NEXT_PUBLIC_FIREBASE_API_KEY: "",
      };
      expect(() => EnvironmentSchema.parse(invalidEnv)).toThrow();
    });
  });

  describe("Validation Helper Functions", () => {
    describe("validateWorldviewData", () => {
      it("returns success for valid data", () => {
        const validData = {
          name: "Test Worldview",
          description: "A test description",
          scores: { ontology: 0.5 },
        };

        const result = validateWorldviewData(validData);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.name).toBe("Test Worldview");
        }
      });

      it("returns error for invalid data", () => {
        const invalidData = {
          name: "", // Invalid empty name
          description: "A test description",
          scores: { ontology: 0.5 },
        };

        const result = validateWorldviewData(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues).toBeDefined();
        }
      });
    });

    describe("validateUserInput", () => {
      it("returns sanitized input for safe content", () => {
        const safeInput = "This is safe content";
        const result = validateUserInput(safeInput);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(safeInput);
        }
      });

      it("returns error for malicious input", () => {
        const maliciousInput = '<script>alert("xss")</script>';
        const result = validateUserInput(maliciousInput);

        expect(result.success).toBe(false);
      });
    });

    describe("validateEnvironment", () => {
      it("validates environment at startup", () => {
        const validEnv = {
          NEXT_PUBLIC_FIREBASE_API_KEY: "test-key",
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "test.firebaseapp.com",
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: "test-project",
          NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "test.appspot.com",
          NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "123456789",
          NEXT_PUBLIC_FIREBASE_APP_ID: "1:123456789:web:test",
        };

        expect(() => validateEnvironment(validEnv)).not.toThrow();
      });

      it("throws error for invalid environment", () => {
        const invalidEnv = {
          NEXT_PUBLIC_FIREBASE_API_KEY: "", // Invalid empty value
        };

        expect(() => validateEnvironment(invalidEnv)).toThrow();
      });
    });
  });
});
