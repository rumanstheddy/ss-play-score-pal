import Link from "next/link";
import React from "react";

interface ItextLinkProps {
  spanStyle: string;
  linkStyle: string;
  text: string;
  link: string;
}

export default function TextLink({
  spanStyle,
  linkStyle,
  text,
  link,
}: ItextLinkProps): React.ReactElement {
  return (
    <span className={spanStyle}>
      <Link className={linkStyle} href={link}>
        {text}
      </Link>
    </span>
  );
}
