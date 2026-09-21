"use client";

import { Pause, Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import guestRoomImage from "@assets/gem-stat-et/guest-room.jpeg";
import styles from "@/features/home/ui/hero-room.module.css";

export function HeroRoom() {
  const [paused, setPaused] = useState(false);

  return (
    <figure
      className={`${styles.scene} shadow-soft relative isolate overflow-hidden rounded-3xl`}
    >
      <Image
        alt="GEM Stat ET thermostat beside a bright, comfortable guestroom"
        className={`${styles.image} object-cover object-[center_43%]`}
        fill
        id="hero-room-image"
        placeholder="blur"
        preload
        sizes="(min-width: 1280px) 568px, (min-width: 1024px) 46vw, (min-width: 640px) 70vw, 92vw"
        src={guestRoomImage}
        style={{ animationPlayState: paused ? "paused" : "running" }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent"
      />
      <button
        aria-controls="hero-room-image"
        aria-label={
          paused ? "Play guestroom animation" : "Pause guestroom animation"
        }
        className={`${styles.control} absolute top-4 right-4 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-white/50 bg-white px-4 text-xs font-semibold text-slate-900 shadow-sm hover:bg-slate-100`}
        onClick={() => setPaused((current) => !current)}
        type="button"
      >
        {paused ? (
          <Play aria-hidden size={14} />
        ) : (
          <Pause aria-hidden size={14} />
        )}
        {paused ? "Play motion" : "Pause motion"}
      </button>
      <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
        <p className="text-xs font-semibold tracking-widest uppercase">
          GEM Stat™ ET
        </p>
        <p className="mt-2 max-w-xs text-xl leading-snug font-semibold sm:text-2xl">
          A comfortable stay.
          <br />A smarter use of energy.
        </p>
      </figcaption>
    </figure>
  );
}
