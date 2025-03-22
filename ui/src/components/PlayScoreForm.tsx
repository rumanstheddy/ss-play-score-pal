"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState, useEffect, useRef } from "react";
import {
  createPlayScore,
  updatePlayScore,
} from "@/providers/PlayScore/PlayScoreProvider";
import RatingSelector from "./RatingSelector";
import RecommendationSelector from "./RecommendationSelector";
import { Loader2 } from "lucide-react";
import PopUpMsg from "./PopUpMsg";

type Review = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  isRecommended: string;
  rating: number;
  review: string;
};
interface ReviewFormProps {
  title?: string;
  placeholder?: string;
  gameId?: string;
  userId?: string | null | undefined;
  isEditing: boolean;
  existingReview: Partial<Review>;
  setIsEditing: (isEditing: boolean) => void;
}

export default function PlayScoreForm({
  gameId,
  userId,
  isEditing,
  existingReview,
  setIsEditing,
}: ReviewFormProps): React.ReactElement {
  const [textareaValue, setTextareaValue] = useState<string>("");
  const [rating, setRating] = useState<number | null>(null);
  const [recommendation, setRecommendation] = useState<string | null>(null);

  const [displayPopUp, setDisplayPopUp] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>("");
  const [link, setLink] = useState("");

  const queryClient = useQueryClient();

  const scrollRef = useRef<HTMLParagraphElement | null>(null);

  const scrollToForm = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView();
    }
  };

  // Prefill the form when editing
  useEffect(() => {
    if (isEditing && existingReview) {
      setTextareaValue(existingReview.review || "");
      setRating(existingReview.rating || null);
      setRecommendation(existingReview.isRecommended || null);
      scrollToForm();
    }
  }, [isEditing, existingReview]);

  const { isPending, mutate } = useMutation({
    mutationFn: () =>
      isEditing
        ? updatePlayScore({
            fields: "acknowledged modifiedCount",
            parameters: { $id: "ID!", $playScore: "EditPlayScoreInput" },
            variables: {
              id: existingReview._id,
              playScore: {
                rating: rating,
                review: textareaValue,
                isRecommended: recommendation,
              },
            },
          })
        : createPlayScore({
            fields:
              "_id createdAt gameId isRecommended rating review updatedAt userId",
            parameters: { $playScore: "PlayScoreInput!" },
            variables: {
              playScore: {
                gameId,
                userId,
                isRecommended: recommendation,
                rating,
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
      handleSubmitSuccess(
        isEditing
          ? "PlayScore updated successfully!"
          : "PlayScore submitted successfully!"
      );
      setIsEditing(false);
    },
  });

  const onSubmit = () => {
    if (!userId) {
      handleSubmitError(
        "You need to be logged in to submit a PlayScore.",
        "/login"
      );
      return;
    }

    mutate();
  };

  const onCancel = () => {
    setIsEditing(false);
    setTextareaValue("");
    setRating(null);
    setRecommendation(null);
  };

  const handleSubmitError = (message: string, link?: string) => {
    setSubmitSuccess(false);
    setStatusMsg(message);
    setLink(link ?? "");
    setDisplayPopUp(true);
  };

  const handleSubmitSuccess = (message: string) => {
    setSubmitSuccess(true);
    setStatusMsg(message);
    setLink("");
    setDisplayPopUp(true);
  };

  return (
    <div className="flex flex-col gap-6 mx-20 mt-12">
      {displayPopUp && (
        <PopUpMsg
          message={statusMsg}
          link={link}
          setShouldDisplay={setDisplayPopUp}
          isSuccess={submitSuccess}
        />
      )}
      <p className="text-gray-400 text-xl font-semibold" ref={scrollRef}>
        Add your Playscore
      </p>
      <RatingSelector onSelectRating={setRating} selectedRating={rating} />
      <RecommendationSelector
        selectedOption={recommendation}
        setSelectedOption={setRecommendation}
      />
      <div className="flex flex-col gap-4">
        <p className="text-gray-400 text-md font-semibold">Review</p>
        <Textarea
          placeholder="Your thoughts about the game"
          value={textareaValue}
          onChange={(e) => setTextareaValue(e.target.value)}
        />
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onSubmit}
            className="hover:border hover:bg-slate-900 hover:text-white"
            disabled={isPending}
          >
            {isPending ? <Loader2 className="animate-spin" /> : ""}
            {isPending ? "Please wait" : isEditing ? "Update" : "Submit"}
          </Button>
          {isEditing ? (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="hover:border hover:bg-slate-900 hover:text-white"
            >
              Cancel
            </Button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
