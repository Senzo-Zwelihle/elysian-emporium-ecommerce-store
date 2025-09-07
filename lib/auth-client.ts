import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";
import { adminClient } from "better-auth/client/plugins";
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [emailOTPClient(), adminClient(), organizationClient()],
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});
