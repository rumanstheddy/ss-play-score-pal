import Link from "next/link";
import SocialIcon from "./SocialIcon";

type Website = {
  id: number;
  category: number;
  url: string;
};

export default function WebsiteList({ websites }: { websites: Website[] }) {
  return (
    <div className="flex flex-row mt-10 justify-around items-center">
      {websites ? (
        websites.map((website: Website) => (
          <Link href={website.url} key={website.id}>
            <div className="text">
              <SocialIcon iconCategory={website.category} size={40} />
            </div>
          </Link>
        ))
      ) : (
        <></>
      )}
    </div>
  );
}
