import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { RepositoryDetail } from "@/components/workspace/repository-detail";
import { dashboard } from "@/lib/mock-data";

export default async function RepositoryPage({
  params,
  searchParams
}: {
  params: Promise<{ repositoryId: string }>;
  searchParams?: Promise<{ view?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const selectedRepository = dashboard.repositories.find((repo) => repo.id === resolvedParams.repositoryId) ?? dashboard.selectedRepository;
  const nextDashboard = { ...dashboard, selectedRepository };

  return (
    <WorkspaceShell workspace={dashboard.workspace}>
      <RepositoryDetail dashboard={nextDashboard} view={resolvedSearchParams.view} />
    </WorkspaceShell>
  );
}
