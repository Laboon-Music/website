import Image from "next/image";
import { cx } from "@/lib/cx";

/** Laboon wordmark (decorative image: the surrounding link or heading is named). */
export function Wordmark({
  className,
  alt = "",
  white,
  priority,
}: {
  className?: string;
  alt?: string;
  /** Paints the wordmark white (footer, blue backgrounds). */
  white?: boolean;
  /** Loads at once (header logo: it is the first thing painted, never lazy). */
  priority?: boolean;
}) {
  return (
    <Image
      src="/brand/wordmark.svg"
      alt={alt}
      width={510}
      height={132}
      unoptimized
      priority={priority}
      className={cx("h-auto", white && "brightness-0 invert", className)}
    />
  );
}
