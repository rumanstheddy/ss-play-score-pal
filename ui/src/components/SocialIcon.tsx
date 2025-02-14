import { Suspense, lazy } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

const iconMap: Record<number, React.ComponentType<{ size: number }>> = {
  1: lazy(() =>
    import("react-icons/fa").then((mod) => ({ default: mod.FaGlobe }))
  ),
  2: lazy(() =>
    import("react-icons/si").then((mod) => ({ default: mod.SiFandom }))
  ),
  3: lazy(() =>
    import("react-icons/si").then((mod) => ({ default: mod.SiWikipedia }))
  ),
  4: lazy(() =>
    import("react-icons/si").then((mod) => ({ default: mod.SiFacebook }))
  ),
  5: lazy(() =>
    import("react-icons/si").then((mod) => ({ default: mod.SiTwitter }))
  ),
  6: lazy(() =>
    import("react-icons/si").then((mod) => ({ default: mod.SiTwitch }))
  ),
  8: lazy(() =>
    import("react-icons/si").then((mod) => ({ default: mod.SiInstagram }))
  ),
  9: lazy(() =>
    import("react-icons/si").then((mod) => ({ default: mod.SiYoutube }))
  ),
  10: lazy(() =>
    import("react-icons/si").then((mod) => ({ default: mod.SiApple }))
  ),
  11: lazy(() =>
    import("react-icons/tb").then((mod) => ({ default: mod.TbDeviceIpad }))
  ),
  12: lazy(() =>
    import("react-icons/si").then((mod) => ({ default: mod.SiAndroid }))
  ),
  13: lazy(() =>
    import("react-icons/si").then((mod) => ({ default: mod.SiSteam }))
  ),
  14: lazy(() =>
    import("react-icons/si").then((mod) => ({ default: mod.SiReddit }))
  ),
  15: lazy(() =>
    import("react-icons/si").then((mod) => ({ default: mod.SiItchdotio }))
  ),
  16: lazy(() =>
    import("react-icons/si").then((mod) => ({ default: mod.SiEpicgames }))
  ),
  17: lazy(() =>
    import("react-icons/si").then((mod) => ({ default: mod.SiGogdotcom }))
  ),
  18: lazy(() =>
    import("react-icons/si").then((mod) => ({ default: mod.SiDiscord }))
  ),
};

export default function SocialIcon({ iconCategory }: { iconCategory: number }) {
  const buildIcon = (iconCategory: number) => {
    const Icon = iconMap[iconCategory];

    if (!Icon) {
      return <FaExternalLinkAlt size={40} />; // Return a fallback if the icon isn't in the map
    }

    return (
      <Suspense fallback={<div></div>}>
        <Icon size={40} />
      </Suspense>
    );
  };

  return <>{buildIcon(iconCategory)}</>;
}