import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Tag } from "lucide-react";

type Recommendation = {
  id: string;
  label: string;
  icon: ReactNode;
};

const options: Recommendation[] = [
  { id: "YES", label: "Yes", icon: <ThumbsUp className="w-5 h-5" /> },
  { id: "NO", label: "No", icon: <ThumbsDown className="w-5 h-5" /> },
  { id: "ONSALE", label: "On Sale", icon: <Tag className="w-5 h-5" /> },
];

export default function RecommendationSelector({
  selectedOption,
  setSelectedOption,
}: {
  selectedOption: string | null;
  setSelectedOption: (selectedOption: string) => void;
}) {
  return (
    <div className="flex flex-col">
      <p className="text-gray-400 text-md font-semibold mb-4">
        Do you recommend this game?
      </p>
      <div className="flex space-x-2">
        {options.map((option: Recommendation) => (
          <Button
            key={option.id}
            variant={selectedOption === option.id ? "default" : "outline"}
            onClick={() => setSelectedOption(option.id)}
            className={`flex items-center gap-2  hover:border hover:bg-slate-900 hover:text-white ${
              selectedOption && `border`
            }`}
          >
            {option.icon}
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
