import { Badge } from "./ui/badge";

export default function ThemeBadgeList({
  themes,
}: {
  themes: { id: number; name: string }[];
}) {
  return (
    <div className="flex flex-row mt-8 flex-wrap">
      {themes ? (
        themes.map(({ id, name }, index) => {
          return (
            !!id &&
            !!name && (
              <Badge
                className={`bg-gray-500 rounded-md m-1 ${
                  index === 0 ? "ml-0" : ""
                }`}
                key={id}
              >
                <span className="text-white text-base px-1 py-1">{name}</span>
              </Badge>
            )
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
}
