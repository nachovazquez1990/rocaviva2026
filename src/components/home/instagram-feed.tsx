"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import {
  fadeIn,
  staggerContainer,
  staggerItem,
  lineReveal,
} from "@/components/animations/motion-variants";
import type { HomeContentMap } from "@/app/[locale]/(public)/page";

const BEHOLD_FEED_ID = process.env.NEXT_PUBLIC_BEHOLD_FEED_ID;
const BEHOLD_API_URL = `https://feeds.behold.so/${BEHOLD_FEED_ID}`;

interface BeholdPost {
  id: string;
  timestamp: string;
  permalink: string;
  mediaType: "IMAGE" | "VIDEO";
  mediaUrl: string;
  sizes: {
    small: { mediaUrl: string; width: number; height: number };
    medium: { mediaUrl: string; width: number; height: number };
    large: { mediaUrl: string; width: number; height: number };
    full: { mediaUrl: string; width: number; height: number };
  };
  caption: string;
  prunedCaption: string;
  likeCount: number;
  commentsCount: number;
}

interface BeholdFeed {
  username: string;
  posts: BeholdPost[];
}

export function InstagramFeed({ content }: { content: HomeContentMap }) {
  const t = useTranslations("home");
  const c = (dbKey: string, tKey: string) => content[dbKey] || t(tKey);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [feed, setFeed] = useState<BeholdFeed | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!BEHOLD_FEED_ID) return;

    fetch(BEHOLD_API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Feed fetch failed");
        return res.json();
      })
      .then((data: BeholdFeed) => setFeed(data))
      .catch(() => setError(true));
  }, []);

  const posts = feed?.posts ?? [];
  const username = feed?.username ?? "rocavivaeventos";

  return (
    <section
      className="py-24 md:py-32 bg-white"
      aria-labelledby="social-title"
    >
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-12 md:mb-16"
        >
          <h2
            id="social-title"
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900"
          >
            {c("social_title", "socialTitle")}
          </h2>
          <motion.div
            variants={lineReveal}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="h-px bg-brand-600 mt-6 mx-auto max-w-[120px] origin-center"
          />
        </motion.div>

        {/* Instagram Grid */}
        {!BEHOLD_FEED_ID || error ? (
          <FallbackLink username={username} label={t("socialFollow")} />
        ) : posts.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-neutral-100 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
          >
            {posts.map((post) => (
              <InstagramPost
                key={post.id}
                post={post}
                altPrefix={t("socialViewPost")}
              />
            ))}
          </motion.div>
        )}

        {/* Follow link */}
        {posts.length > 0 && (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="text-center mt-10"
          >
            <a
              href={`https://instagram.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs font-medium tracking-[0.2em] uppercase text-brand-600 hover:text-brand-700 transition-colors duration-300 border-b border-brand-600/30 hover:border-brand-600 pb-0.5"
            >
              @{username}
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function InstagramPost({
  post,
  altPrefix,
}: {
  post: BeholdPost;
  altPrefix: string;
}) {
  const caption = post.prunedCaption || post.caption || "";
  const truncated = caption.length > 80 ? caption.slice(0, 80) + "..." : caption;
  const imgSrc = post.sizes.medium?.mediaUrl || post.mediaUrl;

  return (
    <motion.a
      variants={staggerItem}
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative aspect-square overflow-hidden bg-neutral-100 block"
      aria-label={`${altPrefix}: ${truncated}`}
    >
      <Image
        src={imgSrc}
        alt={truncated}
        fill
        sizes="(max-width: 768px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end">
        <div className="p-3 md:p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-white text-xs md:text-sm leading-relaxed line-clamp-3">
            {truncated}
          </p>
          <div className="flex items-center gap-3 mt-2 text-white/90 text-xs">
            <span aria-hidden="true">&#9825; {post.likeCount}</span>
            <span aria-hidden="true">&#9901; {post.commentsCount}</span>
          </div>
        </div>
      </div>
      {/* Video indicator */}
      {post.mediaType === "VIDEO" && (
        <div className="absolute top-3 right-3 text-white/80" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}
    </motion.a>
  );
}

function FallbackLink({
  username,
  label,
}: {
  username: string;
  label: string;
}) {
  return (
    <div className="bg-neutral-50 py-16 px-8 text-center">
      <a
        href={`https://instagram.com/${username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-xs font-medium tracking-[0.2em] uppercase text-brand-600 hover:text-brand-700 transition-colors duration-300 border-b border-brand-600/30 hover:border-brand-600 pb-0.5"
      >
        {label}
      </a>
    </div>
  );
}
