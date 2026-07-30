"use client";

import { useState } from "react";
import Image from "next/image";

type AvatarProps = {
  images: readonly string[];
  alt: string;
};

export const Avatar = ({ images, alt }: AvatarProps) => {
  const [index, setIndex] = useState(0);

  const cycle = () => setIndex((current) => (current + 1) % images.length);

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label="Change profile photo"
      className="group relative size-28 overflow-hidden rounded-full border border-border ring-1 ring-border ring-offset-2 ring-offset-background transition-transform duration-200 hover:ring-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95"
    >
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={alt}
          width={112}
          height={112}
          priority={i === 0}
          draggable={false}
          className={`absolute inset-0 size-full select-none object-cover transition-opacity duration-300 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </button>
  );
};
