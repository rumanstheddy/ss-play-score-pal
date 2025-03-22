import { Platform } from "@/types/types";

export default function PlatformList({ platforms }: { platforms: Platform[] }) {
  return (
    <div className="flex flex-row mt-4">
      <div className=" text-gray-400 block">
        <p className="text-xl inline font-semibold">Platforms</p>
        <div className="block mt-1">
          {platforms ? (
            platforms.map((platform: Platform, i: number) => (
              <span className="text text-xl inline" key={platform.id}>
                {platform.name}
                {i !== platforms.length - 1 ? ", " : ""}
              </span>
            ))
          ) : (
            <span className="text text-xl inline">Information unavailable</span>
          )}
        </div>
      </div>
    </div>
  );
}
