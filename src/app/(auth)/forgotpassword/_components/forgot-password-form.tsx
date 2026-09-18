"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2Icon, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setIsLoading(true);
      setMessage("");

      // TODO:
      // Call your forgot password API here
      //
      // Example:
      // await forgotPassword(email);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMessage(
        "If an account exists with this email, you will receive a password reset link.",
      );
    } catch (error) {
      console.error("Forgot password failed:", error);

      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Forgot Password?
          </h1>

          <p className="text-muted-foreground">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                type="email"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>

            {message && (
              <p className="text-center text-sm text-muted-foreground">
                {message}
              </p>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
}
