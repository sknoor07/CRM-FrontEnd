import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitTransportApproveJob } from "@/features/transport/hooks/useSubmitTransportApproveJob";
import {
  ListofTransportPerson,
  TMGetAllJobForPickup,
  TransportPerson,
} from "@/features/transport/types/transport.types";
import api from "@/lib/api-client";
import { useAuthStore } from "@/store/auth.store";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  MapPin,
  Monitor,
  Phone,
  Smartphone,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface TmJobCardProps {
  detailedjob: TMGetAllJobForPickup;
  onAssigned: () => void;
}
const TmJobCard = ({ detailedjob, onAssigned }: TmJobCardProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [transportTeamPerson, setTransportTeamPerson] = useState<
    TransportPerson[]
  >([]);
  const [comment, setComment] = useState<string>("");
  const [isdisabled, setIsdisabled] = useState<boolean>(true);
  const [selectedTransportPersonId, setSelectedTransportPersonId] =
    useState<string>("");
  const { submit, isSubmitting, error, success } =
    useSubmitTransportApproveJob();

  async function getTransportPersonList() {
    if (isSubmitting) {
      return (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />

          <span>Loading pending jobs…</span>
        </div>
      );
    }
    if (error) {
      return (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <span>{error}</span>
        </div>
      );
    }
    const result = await api.get<ListofTransportPerson>(
      "/transport/pickup-persons",
    );
    setTransportTeamPerson(result.data.pickupPersonDetails);
  }
  useEffect(() => {
    getTransportPersonList();
  }, []);

  const handlejobAssignment = async () => {
    const payload = {
      jobId: detailedjob.job.id,
      transportPersonId: selectedTransportPersonId,
      comment: comment,
    };
    try {
      const result = await submit(payload);
      if (result.status === "success") {
        toast.success("Job verification submitted successfully", {
          description: `Job ${detailedjob.job.jobNumber} has been assigned.`,
        });
        onAssigned();
      }
    } catch (err) {
      toast.error("Failed to Assign.. please contact IT Team ");
    }
  };

  return (
    <div>
      <Card className=" p-2">
        <CardHeader>
          <div className="flex justify-between">
            <div className="flex flex-col">
              <CardTitle>
                <span className="text-lg ">
                  Job Id: {detailedjob.job.jobNumber}
                </span>
              </CardTitle>
              <CardDescription>
                <h1 className="font-extrabold bg-linear-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                  Assign a pickup person
                </h1>
              </CardDescription>
              <h2>Items: {detailedjob.jobItems.length ?? 0}</h2>
            </div>
            <div className="flex flex-col">
              <p>Location: {detailedjob.customer.billingAddress}</p>
              <div className="flex justify-end mt-auto">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded((prev) => !prev)}
                >
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="space-y-6">
            {/* Customer Information */}
            <div className="rounded-xl border bg-muted/30 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold">
                    Customer Information
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Customer details for this service request
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Customer Name */}
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background border">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Customer</p>

                    <p className="font-medium">
                      {detailedjob.customer.firstName}{" "}
                      {detailedjob.customer.lastName}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background border">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>

                    <p className="font-medium">{detailedjob.customer.phone}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3 sm:col-span-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background border">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Billing Address
                    </p>

                    <p className="font-medium">
                      {detailedjob.customer.billingAddress ||
                        "No billing address provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Items */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold">Job Items</h3>

                  <p className="text-sm text-muted-foreground">
                    Devices included in this service request
                  </p>
                </div>

                <div className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                  {detailedjob.jobItems.length}{" "}
                  {detailedjob.jobItems.length === 1 ? "Item" : "Items"}
                </div>
              </div>

              {/* Items */}
              <div className="space-y-4">
                {detailedjob.jobItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="rounded-xl border bg-card p-5 transition-colors hover:bg-muted/20"
                  >
                    {/* Item Header */}
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                          {item.deviceCategory === "mobile_phone" ? (
                            <Smartphone className="h-5 w-5" />
                          ) : (
                            <Monitor className="h-5 w-5" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{item.deviceName}</h4>

                            <span className="text-xs text-muted-foreground">
                              #{index + 1}
                            </span>
                          </div>

                          <p className="mt-0.5 text-sm capitalize text-muted-foreground">
                            {item.deviceCategory.replaceAll("_", " ")}
                          </p>
                        </div>
                      </div>

                      {/* Status */}
                      <Badge variant="secondary" className="shrink-0">
                        {item.currentStatus
                          .replaceAll("_", " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                      </Badge>
                    </div>

                    {/* Device Details */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Serial Number
                        </p>

                        <p className="mt-1 font-medium">
                          {item.deviceSerialNumber || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Repair Location
                        </p>

                        <p className="mt-1 font-medium capitalize">
                          {item.repairLocation.replaceAll("_", " ")}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Issue Category
                        </p>

                        <p className="mt-1 font-medium capitalize">
                          {item.issueCategory
                            ? item.issueCategory.replaceAll("_", " ")
                            : "Not specified"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Estimated Components
                        </p>

                        <p className="mt-1 font-medium">
                          ₹
                          {Number(
                            item.estimatedComponentsCost ?? 0,
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    {/* Issue */}
                    <div className="mt-5 rounded-lg bg-muted/50 p-4">
                      <p className="mb-1 text-xs font-medium text-muted-foreground">
                        Reported Issue
                      </p>

                      <p className="text-sm leading-relaxed">
                        {item.issueDescription}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        )}
        <div className=" flex justify-between">
          <div className="flex gap-3">
            <h1>Select a pickup person to assign: </h1>
            <Select
              value={selectedTransportPersonId}
              onValueChange={(value) => {
                setSelectedTransportPersonId(value ?? "");
                setIsdisabled(false);
              }}
            >
              <SelectTrigger className="w-45">
                <SelectValue placeholder="Select pickup person">
                  {(() => {
                    const selectedPerson = transportTeamPerson.find(
                      (person) => person.userId === selectedTransportPersonId,
                    );

                    return selectedPerson
                      ? `${selectedPerson.firstName} ${selectedPerson.lastName}`
                      : "Select pickup person";
                  })()}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Employees</SelectLabel>

                  {transportTeamPerson.map((item) => (
                    <SelectItem key={item.userId} value={item.userId}>
                      {item.firstName} {item.lastName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Field>
              <Textarea
                style={{
                  resize: "none", // Removes the drag-to-resize handle in the corner
                  height: "20px",
                  width: "400px", // Forces an exact height (stops auto-expanding scripts)
                  overflowY: "auto", // Adds a scrollbar when content exceeds the fixed height
                }}
                id="commentArea"
                placeholder="Enter Comment Here"
                disabled={isdisabled}
                value={comment}
                rows={3}
                onChange={(e) => setComment(e.target.value)}
                aria-invalid={comment?.length > 0 && !comment.trim()}
              />
              {comment?.length > 0 && !comment.trim() && (
                <FieldDescription style={{ color: "red" }}>
                  Please enter a valid message.
                </FieldDescription>
              )}
            </Field>
          </div>
          <Button
            variant={"outline"}
            className={"cursor-pointer"}
            disabled={!comment?.trim()}
            onClick={handlejobAssignment}
          >
            Assign
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TmJobCard;
