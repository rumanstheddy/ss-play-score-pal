import { Button } from "./ui/button";

interface ReviewItemProps {
  userName: string;
  rating: number;
  review: string;
  isRecommended: string;
  createdAt: string;
  updatedAt: string;
  isLoggedUser: boolean;
}

export default function PlayScoreItem({
  userName,
  rating,
  review,
  isRecommended,
  createdAt,
  updatedAt,
  isLoggedUser,
}: ReviewItemProps): React.ReactElement {
  return (
    <li className="text-white bg-background text-foreground p-4 rounded-lg shadow-sm border border-border">
      {/* Row 1: User Name */}
      <div className="text-lg font-semibold mb-2">{userName}</div>

      {/* Row 2: Rating */}
      <div className="text-foreground mb-2">
        Rating: <span className="font-bold">{rating}</span>
      </div>
      <div className="text-foreground mb-2">
        Recommended: <span className="font-bold">{isRecommended}</span>
      </div>

      {/* Row 3: Review */}
      <div className="text-muted-foreground">{review}</div>
      {isLoggedUser ? (
        <div className="mt-4 flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="hover:border text-black hover:bg-slate-900 hover:text-white"
          >
            Edit
          </Button>
          <Button
            type="button"
            variant="outline"
            className="hover:border bg-red-600 hover:bg-red-900 hover:text-white"
          >
            Delete
          </Button>
        </div>
      ) : (
        <></>
      )}
    </li>
  );
}
