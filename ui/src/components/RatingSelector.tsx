import { Button } from "@/components/ui/button"; // Adjust the import path for shadcn Button

export default function RatingSelector({
  selectedRating,
  onSelectRating,
}: {
  selectedRating: number | null;
  onSelectRating: (number: number) => void;
}) {
  const numbers = Array.from({ length: 10 }, (_, i) => i + 1); // Generate numbers 1 to 10

  return (
    <div className="flex flex-col">
      <p className="text-gray-400 text-md font-semibold mb-4">Your Rating</p>
      <div className="flex gap-2">
        {numbers.map((number) => (
          <Button
            key={number}
            variant={selectedRating === number ? "default" : "outline"}
            onClick={() => onSelectRating(number)}
            className={`rounded-full h-10 w-10 p-0 flex items-center  hover:border hover:bg-slate-900 hover:text-white
                      ${selectedRating === number && "border"}`}
          >
            {number}
          </Button>
        ))}
      </div>
    </div>
  );
}
