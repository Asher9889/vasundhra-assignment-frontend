import { DOMAIN } from "@/constants/dataset/dataset.constants"
import { DomainPageContent } from "@/features/public/DomainPageContent"

export default function ClimatePage() {
  return (
    <DomainPageContent
      domain={DOMAIN.CLIMATE}
      description="Approved climate visualizations covering temperature trends, rainfall and monitoring station data across India."
    />
  )
}