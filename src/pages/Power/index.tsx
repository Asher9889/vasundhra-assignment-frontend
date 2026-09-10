import { DOMAIN } from "@/constants/dataset/dataset.constants"
import { DomainPageContent } from "@/features/public/DomainPageContent"

export default function PowerPage() {
  return (
    <DomainPageContent
      domain={DOMAIN.POWER}
      description="Approved power visualizations covering generation trends, source mix and peak demand across India."
    />
  )
}