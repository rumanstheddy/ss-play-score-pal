import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { createPlayScore } from "@/providers/PlayScore/PlayScoreProvider";
import RatingSelector from "./RatingSelector";
import RecommendationSelector from "./RecommendationSelector";
import { Loader2 } from "lucide-react";
import PopUpMsg from "./PopUpMsg";

interface ReviewFormProps {
  title?: string;
  placeholder?: string;
  gameId?: string;
  userId?: string | null | undefined;
}

export default function PlayScoreForm({
  title,
  placeholder,
  gameId,
  userId,
}: ReviewFormProps): React.ReactElement {
  const [textareaValue, setTextareaValue] = useState<string>("");
  const [rating, setRating] = useState<number | null>(null);
  const [recommendation, setRecommendation] = useState<string | null>(null);

  const [displayPopUp, setDisplayPopUp] = useState<boolean>(false);
  const [submitSucess, setSubmitSucess] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>("");
  const [link, setLink] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      createPlayScore({
        fields:
          "_id createdAt gameId isRecommended rating review updatedAt userId",
        parameters: { $playScore: "PlayScoreInput!" },
        variables: {
          playScore: {
            gameId: gameId,
            userId: userId,
            isRecommended: recommendation,
            rating: rating,
            review: textareaValue,
          },
        },
      }),
    onSuccess: () => {
      // Refetch the reviews list after submission
      queryClient.invalidateQueries({ queryKey: ["playScores", gameId] });
      setTextareaValue("");
      setRating(null);
      setRecommendation(null);
    },
  });

  const onSubmit = () => {
    if (!userId) {
      handleSubmitError(
        "You need to be logged in to submit a Playscore.",
        "/login"
      );
      return;
    }

    mutation.mutate();
    handleSubmitSuccess("Playscore submitted succesfully!");
  };

  const handleSubmitError = (message: string, link?: string) => {
    setSubmitSucess(false);
    setStatusMsg(message);
    setLink(link ?? "");
    setDisplayPopUp(true);
  };

  const handleSubmitSuccess = (message: string) => {
    setSubmitSucess(true);
    setStatusMsg(message);
    setLink("");
    setDisplayPopUp(true);
  };

  const isPending = mutation.isPending;

  // TODO: Error handling for userId not present (user not logged in)

  // TODO: Error handling for review already submitted for gameId and userId

  return (
    <div className="flex flex-col gap-6 mx-20 mb-12">
      {displayPopUp ? (
        <PopUpMsg
          message={statusMsg}
          link={link}
          setShouldDisplay={setDisplayPopUp}
          isSuccess={submitSucess}
        />
      ) : (
        <></>
      )}
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
            onClick={onSubmit}
            className="hover:border hover:bg-slate-900 hover:text-white"
            disabled={isPending}
          >
            {isPending ? <Loader2 className="animate-spin" /> : ""}
            {isPending ? "Please wait" : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
}
