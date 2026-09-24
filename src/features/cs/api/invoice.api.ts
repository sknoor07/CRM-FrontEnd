import api  from "@/lib/api-client";
export interface InvoiceDownloadResponse {
  status: "success";
  invoice: {
    id: string;
    invoiceNumber: string;
    fileName: string | null;
  };
  url: string;
  expiresIn: number;
}
export async function downloadInvoice(invoiceId: string):Promise<InvoiceDownloadResponse> {
  const response = await api.get<InvoiceDownloadResponse>(
    `/invoices/${invoiceId}/download`,
  );

  return response.data;
}