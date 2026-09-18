import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerProfile } from "@/features/transport-team/types/transport-team.types";
import { MapPin, Phone, User } from "lucide-react";

export function CustomerInfoCard({
  customer,
}: {
  customer: CustomerProfile | null;
}) {
  if (!customer) {
    return (
      <Card className="p-3 shadow-sm m-1">
        <CardContent className="px-0 text-sm text-muted-foreground">
          Customer details unavailable.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gap-2 p-3 shadow-sm m-1 ">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="flex items-center gap-1.5 text-sm">
          <User className="h-4 w-4" />
          {customer.firstName} {customer.lastName}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-0 space-y-1.5">
        {customer.phone && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Phone className="h-3.5 w-3.5 shrink-0" />
            <a href={`tel:${customer.phone}`} className="hover:underline">
              {customer.phone}
            </a>
          </div>
        )}

        {customer.billingAddress && (
          <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>{customer.billingAddress}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
