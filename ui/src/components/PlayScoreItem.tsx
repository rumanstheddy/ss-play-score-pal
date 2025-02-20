interface ReviewItemProps {
  userName: string;
  rating: number;
  review: string;
  isRecommended: string;
  createdAt: string;
  updatedAt: string;
}

export default function PlayScoreItem({
  userName,
  rating,
  review,
  isRecommended,
  createdAt,
  updatedAt,
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
    </li>
  );
}
