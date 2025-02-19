import ReviewItem from "./ReviewItem"; // Assuming you have a separate ReviewItem component
import { useReviewData } from "@/hooks/useReviewData"; // Adjust the import path as needed

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

export default function ReviewList({
  gameId,
}: {
  gameId: string;
}): React.ReactElement {
  const { reviewsWithUserDetails, isLoading, isError } = useReviewData(
    gameId as string
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching data.</div>;
  }

  return (
    <div className="mx-20">
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
    </div>
  );
}
