"use client";

import {
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { JobDetailsCustomer } from "@/features/cs/types/job-details.types";

interface CustomerInfoProps {
  customer: JobDetailsCustomer;
}

export function CustomerInfo({
  customer,
}: CustomerInfoProps) {
  const fullName = `${customer.firstName} ${customer.lastName}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserRound className="h-5 w-5" />
          Customer Information
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Name */}
          <div className="flex items-start gap-3">
            <UserRound className="mt-0.5 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Name
              </p>

              <p className="font-medium">
                {fullName}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Email
              </p>

              <p className="break-all font-medium">
                {customer.email}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Phone
              </p>

              <p className="font-medium">
                {customer.phone || "Not provided"}
              </p>
            </div>
          </div>

          {/* Billing Address */}
          <div className="flex items-start gap-3 sm:col-span-2 lg:col-span-2">
            <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Billing Address
              </p>

              <p className="font-medium">
                {customer.billingAddress || "Not provided"}
              </p>
            </div>
          </div>

          {/* GSTIN */}
          {customer.gstin && (
            <div>
              <p className="text-xs text-muted-foreground">
                GSTIN
              </p>

              <p className="font-mono text-sm font-medium">
                {customer.gstin}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}