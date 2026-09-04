export {
  changeInquiryStatus,
  loadAdminFollowUps,
  loadAdminInquiries,
  type AdminFollowUpResult,
  type AdminInquiryResult,
} from "@/features/inquiry/server/admin-inquiries";
export {
  completeFollowUp,
  createFollowUp,
} from "@/features/inquiry/server/follow-up-actions";
export { updateInquiryStatus } from "@/features/inquiry/server/admin-actions";
export { createPostInquiryHandler } from "@/features/inquiry/server/post-inquiry";
export {
  type FollowUp,
  type FollowUpInput,
} from "@/features/inquiry/data/follow-up-repository";
export {
  type Inquiry,
  type InquiryRepository,
  type InquiryStatus,
} from "@/features/inquiry/data/inquiry-repository";
export { summarizeInquiries } from "@/features/inquiry/model/admin-report";
