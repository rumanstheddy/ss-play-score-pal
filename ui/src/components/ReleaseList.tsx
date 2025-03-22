import { Platform } from "@/types/types";
import { dateConverter } from "@/lib/utils";

type Release = {
  id?: number;
  game?: number;
  date?: Date;
  platform?: number;
  platformName?: string;
};

export default function ReleaseList({
  platforms,
  releaseDates,
}: {
  platforms: Platform[];
  releaseDates: Partial<Release>[];
}) {
  const buildReleaseDateList = (): Release[] => {
    const releases = releaseDates;

    const releaseDateInfo: Release[] = [];

    if (platforms && releases) {
      releases.forEach((release: Partial<Release>) => {
        const platformDetails: Platform | undefined = platforms.find(
          (platform: Platform) => platform.id === release.platform
        );

        releaseDateInfo.push({
          id: release?.id,
          game: release?.game,
          date: release?.date,
          platform: release?.platform,
          platformName: platformDetails?.name,
        });
      });
    }

    return releaseDateInfo;
  };

  return (
    <>
      {buildReleaseDateList() && buildReleaseDateList().length > 0 ? (
        <fieldset className="border px-4 pb-4 mt-6 rounded-sm">
          <legend className="text-gray-400 text-xl font-bold px-2">
            Releases
          </legend>
          <div className="flex flex-col text-xl">
            {buildReleaseDateList().map((release: Release) => {
              return (
                <div className="flex flex-row justify-between" key={release.id}>
                  <span className="text mt-2">{release.platformName}</span>
                  <span className="text mt-2">
                    {release.date
                      ? dateConverter(release.date as unknown as number)
                      : "To Be Announced"}
                  </span>
                </div>
              );
            })}
          </div>
        </fieldset>
      ) : (
        <></>
      )}
    </>
  );
}
