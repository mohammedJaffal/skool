import { EnrollForm } from "@/components/checkout/enroll-form";
import { getCommunityDetailById, listCommunityCards } from "@/lib/platform-data";

interface Props {
  searchParams: Promise<{ communityId?: string }>;
}

export default async function CheckoutPage({ searchParams }: Props) {
  const { communityId } = await searchParams;
  const cards = await listCommunityCards();
  const firstCommunityId = cards[0]?.id;
  const community = communityId
    ? await getCommunityDetailById(communityId)
    : firstCommunityId
      ? await getCommunityDetailById(firstCommunityId)
      : null;
  if (!community)
    return (
      <p className="text-[color:var(--muted)]">Community not found.</p>
    );

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
          Checkout
        </p>
        <h1 className="text-2xl font-semibold">Join community</h1>
      </div>
      <div className="mx-auto max-w-md">
        <EnrollForm
          community={{
            id: community.id,
            title: community.title,
            price: community.price,
            ownerName: community.ownerName,
            duration: community.duration,
            level: community.level,
            classroomItems: community.classroomItems,
          }}
        />
      </div>
    </div>
  );
}
