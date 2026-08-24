"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BorderBeam } from "@/components/ui/border-beam"; // Import BorderBeam

export default function LoginPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  if (!isLoaded) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
      }
    } catch (err) {
      setError(err.errors?.[0]?.message || "Invalid email or password.");
    }
  };

  const handleSocialLogin = (strategy) => {
    return signIn.authenticateWithRedirect({
      strategy,
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    });
  };

  return (
    <div className="flex w-full min-h-screen flex-col items-center justify-center bg-[#09090b] text-white px-4">
      <div className="w-full max-w-[420px] mx-auto flex flex-col">
        {/* Logo and Brand Name */}
        <Link
          href="#"
          className="flex items-center justify-center gap-2 font-medium"
        >
          <div className="flex size-20 items-center justify-center rounded-md bg-transparent">
            <Image
              src="/logo.png"
              alt="Logo"
              width={96}
              height={96}
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Main Form Box with BorderBeam */}
        <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-[#121215] p-6 sm:p-8 shadow-2xl">
          {/* Border Beam Component */}
          <BorderBeam
            size={200}
            duration={8}
            colorFrom="#a855f7"
            colorTo="#ec4899"
          />

          <div className="flex flex-col items-center text-center mb-6">
            <h1 className="text-xl font-semibold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Login with your Apple or Google account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2.5">
              <Button
                variant="outline"
                type="button"
                disabled
                className="w-full  bg-[#18181b] border-zinc-800 text-white hover:bg-zinc-800 hover:text-white h-10 flex items-center justify-center gap-2"
                onClick={() => handleSocialLogin("oauth_apple")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-current"
                >
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                </svg>
                Login with Apple
              </Button>

              <Button
                variant="outline"
                type="button"
                className="w-full cursor-pointer bg-[#18181b] border-zinc-800 text-white hover:bg-zinc-800 hover:text-white h-10 flex items-center justify-center gap-2"
                onClick={() => handleSocialLogin("oauth_google")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-4 h-4"
                >
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.3 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.9 6.4C.7 8.8 0 10.3 0 12s.7 3.2 1.9 5.6l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.3L1.9 15c1.8 3.8 5.6 8 10.1 8z"
                  />
                </svg>
                Login with Google
              </Button>
            </div>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#121215] px-2 text-zinc-500 tracking-wider">
                  Or continue with
                </span>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center">{error}</p>
            )}

            <div className="grid gap-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-medium text-zinc-300"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#18181b] border-zinc-800 text-white h-10 focus-visible:ring-0 focus-visible:border-zinc-500"
                required
              />
            </div>

            <div className="grid gap-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-xs font-medium text-zinc-300"
                >
                  Password
                </Label>

                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  disabled
                  className="h-auto p-0 cursor-not-allowed text-xs text-zinc-400 hover:text-white"
                >
                  Forgot your password?
                </Button>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#18181b] border-zinc-800 text-white h-10 focus-visible:ring-0 focus-visible:border-zinc-500"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer bg-purple-600 text-white hover:bg-purple-700 active:scale-[0.98] transition-all duration-200 h-10 font-medium mt-2 shadow-lg shadow-purple-600/25 border border-purple-500/30"
            >
              Login
            </Button>

            <div className="text-center text-xs text-zinc-400 mt-2">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="font-medium cursor-pointer text-white hover:underline"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>

        <div className="text-center text-xs mt-1 text-zinc-500 px-4">
          By clicking continue, you agree to our{" "}
          <a href="#" className="underline hover:text-zinc-400">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-zinc-400">
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </div>
  );
}
