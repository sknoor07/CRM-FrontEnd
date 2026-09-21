"use client";

import { useEffect, useState } from "react";
import { LoginDetails } from "../../../../types";
import { motion } from "framer-motion";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Eye,
  EyeOff,
  GitBranch,
  Loader2Icon,
  LucideGitBranchMinus,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { loginUser } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [loginDetails, setLoginDetails] = useState<LoginDetails>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const data = await loginUser(loginDetails);

      useAuthStore
        .getState()
        .setAuth(data.accessToken, data.user, data.userProfile);

      console.log("Login Successful", data);

      router.push("/dashboard");
    } catch (error: any) {
      console.log("Login Failed:", error);

      const message =
        error?.response?.data?.error ||
        "Unable to login. Please check your credentials.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Please enter your email and password to login
            </p>
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="Enter Email here..."
                    value={loginDetails.email}
                    onChange={(e) =>
                      setLoginDetails({
                        ...loginDetails,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Password here "
                      value={loginDetails.password}
                      className="relative"
                      onChange={(e) =>
                        setLoginDetails({
                          ...loginDetails,
                          password: e.target.value,
                        })
                      }
                    />
                    <Button
                      type="button"
                      variant={"ghost"}
                      onClick={() => setShowPassword(!showPassword)}
                      className="cursor-pointer absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </Button>
                  </div>
                </div>
                <div className="flex item-center justify-end">
                  <Button
                    type="button"
                    variant={"ghost"}
                    className="cursor-pointer text-primary hover:text-primary-hover"
                    onClick={() => router.push("/forgotpassword")}
                  >
                    Forgot Password
                  </Button>
                  
                </div>
               
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    "Login"
                  )}
                </Button>
                 {error && (
                    <div className="rounded-md bg-red-50 border border-red-200 px-4  text-sm text-red-600">
                      {error}
                    </div>
                  )}
              </div>
            </form>
            <div className="relative mt-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t " />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant={"outline"} className="w-full cursor-pointer">
                <Mail className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button variant={"outline"} className="w-full cursor-pointer">
                <GitBranch className="mr-2 h-4 w-4" />
                Github
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
