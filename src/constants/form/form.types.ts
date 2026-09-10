import type { SUBMIT_STATUS } from "./form.constants"

type SubmitStatus = (typeof SUBMIT_STATUS)[keyof typeof SUBMIT_STATUS]

export type { SubmitStatus }