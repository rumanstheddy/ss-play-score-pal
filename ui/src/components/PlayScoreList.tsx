import ReviewItem from "./PlayScoreItem"; // Assuming you have a separate ReviewItem component
import { usePlayScoreData } from "@/hooks/usePlayScoreData"; // Adjust the import path as needed

type Review = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  isRecommended: string;
  rating: number;
  review: string;
  user: User;
};

type User = { firstName: string; lastName: string; email: string };

export default function PlayScoreList({
  gameId,
}: {
  gameId: string;
}): React.ReactElement {
  const { reviewsWithUserDetails, isLoading, isError } = usePlayScoreData(
    gameId as string
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching data.</div>;
  }

  return (
    <div className="mx-20 mt-4">
      <p className="text-gray-400 text-xl font-semibold my-6">PlayScores</p>
      <ul className="flex flex-col gap-4">
        {reviewsWithUserDetails?.map((review: Review) => (
          <ReviewItem
            key={review._id}
            userName={`${review.user?.firstName} ${review.user?.lastName}`}
            isRecommended={review.isRecommended}
            rating={review.rating}
            review={review.review}
            createdAt={review.createdAt}
            updatedAt={review.updatedAt}
          />
        ))}
      </ul>
    </div>
  );
}
