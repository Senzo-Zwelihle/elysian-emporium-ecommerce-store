import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";
import { admin } from "better-auth/plugins";
import { organization } from "better-auth/plugins";
import { env } from "@/env/server";
import { prisma } from "@/lib/prisma/client";
import { resend } from "@/lib/email/resend";
import ResetPasswordEmail from "@/components/emails/reset-password";
import EmailVerification from "@/components/emails/email-verification";
import OneTimePasswordEmail from "@/components/emails/one-time-password";


export const auth = betterAuth({
  // database setup
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // social providers github/google
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },

  // basic authentication
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      resend.emails.send({
        from: "Elysian Emporium Store <onboarding@resend.dev>",
        to: user.email,
        subject: "Reset your password",
        react: ResetPasswordEmail({
          username: user.name,
          resetUrl: url,
          userEmail: user.email,
        }),
      });
    },
    requireEmailVerification: false,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      resend.emails.send({
        from: "Elysian Emporium Store <onboarding@resend.dev>",
        to: user.email,
        subject: "Verify your email",
        react: EmailVerification({ username: user.name, verifyUrl: url }),
      });
    },
    sendOnSignUp: true,
  },

  // plugins configuration

  plugins: [
    // admin
    admin(),

    // organization/ teams
    organization(),
    // email one time password
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        // sending otp to user
        await resend.emails.send({
          from: "Elysian Emporium Store <onboarding@resend.dev>",
          to: [email],
          subject: "One time Password Verification",
          react: OneTimePasswordEmail({
            username: email,
            userEmail: email,
            otp,
          }),
        });
      },
    }),
    // next cookies plugin must always be last in the array
    nextCookies(),
  ],
});
