// Metadata for third-party YouTube videos embedded in blog posts via
// <YouTubeEmbed videoId="...">. VideoObject's uploadDate and duration are
// pulled once from the YouTube Data API (videos.list, part=snippet,
// contentDetails) rather than guessed, since Google checks these against
// the video itself. A post's own publish date is not a substitute: these
// are label/artist-channel uploads, not RTS.FM's own.
//
// To add an entry for a new <YouTubeEmbed>, fetch the same fields for its
// videoId:
//   https://www.googleapis.com/youtube/v3/videos
//     ?part=snippet,contentDetails&id=<videoId>&key=<API key>
// and copy publishedAt -> uploadDate, contentDetails.duration -> duration,
// snippet.description (trimmed) -> description, and a thumbnails entry ->
// thumbnailUrl. A videoId with no entry here simply gets no VideoObject
// markup; it doesn't break the build.
export type BlogVideoMeta = {
  description: string;
  uploadDate: string;
  duration: string;
  thumbnailUrl: string;
};

export const BLOG_VIDEO_META: Record<string, BlogVideoMeta> = {
  "Z5JfhrL-1fU": {
    description:
      "TYGAPAW's debut full-length for Tresor, Together You Gather All Power Applied Worldwide, released May 2026.",
    uploadDate: "2026-05-14T06:59:58Z",
    duration: "PT51M44S",
    thumbnailUrl: "https://i.ytimg.com/vi/Z5JfhrL-1fU/maxresdefault.jpg",
  },
  otwQvse1gvI: {
    description: "Batu & Donato Dozzy's collaborative album Exhale, released on !K7.",
    uploadDate: "2026-06-12T21:02:34Z",
    duration: "PT8M46S",
    thumbnailUrl: "https://i.ytimg.com/vi/otwQvse1gvI/maxresdefault.jpg",
  },
  pwY6Xct7Wqc: {
    description: "Topdown Dialectic's False LP A, released on False Aralia.",
    uploadDate: "2026-08-27T18:45:16Z",
    duration: "PT1M1S",
    thumbnailUrl: "https://i.ytimg.com/vi/pwY6Xct7Wqc/maxresdefault.jpg",
  },
  "OLQW_F-Vqw4": {
    description: "Eric Cloutier's debut album My Friend The Abyss, released on Palinoia.",
    uploadDate: "2026-07-17T00:56:01Z",
    duration: "PT36M21S",
    thumbnailUrl: "https://i.ytimg.com/vi/OLQW_F-Vqw4/maxresdefault.jpg",
  },
  VnC4IYjG1ow: {
    description: "Steve Rachmad's Light And Time, released on Dekmantel.",
    uploadDate: "2026-08-09T19:29:32Z",
    duration: "PT1H10M59S",
    thumbnailUrl: "https://i.ytimg.com/vi/VnC4IYjG1ow/maxresdefault.jpg",
  },
};
