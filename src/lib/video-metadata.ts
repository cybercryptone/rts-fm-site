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
  "3CCFIMrPpDY": {
    description:
      "Yoyaku instore session with Tomoki Tamura, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2024-06-25T16:00:03Z",
    duration: "PT1H27M37S",
    thumbnailUrl: "https://i.ytimg.com/vi/3CCFIMrPpDY/maxresdefault.jpg",
  },
  yM2kEQtiWgE: {
    description:
      "Yoyaku instore session celebrating Satoshi Tomiie and Tomoki Tamura's joint EP, TOMTOM001.",
    uploadDate: "2024-12-07T08:37:18Z",
    duration: "PT1H52M37S",
    thumbnailUrl: "https://i.ytimg.com/vi/yM2kEQtiWgE/maxresdefault.jpg",
  },
  "BCt_JY--F78": {
    description:
      "Yoyaku instore session with Karla Böhm, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2024-03-01T11:00:50Z",
    duration: "PT1H10M",
    thumbnailUrl: "https://i.ytimg.com/vi/BCt_JY--F78/maxresdefault.jpg",
  },
  "01aNpNmV_3w": {
    description:
      "Yoyaku instore session with Nina Yamada, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2026-04-14T13:53:05Z",
    duration: "PT1H9M46S",
    thumbnailUrl: "https://i.ytimg.com/vi/01aNpNmV_3w/maxresdefault.jpg",
  },
  aI3cXBOjoOU: {
    description:
      "Yoyaku instore session with Nina Kraviz, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2025-11-23T17:00:28Z",
    duration: "PT1H43M31S",
    thumbnailUrl: "https://i.ytimg.com/vi/aI3cXBOjoOU/maxresdefault.jpg",
  },
  TCcPM5S8AxM: {
    description:
      "Yoyaku instore session with Satoshi Tomiie & Tomoki Tamura, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2026-07-10T17:42:39Z",
    duration: "PT1H9M50S",
    thumbnailUrl: "https://i.ytimg.com/vi/TCcPM5S8AxM/maxresdefault.jpg",
  },
  F8Nh7sJl4gU: {
    description:
      "Yoyaku instore session with Helena Hauff, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2026-02-15T14:28:38Z",
    duration: "PT59M38S",
    thumbnailUrl: "https://i.ytimg.com/vi/F8Nh7sJl4gU/maxresdefault.jpg",
  },
  RRKqc_dsmJA: {
    description:
      "Yoyaku instore session with S.A.M., published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2017-11-02T20:39:20Z",
    duration: "PT1H49M14S",
    thumbnailUrl: "https://i.ytimg.com/vi/RRKqc_dsmJA/maxresdefault.jpg",
  },
  "3KmYs_IlpKU": {
    description:
      "Yoyaku instore session with Magda, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2024-02-23T16:05:47Z",
    duration: "PT1H1M36S",
    thumbnailUrl: "https://i.ytimg.com/vi/3KmYs_IlpKU/maxresdefault.jpg",
  },
  "-8H0Jc1GfKE": {
    description:
      "Yoyaku instore session with Andrey Pushkarev, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2017-08-24T20:50:49Z",
    duration: "PT1H59M36S",
    thumbnailUrl: "https://i.ytimg.com/vi/-8H0Jc1GfKE/maxresdefault.jpg",
  },
};
