import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { createPlayScore } from "@/providers/PlayScoreProvider/PlayScoreProvider";
import RatingSelector from "./RatingSelector";
import RecommendationSelector from "./RecommendationSelector";

interface ReviewFormProps {
  title?: string;
  placeholder?: string;
  gameId?: string;
  userId?: string | null | undefined;
}

export default function ReviewForm({
  title,
  placeholder,
  gameId,
  userId,
}: ReviewFormProps): React.ReactElement {
  const [shouldSubmit, setShouldSubmit] = useState<boolean>(false);
  const [textareaValue, setTextareaValue] = useState<string>("");
  const [rating, setRating] = useState<number | null>(null);
  const [recommendation, setRecommendation] = useState<string | null>(null);

  const { isSuccess } = useQuery({
    queryKey: ["submitReview"],
    queryFn: () =>
      createPlayScore({
        fields:
          "_id createdAt gameId isRecommended rating review updatedAt userId",
        parameters: { $playScore: "PlayScoreInput!" },
        variables: {
          playScore: {
            gameId: gameId,
            userId: userId,
            // TODO: Handle errors for empty recommendation and rating
            isRecommended: recommendation,
            rating: rating,
            review: textareaValue,
          },
        },
      }),
    enabled: shouldSubmit,
  });

  const handleSubmit = () => {
    if (!userId) {
      // TODO: Error handling for userId not present (user not logged in)
      console.log("User not logged in");
      return;
    }

    // TODO: Error handling for review already submitted for gameId and userId
    setShouldSubmit(true);
    if (isSuccess) {
      setTextareaValue("");
      setRating(null);
      setRecommendation(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 mx-20 mb-12">
      <p className="text-gray-400 text-xl font-semibold">{title}</p>
      <RatingSelector onSelectRating={setRating} selectedRating={rating} />
      <RecommendationSelector
        selectedOption={recommendation}
        setSelectedOption={setRecommendation}
      />
      <div className="flex flex-col gap-4">
        <p className="text-gray-400 text-md font-semibold">Review</p>
        <Textarea
          placeholder={placeholder}
          value={textareaValue}
          onChange={(e) => setTextareaValue(e.target.value)}
        />
        <div>
          <Button
            type="button"
            variant="outline"
            onClick={handleSubmit}
            className="hover:border hover:bg-slate-900 hover:text-white"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
