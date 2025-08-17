import ExpertPostDetailPage from "@/components/blocks/ExpertPostDetailPage";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PostDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <ExpertPostDetailPage articleId={id} />;
}
