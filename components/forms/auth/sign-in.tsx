"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import GoogleIcon from "@/components/icons/google";
import GitHubIcon from "@/components/icons/github";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/loader";
import { signInAction } from "@/server/actions/auth/user";
import { signInFormSchema } from "@/schemas/auth/sign-in";
import ElysianEmporiumSignInDark from "@/public/assets/designs/sign-up-design-dark.png";
import ElysianEmporiumSignInLight from "@/public/assets/designs/sign-up-design-light.png";

const SignInForm = ({ className, ...props }: React.ComponentProps<"div">) => {
  // form/socialstates
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [gitHubPending, startGitHubTransition] = useTransition();
  const [googlePending, startGoogleTransition] = useTransition();

  // validation
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // submit form
  async function onSubmit(values: z.infer<typeof signInFormSchema>) {
    setIsLoading(true);

    const { success, message } = await signInAction(
      values.email,
      values.password
    );

    if (success) {
      toast.success(message as string);
      router.push("/");
    } else {
      toast.error(message as string);
    }

    setIsLoading(false);
  }

  // social sign up
  const signInWithGitHub = () => {
    startGitHubTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in successfully");
          },
          onError: () => {
            toast.error(" Internal Server Error ");
          },
        },
      });
    });
  };

  const signInWithGoogle = () => {
    startGoogleTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in successfully...");
          },
          onError: () => {
            toast.error(" Internal Server Error ");
          },
        },
      });
    });
  };
  return (
    <Form {...form}>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden p-0 bg-background">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-muted-foreground text-balance">
                    Sign into your account
                  </p>
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex flex-col gap-2">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Link
                      href="/forgot-password"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <LoaderIcon className="size-4 animate-spin" />
                  ) : (
                    "Sign In"
                  )}
                </Button>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-background text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full"
                    onClick={signInWithGoogle}
                    disabled={googlePending}
                  >
                    {googlePending ? (
                      <>
                        <Spinner/>
                        {/* <span className="text-sm">Please wait...</span> */}
                      </>
                    ) : (
                      <>
                        <GoogleIcon />
                        <span className="text-base">Google</span>
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    type="button"
                    className="w-full"
                    onClick={signInWithGitHub}
                    disabled={gitHubPending}
                  >
                    {gitHubPending ? (
                      <>
                         <Spinner/>
                        {/* <span className="text-sm">Please wait...</span> */}
                      </>
                    ) : (
                      <>
                        <GitHubIcon />
                        <span className="text-base">GitHub</span>
                      </>
                    )}
                  </Button>
                  {/* <Link href={"/otp-sign-in"}>
                    <Button
                      variant="outline"
                      type="button"
                      className="w-full"
                     
                    >
                      <FingerprintIcon />
                      <span className="text-base">OTP</span>
                    </Button>
                  </Link> */}
                </div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/sign-up"
                    className="underline underline-offset-4"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
            <div className="bg-muted relative hidden md:block">
              <Image
                src={ElysianEmporiumSignInDark}
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:hidden"
              />
              <Image
                src={ElysianEmporiumSignInLight}
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover hidden dark:block"
              />
            </div>
          </CardContent>
        </Card>
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </Form>
  );
};

export default SignInForm;
