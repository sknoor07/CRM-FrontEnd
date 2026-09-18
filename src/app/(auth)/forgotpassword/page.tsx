"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import ForgotPasswordForm from "./_components/forgot-password-form";

export default function ForgotPasswordPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-linear-to-br from-primary-50 to-primary-100 flex flex-col items-center justify-center p-4">
      {/* Back Button */}
      <Button
        type="button"
        variant="ghost"
        onClick={() => router.back()}
        className="absolute top-6 left-6 cursor-pointer"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <ForgotPasswordForm />
    </div>
  );
}
