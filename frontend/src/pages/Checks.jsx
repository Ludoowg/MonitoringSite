import { useQuery } from "@tanstack/react-query";
import { getLatestChecks } from "../api/checkApi";
import PageHeader from "../components/PageHeader";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import RecentChecksTable from "../components/RecentChecksTable";

function Checks() {
  const checksQuery = useQuery({ queryKey: ["latest-checks"], queryFn: getLatestChecks });

  if (checksQuery.isLoading) return <LoadingState message="Loading checks..." />;
  if (checksQuery.isError) return <ErrorState message={checksQuery.error.message} />;

  const checks = checksQuery.data || [];

  return (
    <div>
      <PageHeader title="Latest checks" subtitle="Recent checks across all monitors" />
      {checks.length ? <RecentChecksTable checks={checks} /> : <EmptyState message="No checks available." />}
    </div>
  );
}

export default Checks;
