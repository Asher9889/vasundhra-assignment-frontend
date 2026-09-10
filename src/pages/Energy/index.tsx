import { DOMAIN } from "@/constants/dataset/dataset.constants"
import { DomainPageContent } from "@/features/public/DomainPageContent"

export default function EnergyPage() {
  return (
    <DomainPageContent
      domain={DOMAIN.ENERGY}
      description="Approved energy visualizations covering renewable capacity by state and the location of major installations."
    />
  )
}