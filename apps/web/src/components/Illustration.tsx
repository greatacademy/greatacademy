import { useState } from "react";

/**
 * Illustration shows an illustration, a 3:2 picture that only decorates: the page never waits for it, and one that
 * fails to load leaves no gap. path is its path from the site's root without an extension, as the API gives it; thumb
 * shows the small file, for lists.
 */
export function Illustration({ path, thumb = false, className = "" }: { path: string; thumb?: boolean; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!path || failed) return null;
  const width = thumb ? 480 : 960;
  return (
    <img
      src={`/${path}${thumb ? ".thumb" : ""}.webp`}
      alt=""
      width={width}
      height={(width * 2) / 3}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`aspect-[3/2] rounded-xl bg-line object-cover ${className}`}
    />
  );
}
