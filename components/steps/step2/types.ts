export interface props {
  next: () => void;
  prev: () => void;
  isLast: boolean;
}
// ui/steps/step2/types.ts
// ui/steps/step2/types.ts
// ui/steps/step2/types.ts
import { z } from "zod";

export const PLATFORM_OPTIONS = [
  "linkedin",
  "facebook",
  "twitter",
  "instagram",
  "website",
  "other",
] as const;

export type Platform = (typeof PLATFORM_OPTIONS)[number];

export const socialLinkSchema = z.object({
  platform: z.enum(PLATFORM_OPTIONS, {
    required_error: "Platform is required",
  }),
  url: z.string().url("Must be a valid URL"),
  handle: z.string().optional().or(z.literal("")),
});

export const digitalPresenceSchema = z.object({
  support_email: z
    .string()
    .email("Please enter a valid support email address"),

  // ⬇️ At least one link required
  links: z
    .array(socialLinkSchema)
    .min(1, "Add at least one social link"),
});

export type SocialLinkForm = z.infer<typeof socialLinkSchema>;
export type DigitalPresenceForm = z.infer<typeof digitalPresenceSchema>;


