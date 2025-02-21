import {
  getPlayScoresForGame,
  getUser,
} from "@/providers/PlayScore/PlayScoreProvider";
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

export const usePlayScoreData = (gameId: string) => {
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

  const userIds =
    playScoresData?.map((playScore: PlayScore) => playScore.userId) || [];

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
    enabled: !!userIds.length,
  });

  // Combine playScores and users data
  const reviewsWithUserDetails = playScoresData?.map(
    (playScore: PlayScore, index: number) => ({
      ...playScore,
      user: users?.[index].data.user,
    })
  );

  return {
    reviewsWithUserDetails,
    isLoading: isPlayScoresLoading || isUsersLoading,
    isError: isPlayScoresError || isUsersError,
  };
};
