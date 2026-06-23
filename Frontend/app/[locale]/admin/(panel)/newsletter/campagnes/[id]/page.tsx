import { CampaignDetail } from "@/components/admin/campaign-detail"

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id } = await params
  return (
    <div className="grid gap-6">
      <CampaignDetail campaignId={id} />
    </div>
  )
}
