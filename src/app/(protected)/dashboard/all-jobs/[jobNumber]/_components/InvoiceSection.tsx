"use client";

import { useState } from "react";
import {
    CalendarDays,
    Download,
    FileText,
    Receipt,
} from "lucide-react";
import { toast } from "sonner";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { downloadInvoice } from "@/features/cs/api/invoice.api";
import { JobInvoiceWithItems } from "@/features/cs/types/job-details.types";

interface InvoiceSectionProps {
    invoice: JobInvoiceWithItems | null;
}

function formatMoney(value: string | null | undefined) {
    if (!value) return "₹0.00";

    return `₹${Number(value).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

function formatDate(date: string | null) {
    if (!date) return "Not available";

    return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(date));
}

function formatStatus(status: string) {
    return status
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function InvoiceSection({
    invoice,
}: InvoiceSectionProps) {
    const [isDownloading, setIsDownloading] =
        useState(false);

    if (!invoice) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Receipt className="h-5 w-5" />
                        Invoice
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        No invoice has been generated for this job yet.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const { invoice: invoiceData, items } = invoice;

    async function handleDownload() {
        try {
            setIsDownloading(true);
            const response = await downloadInvoice(
                invoiceData.id,
            );

            const downloadUrl = response?.url;

            if (!downloadUrl) {
                throw new Error(
                    "Invoice download URL was not returned.",
                );
            }

            window.open(downloadUrl, "_blank");

        } catch (error) {
            console.error(
                "Failed to download invoice:",
                error,
            );

            toast.error(
                "Unable to download the invoice.",
            );
        } finally {
            setIsDownloading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Receipt className="h-5 w-5" />

                            Invoice
                        </CardTitle>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Generated billing information for this job
                        </p>
                    </div>

                    <Button
                        onClick={handleDownload}
                        disabled={
                            isDownloading ||
                            !invoiceData.pdfStorageKey
                        }
                    >
                        <Download className="mr-2 h-4 w-4" />

                        {isDownloading
                            ? "Preparing..."
                            : "Download Invoice"}
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Invoice information */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <p className="text-xs text-muted-foreground">
                            Invoice Number
                        </p>

                        <p className="font-mono text-sm font-semibold">
                            {invoiceData.invoiceNumber}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-muted-foreground">
                            Status
                        </p>

                        <div className="mt-1">
                            <Badge variant="outline">
                                {formatStatus(invoiceData.status)}
                            </Badge>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs text-muted-foreground">
                            Generated
                        </p>

                        <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />

                            {formatDate(
                                invoiceData.pdfGeneratedAt,
                            )}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-muted-foreground">
                            Currency
                        </p>

                        <p className="font-medium">
                            {invoiceData.currency}
                        </p>
                    </div>
                </div>

                {/* Invoice items */}
                {items.length > 0 && (
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />

                            <h4 className="text-sm font-semibold">
                                Invoice Items
                            </h4>
                        </div>

                        <div className="overflow-hidden rounded-lg border">
                            <div className="hidden grid-cols-[1fr_auto_auto_auto] gap-4 border-b bg-muted/40 px-4 py-3 text-xs font-medium text-muted-foreground sm:grid">
                                <span>Item</span>
                                <span>Qty</span>
                                <span>Unit Price</span>
                                <span>Total</span>
                            </div>

                            <div className="divide-y">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="grid gap-3 px-4 py-3 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center sm:gap-4"
                                    >
                                        <div>
                                            <p className="text-sm font-medium">
                                                {item.name}
                                            </p>

                                            {item.warrantyMonths > 0 && (
                                                <p className="text-xs text-muted-foreground">
                                                    Warranty:{" "}
                                                    {item.warrantyMonths} months
                                                </p>
                                            )}
                                        </div>

                                        <div className="text-sm">
                                            <span className="mr-2 text-xs text-muted-foreground sm:hidden">
                                                Qty:
                                            </span>

                                            {item.quantity}
                                        </div>

                                        <div className="text-sm">
                                            <span className="mr-2 text-xs text-muted-foreground sm:hidden">
                                                Unit:
                                            </span>

                                            {formatMoney(item.unitPrice)}
                                        </div>

                                        <div className="text-sm font-medium">
                                            <span className="mr-2 text-xs text-muted-foreground sm:hidden">
                                                Total:
                                            </span>

                                            {formatMoney(item.lineTotal)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Financial summary */}
                <div className="border-t pt-5">
                    <h4 className="mb-4 text-sm font-semibold">
                        Invoice Summary
                    </h4>

                    <div className="ml-auto max-w-md space-y-3">
                        <div className="flex justify-between gap-4 text-sm">
                            <span className="text-muted-foreground">
                                Subtotal
                            </span>

                            <span>
                                {formatMoney(invoiceData.subtotal)}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4 text-sm">
                            <span className="text-muted-foreground">
                                Service Charge
                            </span>

                            <span>
                                {formatMoney(
                                    invoiceData.serviceCharge,
                                )}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4 text-sm">
                            <span className="text-muted-foreground">
                                Discount
                            </span>

                            <span>
                                - {formatMoney(invoiceData.discount)}
                            </span>
                        </div>

                        {invoiceData.cgst && (
                            <div className="flex justify-between gap-4 text-sm">
                                <span className="text-muted-foreground">
                                    CGST
                                </span>

                                <span>
                                    {formatMoney(invoiceData.cgst)}
                                </span>
                            </div>
                        )}

                        {invoiceData.sgst && (
                            <div className="flex justify-between gap-4 text-sm">
                                <span className="text-muted-foreground">
                                    SGST
                                </span>

                                <span>
                                    {formatMoney(invoiceData.sgst)}
                                </span>
                            </div>
                        )}

                        {invoiceData.igst && (
                            <div className="flex justify-between gap-4 text-sm">
                                <span className="text-muted-foreground">
                                    IGST
                                </span>

                                <span>
                                    {formatMoney(invoiceData.igst)}
                                </span>
                            </div>
                        )}

                        <div className="border-t pt-3">
                            <div className="flex justify-between gap-4">
                                <span className="font-semibold">
                                    Total
                                </span>

                                <span className="text-xl font-bold">
                                    {formatMoney(
                                        invoiceData.totalAmount,
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}