export interface props {
  next: () => void;
  prev: () => void;
  isLast: boolean;
}
// ui/steps/step2/types.ts
// ui/steps/step2/types.ts
// ui/steps/step2/types.ts
// ui/steps/step2/types.ts

// ui/steps/step2/types.ts

import { z } from "zod";

// Define the platform options as a tuple
export const PLATFORM_OPTIONS = [
  "linkedin",
  "facebook",
  "twitter",
  "instagram",
  "website",
  "other",
] as const;  // `as const` makes the array a tuple with specific string values

// The Platform type will now automatically infer the possible values from PLATFORM_OPTIONS
export type Platform = (typeof PLATFORM_OPTIONS)[number];

// Correct usage of z.enum() with PLATFORM_OPTIONS tuple
export const socialLinkSchema = z.object({
  platform: z.enum(PLATFORM_OPTIONS), // Zod can infer the enum values from the tuple
  url: z.string().url("Must be a valid URL"), // URL validation
  handle: z.string().optional().or(z.literal("")), // Optional handle (can be empty)
});

// Main schema for the form (support email and social links)
export const digitalPresenceSchema = z.object({
  support_email: z
    .string()
    .email("Please enter a valid support email address"), // Email validation

  // At least one link is required
  links: z
    .array(socialLinkSchema)
    .min(1, "Add at least one social link"), // Ensure there's at least one social link
});

// Inferred types from the schemas
export type SocialLinkForm = z.infer<typeof socialLinkSchema>;
export type DigitalPresenceForm = z.infer<typeof digitalPresenceSchema>;



