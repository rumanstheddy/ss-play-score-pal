import {
  getPlayScoresForGame,
  getUser,
} from "@/providers/PlayScoreProvider/PlayScoreProvider";
import { useQuery } from "@tanstack/react-query";

type PlayScore = {
  userId: string;
};

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

export const useReviewData = (gameId: string) => {
  // Fetch play scores
  const {
    data: playScores,
    isLoading: isPlayScoresLoading,
    isError: isPlayScoresError,
  } = useQuery({
    queryKey: ["playScores", gameId],
    queryFn: () =>
      getPlayScoresForGame({
        fields: "_id userId rating review isRecommended createdAt",
        parameters: { $gameId: "String!" },
        variables: { gameId: gameId },
      }),
  });

  const playScoresData = playScores?.data?.playScoresByGameId;

  // Extract userIds from playScores
  const userIds =
    playScoresData?.map((playScore: PlayScore) => playScore.userId) || [];

  // Fetch user details for each userId
  const {
    data: users,
    isLoading: isUsersLoading,
    isError: isUsersError,
  } = useQuery({
    queryKey: ["users", userIds],
    queryFn: () =>
      Promise.all(
        userIds.map((userId: string) =>
          getUser({
            fields: "firstName lastName email",
            parameters: { $id: "ID!" },
            variables: { id: userId },
          })
        )
      ),
    enabled: !!userIds.length, // Only run if userIds exist
  });

  // Combine playScores and users data
  const reviewsWithUserDetails = playScoresData
    ?.map((playScore: PlayScore, index: number) => ({
      ...playScore,
      user: users?.[index].data.user, // Attach user details to each playScore
    }))
    .filter((review: Review) => review.user); // Filter out reviews where user is undefined

  return {
    reviewsWithUserDetails,
    isLoading: isPlayScoresLoading || isUsersLoading,
    isError: isPlayScoresError || isUsersError,
  };
};