import { ParticipateLoadingSkeleton } from "@/app/(participate)/form/[slug]/components/participateSkeleton";

export default function PreviewLoading() {
  return <ParticipateLoadingSkeleton firstload={true} isPreview/>
}