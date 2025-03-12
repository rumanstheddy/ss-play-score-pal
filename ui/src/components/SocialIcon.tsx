import { FaExternalLinkAlt } from "@react-icons/all-files/fa/FaExternalLinkAlt";
import { FaGlobe } from "@react-icons/all-files/fa/FaGlobe";
import {
  SimpleIcon,
  siAndroid,
  siApple,
  siEpicgames,
  siFandom,
  siGogdotcom,
  siSteam,
} from "simple-icons";

type IconMapType = SimpleIcon;

const iconMap: Record<number, IconMapType> = {
  2: siFandom,
  10: siApple,
  12: siAndroid,
  13: siSteam,
  16: siEpicgames,
  17: siGogdotcom,
};

export default function SocialIcon({
  iconCategory,
  size,
}: {
  iconCategory: number;
  size: number;
}) {
  const buildIcon = (iconCategory: number) => {
    const Icon = iconMap[iconCategory];

    if (iconCategory === 1) {
      return <FaGlobe size={size} color="black" />;
    }
    // If no icon found, return default external link icon
    if (!Icon) return <FaExternalLinkAlt size={size} />;
    // It's a SimpleIcon object (SVG data)
    return (
      <svg
        width={40}
        height={40}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={Icon.path} fill={`#${Icon.hex}`} />
      </svg>
    );
  };

  return (
    <div className="bg-white p-1 rounded-lg">{buildIcon(iconCategory)}</div>
  );
}
