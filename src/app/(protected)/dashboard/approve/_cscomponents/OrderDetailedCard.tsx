import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { submitCSJobApproval } from "@/features/cs/api/cs.api";
import { JobItem, JobWithItems } from "@/features/cs/types/cs.types";
import { useSubmitCSJobApproval } from "@/features/cs/hooks/useSubmitCSJobApproval";
import { Input } from "@base-ui/react";
import { Field, FieldArray, Form, Formik } from "formik";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OrderDetailedCardProps {
  jobWithItems: JobWithItems;
  onSuccess: () => void;
}
interface ComponentForm {
  name: string;
  quantity: number;
  unitPrice: number;
}
interface ItemForm {
  jobItemId: string;
  deviceName: string;
  deviceCategory: string;
  deviceSerialNumber: string;
  issueDescription: string;
  issueCategory: string;
  repairLocation: "customer_site" | "inlab";
  decision: "approved" | "rejected" | "";
  comment: string;
  components: ComponentForm[];
  estimatedComponentsCost: number;
  serviceChargeApplied: number;
}
interface FormValues {
  comment: string;
  items: ItemForm[];
}

const OrderDetailedCard = ({
  jobWithItems,
  onSuccess,
}: OrderDetailedCardProps) => {
  const { submit, isSubmitting, error, success } = useSubmitCSJobApproval();
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
  const initialValues: FormValues = {
    comment: "",
    items: jobWithItems.jobItems.map((item) => ({
      jobItemId: item.id,
      deviceName: item.deviceName,
      deviceCategory: item.deviceCategory,
      deviceSerialNumber: item.deviceSerialNumber ?? "",
      issueDescription: item.issueDescription,
      issueCategory: item.issueCategory ?? "",
      repairLocation: item.repairLocation,
      decision: "",
      comment: "",
      components: [],
      estimatedComponentsCost: Number(item.estimatedComponentsCost ?? 0),
      serviceChargeApplied: Number(item.serviceChargeApplied ?? 0),
    })),
  };
  const handleSubmit = async (values: FormValues) => {
    const payload = {
      jobId: jobWithItems.job.id,
      comment: values.comment,
      items: values.items.map((item) => ({
        jobItemId: item.jobItemId,
        decision: item.decision,
        deviceName: item.deviceName,
        deviceCategory: item.deviceCategory,
        deviceSerialNumber:
          item.deviceSerialNumber.trim() === ""
            ? null
            : item.deviceSerialNumber,
        issueDescription: item.issueDescription,
        issueCategory:
          item.issueCategory.trim() === "" ? null : item.issueCategory,
        repairLocation: "customer_site" as const,
        comment: item.comment,
        estimatedComponents:
          item.decision === "approved"
            ? item.components.map((component) => ({
                name: component.name,
                quantity: Number(component.quantity),
                unitPrice: Number(component.unitPrice),
              }))
            : [],
      })),
    };
    try {
      const result = await submit(payload);

      if (result.status === "success") {
        toast.success("Job verification submitted successfully", {
          description: `Job ${jobWithItems.job.jobNumber} has been processed.`,
        });
      }
      onSuccess();
    } catch (err) {
      toast.error("Failed to approve.. please contact IT Team ");
    }
  };
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle> Please verify the details and submit </CardTitle>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue }) => (
            <ScrollArea className="h-[calc(100vh-260px)]">
              <Form className="space-y-8 p-5">
                <div className="space-y-6">
                  {values.items.map((item, itemIndex) => {
                    const componentTotal = item.components.reduce(
                      (total, component) =>
                        total +
                        Number(component.quantity || 0) *
                          Number(component.unitPrice || 0),
                      0,
                    );
                    return (
                      <Card key={item.jobItemId} className="border">
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Job Item {itemIndex + 1}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label> Device Name </Label>
                              <Field
                                as={Input}
                                name={`items.${itemIndex}.deviceName`}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label> Device Category </Label>
                              <Field
                                as={Input}
                                name={`items.${itemIndex}.deviceCategory`}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label> Device Serial Number </Label>
                              <Field
                                as={Input}
                                name={`items.${itemIndex}.deviceSerialNumber`}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label> Issue Category </Label>
                              <Field
                                as={Input}
                                name={`items.${itemIndex}.issueCategory`}
                                placeholder="e.g. power_issue"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label> Issue Description </Label>
                            <Textarea
                              name={`items.${itemIndex}.issueDescription`}
                              value={item.issueDescription}
                              onChange={(e) =>
                                setFieldValue(
                                  `items.${itemIndex}.issueDescription`,
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          {/* REPAIR LOCATION 
                        <div className="space-y-2">
                           
                          <Label> Repair Location </Label> 
                          <select
                            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                            value={item.repairLocation}
                            onChange={(e) =>
                              setFieldValue(
                                `items.${itemIndex}.repairLocation`,
                                e.target.value,
                              )
                            }
                          >
                            
                            <option value="customer_site">
                              
                              Customer Site
                            </option>
                            <option value="inlab"> In Lab </option>
                          </select>
                        </div> */}
                          {/* DECISION */}
                          <div className="space-y-3">
                            <Label> CS Decision </Label>
                            <div className="flex gap-3">
                              <Button
                                type="button"
                                variant={
                                  item.decision === "approved"
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() =>
                                  setFieldValue(
                                    `items.${itemIndex}.decision`,
                                    "approved",
                                  )
                                }
                              >
                                Approve
                              </Button>
                              <Button
                                type="button"
                                variant={
                                  item.decision === "rejected"
                                    ? "destructive"
                                    : "outline"
                                }
                                onClick={() =>
                                  setFieldValue(
                                    `items.${itemIndex}.decision`,
                                    "rejected",
                                  )
                                }
                              >
                                Reject
                              </Button>
                            </div>
                          </div>
                          {/* COMPONENTS */}
                          {item.decision === "approved" && (
                            <div className="space-y-4 rounded-lg border p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-medium">
                                    Estimated Components
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    Add the components required for this repair.
                                  </p>
                                </div>
                              </div>
                              <FieldArray
                                name={`items.${itemIndex}.components`}
                              >
                                {({ push, remove }) => (
                                  <div className="space-y-3">
                                    {item.components.map(
                                      (component, componentIndex) => (
                                        <div
                                          key={componentIndex}
                                          className="grid grid-cols-1 items-end gap-3 md:grid-cols-[1fr_120px_150px_auto]"
                                        >
                                          <div className="space-y-2">
                                            <Label> Component Name </Label>
                                            <Input
                                              value={component.name}
                                              placeholder="Power Supply"
                                              onChange={(e) =>
                                                setFieldValue(
                                                  `items.${itemIndex}.components.${componentIndex}.name`,
                                                  e.target.value,
                                                )
                                              }
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <Label> Quantity </Label>
                                            <Input
                                              type="number"
                                              min={1}
                                              value={component.quantity}
                                              onChange={(e) =>
                                                setFieldValue(
                                                  `items.${itemIndex}.components.${componentIndex}.quantity`,
                                                  Number(e.target.value),
                                                )
                                              }
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <Label> Unit Price </Label>
                                            <Input
                                              type="number"
                                              min={0}
                                              value={component.unitPrice}
                                              onChange={(e) =>
                                                setFieldValue(
                                                  `items.${itemIndex}.components.${componentIndex}.unitPrice`,
                                                  Number(e.target.value),
                                                )
                                              }
                                            />
                                          </div>
                                          <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() =>
                                              remove(componentIndex)
                                            }
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      ),
                                    )}
                                    {/* ADD COMPONENT */}
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() =>
                                        push({
                                          name: "",
                                          quantity: 1,
                                          unitPrice: 0,
                                        })
                                      }
                                    >
                                      <Plus className="mr-2 h-4 w-4" /> Add
                                      Component
                                    </Button>
                                    {/* COMPONENT TOTAL */}
                                    <div className="flex justify-end border-t pt-3">
                                      <div className="text-sm">
                                        <span className="text-muted-foreground">
                                          Estimated Components Cost:
                                        </span>
                                        <span className="font-semibold">
                                          ₹{componentTotal.toFixed(2)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </FieldArray>
                            </div>
                          )}
                          {/* ITEM COMMENT */}
                          <div className="space-y-2">
                            <Label> Item Comment </Label>
                            <Textarea
                              value={item.comment}
                              placeholder="Enter verification comment for this item..."
                              onChange={(e) =>
                                setFieldValue(
                                  `items.${itemIndex}.comment`,
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          {/* ADDITIONAL INFORMATION */}
                          <div className="rounded-lg bg-muted/50 p-4">
                            <h3 className="mb-3 font-medium">
                              Additional Information
                            </h3>
                            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                              <div>
                                <span className="text-muted-foreground">
                                  Current Status:
                                </span>
                                <span className="ml-2 font-medium">
                                  {
                                    jobWithItems.jobItems[itemIndex]
                                      .currentStatus
                                  }
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Created At:
                                </span>
                                <span className="ml-2 font-medium">
                                  {new Date(
                                    jobWithItems.jobItems[itemIndex].createdAt,
                                  ).toLocaleString()}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Updated At:
                                </span>
                                <span className="ml-2 font-medium">
                                  {new Date(
                                    jobWithItems.jobItems[itemIndex].updatedAt,
                                  ).toLocaleString()}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Warranty Claim:
                                </span>
                                <span className="ml-2 font-medium">
                                  {jobWithItems.jobItems[itemIndex]
                                    .isWarrantyClaim
                                    ? "Yes"
                                    : "No"}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Final Quote Approved:
                                </span>
                                <span className="ml-2 font-medium">
                                  {jobWithItems.jobItems[itemIndex]
                                    .isFinalQuoteApproved
                                    ? "Yes"
                                    : "No"}
                                </span>
                              </div>
                              {/* <div>
                              <span className="text-muted-foreground">
                                Service Charge:
                              </span>
                              <span className="ml-2 font-medium">
                                ₹ {item.serviceChargeApplied.toFixed(2)}
                              </span>
                            </div> */}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comment"> Overall Job Comment </Label>
                  <Textarea
                    id="comment"
                    name="comment"
                    placeholder="Enter your overall verification comment..."
                    value={values.comment}
                    onChange={(e) => setFieldValue("comment", e.target.value)}
                  />
                </div>
                {/* SUBMIT */}
                <div className="flex justify-end border-t pt-6">
                  <Button type="submit"> Submit CS Verification </Button>
                </div>
              </Form>
            </ScrollArea>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};
export default OrderDetailedCard;
