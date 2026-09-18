"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  getCustomerDetailsWithJobs,
  searchCustomers,
} from "@/features/cs/cs.api";
import {
  CustomerDetailsResponse,
  CustomerSearchResult,
} from "@/features/cs/cs.types";

export default function CustomersPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CustomerSearchResult[]>([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerDetailsResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const searchValue = query.trim();
    if (!searchValue) {
      setError("Enter a name, email, phone, customer ID, or job number.");
      setResults([]);
      setSelectedCustomer(null);
      return;
    }

    setIsSearching(true);
    setError(null);
    setSelectedCustomer(null);

    try {
      const customers = await searchCustomers(searchValue);
      setResults(customers);
    } catch (error) {
      console.error("Customer search failed", error);
      setResults([]);
      setError("Unable to search customers.");
    } finally {
      setIsSearching(false);
    }
  }

  async function handleSelectCustomer(customer: CustomerSearchResult) {
    setIsLoadingDetails(true);
    setError(null);

    try {
      const details = await getCustomerDetailsWithJobs(customer.customerId);
      setSelectedCustomer(details);
    } catch (error) {
      console.error("Customer details request failed", error);
      setError("Unable to load customer details.");
    } finally {
      setIsLoadingDetails(false);
    }
  }

  const customerDetails = selectedCustomer?.[0] ?? null;

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
        <p className="text-sm text-muted-foreground">
          Search customers and view their submitted jobs.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Name, email, phone, customer ID, or job number"
          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
        />
        <Button type="submit" disabled={isSearching}>
          {isSearching ? "Searching…" : "Search"}
        </Button>
      </form>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {results.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Search results</h2>
          {results.map((customer) => (
            <button
              key={customer.customerId}
              type="button"
              onClick={() => void handleSelectCustomer(customer)}
              className="block w-full rounded-lg border p-4 text-left transition hover:border-primary hover:bg-muted/30"
            >
              <p className="font-medium">
                {customer.firstName} {customer.lastName}
              </p>
              <p className="text-sm text-muted-foreground">
                {customer.email} · {customer.phone || "No phone"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Customer ID: {customer.customerId}
              </p>
            </button>
          ))}
        </section>
      )}

      {!isSearching && query.trim() && results.length === 0 && !error && (
        <p className="text-sm text-muted-foreground">No customers found.</p>
      )}

      {isLoadingDetails && (
        <p className="text-sm text-muted-foreground">
          Loading customer details…
        </p>
      )}

      {customerDetails && (
        <section className="space-y-5 rounded-xl border bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold">
              {customerDetails.customerProfile.firstName}{" "}
              {customerDetails.customerProfile.lastName}
            </h2>
            <dl className="mt-2 grid gap-1 text-sm text-muted-foreground">
              <div>Customer ID: {customerDetails.customerProfile.userId}</div>
              <div>
                Phone:{" "}
                {customerDetails.customerProfile.phone || "Not available"}
              </div>
              <div>
                Billing address:{" "}
                {formatBillingAddress(
                  customerDetails.customerProfile.billingAddress,
                )}
              </div>
            </dl>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Submitted jobs</h3>

            {customerDetails.jobs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                This customer has not submitted any jobs.
              </p>
            ) : (
              customerDetails.jobs.map((job) => (
                <article key={job.id} className="rounded-lg border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-mono text-sm font-semibold">
                        {job.jobNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Job ID: {job.id}
                      </p>
                    </div>
                    <span className="rounded-full bg-muted px-2 py-1 text-xs">
                      {job.currentStatus}
                    </span>
                  </div>

                  <dl className="mt-3 grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
                    <div>
                      Payment confirmed: {job.paymentConfirmed ? "Yes" : "No"}
                    </div>
                    <div>CS approved: {job.isApprovedByCS ? "Yes" : "No"}</div>
                    <div>
                      Created: {new Date(job.createdAt).toLocaleString()}
                    </div>
                    <div>
                      Updated: {new Date(job.updatedAt).toLocaleString()}
                    </div>
                  </dl>
                </article>
              ))
            )}
          </div>
        </section>
      )}
    </main>
  );
}

function formatBillingAddress(address: unknown): string {
  if (!address) return "Not available";
  if (typeof address === "string") return address;
  return JSON.stringify(address);
}
