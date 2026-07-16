import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { RepositoryDetail } from "@/components/workspace/repository-detail";

export default async function RepositoryPage({
  searchParams,
}: {
  params: Promise<{ repositoryId: string }>;
  searchParams?: Promise<{ view?: string }>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};

  return (
    <WorkspaceShell>
      <RepositoryDetail view={resolvedSearchParams.view} />
    </WorkspaceShell>
  );
}
