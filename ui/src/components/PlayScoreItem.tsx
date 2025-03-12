import React, { ReactNode } from "react";
import { Button } from "./ui/button";
// import { format } from "date-fns";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Tag,
  CalendarPlus,
  CalendarCog,
  CircleUserRound,
  BadgeCheck,
} from "lucide-react"; // Import Lucide icons

interface ReviewItemProps {
  _id: string;
  userName: string;
  rating: number;
  review: string;
  isRecommended: string;
  createdAt: string;
  updatedAt: string;
  isLoggedUser: boolean;
  shouldEdit: (
    value: boolean,
    existingReview: Partial<ReviewItemProps>
  ) => void;
  isEditing: boolean;
  userType: string;
}

type Recommendation = {
  id: string;
  label: string;
  icon: ReactNode;
};

export default function PlayScoreItem({
  _id,
  userName,
  rating,
  review,
  isRecommended,
  createdAt,
  updatedAt,
  isLoggedUser,
  shouldEdit,
  isEditing,
  userType,
}: ReviewItemProps): React.ReactElement {
  const createdAtDate = new Date(Number(createdAt)).toLocaleDateString();
  const updatedAtDate = updatedAt
    ? new Date(Number(updatedAt)).toLocaleDateString()
    : "";

  const options: Recommendation[] = [
    { id: "YES", label: "Yes", icon: <ThumbsUp className="w-5 h-5" /> },
    { id: "NO", label: "No", icon: <ThumbsDown className="w-5 h-5" /> },
    { id: "ONSALE", label: "On Sale", icon: <Tag className="w-5 h-5" /> },
  ];

  return (
    <li className="text-white bg-background text-foreground p-6 rounded-lg shadow-md border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-col items-center">
          <div className="flex items-start text-md font-semibold mb-4">
            {/* <CircleUserRound className="h-5 w-5 text-white" /> */}
            {userName}
            {userType === "CRITIC" ? (
              <BadgeCheck className="h-5 w-5 ml-1" />
            ) : (
              ""
            )}
          </div>
          {/* <div className="flex items-center text-sm text-gray-400">
            <Calendar className="h-4 w-4 mr-1" />
            {createdAtDate}
          </div> */}
          <div className="flex items-center gap-2">
            <div className="flex w-min bg-[color:--bg-color-rating] rounded-md px-2 pt-1.5 pb-1">
              <Star className="h-5 w-5 text-white mr-1" />
              <span className="font-bold">{rating}</span>
            </div>
            <div className={`flex gap-2 items-center text-sm`}>
              <div
                className={`flex items-center gap-2 bg-${
                  isRecommended === "YES"
                    ? `green`
                    : isRecommended === "NO"
                    ? "red"
                    : "yellow"
                }-500 p-2 rounded-md`}
              >
                {options.find((option) => option.id === isRecommended)?.icon}
                <span className={`font-semibold`}>
                  {options.find((option) => option.id === isRecommended)?.label}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          {/* <Star className="h-5 w-5 text-yellow-500 mr-1" />
          <span className="font-bold">{rating}</span> */}
          <div className="flex items-center text-sm text-white">
            <CalendarPlus className="h-5 w-5 mr-1" />
            {createdAtDate}
          </div>
          {updatedAtDate !== createdAtDate ? (
            <div className="flex items-center text-sm text-white">
              <CalendarCog className="h-5 w-5 mr-1" />
              {updatedAtDate}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      {/* <div className="mb-3">
        <div className={`flex gap-2 items-center text-sm`}>
          <div
            className={`flex items-center gap-2 bg-${
              isRecommended === "YES"
                ? `green`
                : isRecommended === "NO"
                ? "red"
                : "yellow"
            }-500 p-2 rounded-md`}
          >
            {options.find((option) => option.id === isRecommended)?.icon}
            <span className={`font-semibold`}>
              {options.find((option) => option.id === isRecommended)?.label}
            </span>
          </div>
        </div>
      </div> */}

      <div className="text-md mt-8 ">{review}</div>

      {isLoggedUser && (
        <div className="mt-8 flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="hover:border text-black hover:bg-slate-900 hover:text-white disabled:text-white disabled:bg-slate-500 disabled:cursor-default"
            onClick={() =>
              shouldEdit(true, {
                _id: _id,
                rating: rating,
                isRecommended: isRecommended,
                review: review,
              })
            }
            disabled={isEditing}
          >
            {isEditing ? "Editing" : "Edit"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="hover:border bg-red-600 hover:bg-red-900 hover:text-white"
          >
            Delete
          </Button>
        </div>
      )}
    </li>
  );
}
