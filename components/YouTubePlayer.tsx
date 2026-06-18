'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlay } from 'react-icons/fi';

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

interface Props {
  url: string;
  thumbnail?: string;
  title?: string;
}

export default function YouTubePlayer({ url, thumbnail, title }: Props) {
  const [playing, setPlaying] = useState(false);
  const videoId = extractYouTubeId(url);

  if (!videoId) {
    return (
      <div className="w-full aspect-video bg-black/40 rounded-2xl flex items-center justify-center text-foreground/40 font-bold text-sm border border-border">
        Invalid video URL
      </div>
    );
  }

  const embedUrl = [
    `https://www.youtube-nocookie.com/embed/${videoId}?`,
    'autoplay=1',
    'modestbranding=1',
    'rel=0',
    'showinfo=0',
    'controls=1',
    'fs=1',
    'iv_load_policy=3',
    'disablekb=0',
    'playsinline=1',
    'color=white',
  ].join('&');

  const thumbUrl = thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="w-full aspect-video relative rounded-2xl overflow-hidden bg-black group">
      {!playing ? (
        <motion.div
          className="absolute inset-0 cursor-pointer"
          onClick={() => setPlaying(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Thumbnail */}
          <img
            src={thumbUrl}
            alt={title || 'Course video'}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-20 h-20 rounded-full bg-primary shadow-2xl shadow-primary/50 flex items-center justify-center"
            >
              <FiPlay className="text-white text-3xl ml-1" />
            </motion.div>
          </div>
          {/* Title overlay */}
          {title && (
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white font-bold text-sm">{title}</p>
            </div>
          )}
        </motion.div>
      ) : (
        <iframe
          src={embedUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
          title={title || 'Course video'}
        />
      )}
    </div>
  );
}
