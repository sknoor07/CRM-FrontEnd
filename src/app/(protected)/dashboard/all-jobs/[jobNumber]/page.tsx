import { JobDetailsPage } from "./_components/JobDetailsPage";

interface PageProps {
  params: Promise<{
    jobNumber: string;
  }>;
}

export default async function Page({
  params,
}: PageProps) {
  const { jobNumber } = await params;

  return (
    <JobDetailsPage
      jobNumber={jobNumber}
    />
  );
}