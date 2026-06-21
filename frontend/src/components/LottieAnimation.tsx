'use client';
import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

interface Props {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  loop?: boolean;
  autoplay?: boolean;
}

export default function LottieAnimation({ src, className, style, loop = true, autoplay = true }: Props) {
  const [data, setData] = useState<object | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error('fetch failed');
        return r.json();
      })
      .then((json) => { if (active) { setData(json); setError(false); } })
      .catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [src]);

  if (error || !data) return null;

  return (
    <Lottie
      animationData={data}
      loop={loop}
      autoplay={autoplay}
      className={className}
      style={style}
    />
  );
}
