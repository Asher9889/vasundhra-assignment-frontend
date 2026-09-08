import { PageHeader } from "@/components/common/PageHeader"
import { AddDatasetForm } from "@/features/add-dataset/AddDatasetForm"

export default function AddDatasetPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Dataset"
        description="Upload a CSV file, configure its schema and submit it for Super Admin approval."
      />
      <AddDatasetForm />
    </div>
  )
}