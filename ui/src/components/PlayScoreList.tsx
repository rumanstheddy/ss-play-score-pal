"use client";
import { useState } from "react";
import PlayScoreForm from "./PlayScoreForm";
import PlayScoreItem from "./PlayScoreItem"; // Assuming you have a separate ReviewItem component
import { usePlayScoreData } from "@/hooks/usePlayScoreData"; // Adjust the import path as needed

type Review = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  isRecommended: string;
  rating: number;
  review: string;
  user: User;
  userId: string;
};

type User = {
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
};

export default function PlayScoreList({
  gameId,
  loggedUser,
}: {
  gameId: string;
  loggedUser: string | null | undefined;
}): React.ReactElement {
  const { reviewsWithUserDetails, isLoading, isError } =
    usePlayScoreData(gameId);
  const [isEditing, setIsEditing] = useState(false);
  const [existingReview, setExistingReview] = useState<Partial<Review>>({});

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching data.</div>;
  }

  const shouldEdit = (value: boolean, existingReview: Partial<Review>) => {
    setIsEditing(value);
    setExistingReview(existingReview);
  };

  return (
    <>
      <div className="mx-20">
        <h2 className="text-gray-400 text-xl font-semibold my-6">Playscores</h2>
        {reviewsWithUserDetails.length > 0 ? (
          <ul className="flex flex-col gap-4">
            {reviewsWithUserDetails.map((review: Review) => (
              <PlayScoreItem
                key={review._id}
                _id={review._id}
                userName={`${review.user?.firstName} ${review.user?.lastName}`}
                isRecommended={review.isRecommended}
                rating={review.rating}
                review={review.review}
                createdAt={review.createdAt}
                updatedAt={review.updatedAt}
                isLoggedUser={review.userId === loggedUser}
                shouldEdit={shouldEdit}
                isEditing={isEditing}
                userType={review.user?.userType}
              />
            ))}
          </ul>
        ) : (
          <p className="text-white text-md">
            No Playscores available for this product yet.
          </p>
        )}
      </div>
      <PlayScoreForm
        userId={loggedUser}
        gameId={gameId}
        existingReview={existingReview}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
    </>
  );
}
