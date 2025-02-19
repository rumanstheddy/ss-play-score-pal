import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { createPlayScore } from "@/providers/PlayScoreProvider/PlayScoreProvider";

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
            isRecommended: "YES", // TODO: Create a component for selecting isRecommended
            rating: 1, // TODO: Create a component for selecting a rating
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
    }
  };

  return (
    <div className="flex flex-col gap-4 mx-20">
      <p className="text-gray-400 text-xl font-semibold mb-1">{title}</p>
      <Textarea
        placeholder={placeholder}
        value={textareaValue}
        onChange={(e) => setTextareaValue(e.target.value)}
      />
      <div className="">
        <Button type="button" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
}
