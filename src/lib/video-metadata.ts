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
  Clg_CILE5Eo: {
    description:
      "Yoyaku instore session with Satoshi Tomiie, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2017-12-21T21:02:00Z",
    duration: "PT2H6M32S",
    thumbnailUrl: "https://i.ytimg.com/vi/Clg_CILE5Eo/maxresdefault.jpg",
  },
  pKChDHiWh54: {
    description:
      "Yoyaku instore session with E.lina, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2026-09-17T15:00:26Z",
    duration: "PT1H2M48S",
    thumbnailUrl: "https://i.ytimg.com/vi/pKChDHiWh54/maxresdefault.jpg",
  },
  A99ejtc75E0: {
    description:
      "Yoyaku instore session with Cabanne, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2018-09-08T01:28:31Z",
    duration: "PT2H1M17S",
    thumbnailUrl: "https://i.ytimg.com/vi/A99ejtc75E0/hqdefault.jpg",
  },
  "025Edpr2vUY": {
    description:
      "Yoyaku instore session with Cabanne, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2025-11-27T14:52:50Z",
    duration: "PT56M42S",
    thumbnailUrl: "https://i.ytimg.com/vi/025Edpr2vUY/maxresdefault.jpg",
  },
  O8HZQ8q8m2E: {
    description:
      "Yoyaku instore session with Cabanne, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2017-05-12T20:14:01Z",
    duration: "PT1H54M16S",
    thumbnailUrl: "https://i.ytimg.com/vi/O8HZQ8q8m2E/hqdefault.jpg",
  },
  "g-bIqoogMek": {
    description:
      "Yoyaku instore session with E.lina, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2024-11-27T09:53:05Z",
    duration: "PT58M27S",
    thumbnailUrl: "https://i.ytimg.com/vi/g-bIqoogMek/hqdefault.jpg",
  },
  "1K28FW4L8oo": {
    description:
      "Yoyaku instore session with Alec Falconer, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2023-08-23T15:00:02Z",
    duration: "PT2H30M40S",
    thumbnailUrl: "https://i.ytimg.com/vi/1K28FW4L8oo/maxresdefault.jpg",
  },
  "7jbsaEU95vw": {
    description:
      "Yoyaku instore session with Mad Rey, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2023-06-28T18:00:09Z",
    duration: "PT56M50S",
    thumbnailUrl: "https://i.ytimg.com/vi/7jbsaEU95vw/maxresdefault.jpg",
  },
  BfU_lxTluRE: {
    description:
      "Yoyaku instore session with D'Julz, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2025-06-03T15:19:32Z",
    duration: "PT1H1M2S",
    thumbnailUrl: "https://i.ytimg.com/vi/BfU_lxTluRE/maxresdefault.jpg",
  },
  HTFKk_TCfKI: {
    description:
      "Yoyaku instore session with Flabaire, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2026-05-07T15:40:00Z",
    duration: "PT58M32S",
    thumbnailUrl: "https://i.ytimg.com/vi/HTFKk_TCfKI/maxresdefault.jpg",
  },
  JqemoFzriX8: {
    description:
      "Yoyaku instore session with Audio Werner, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2018-04-19T19:42:40Z",
    duration: "PT1H53M19S",
    thumbnailUrl: "https://i.ytimg.com/vi/JqemoFzriX8/maxresdefault.jpg",
  },
  NQEDqnqcVoM: {
    description:
      "Yoyaku instore session with Le Loup, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2025-06-25T15:25:06Z",
    duration: "PT1H31M34S",
    thumbnailUrl: "https://i.ytimg.com/vi/NQEDqnqcVoM/maxresdefault.jpg",
  },
  Q1lbQhtD5Vg: {
    description:
      "Yoyaku instore session with Christopher Ledger, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2024-07-03T10:53:10Z",
    duration: "PT1H13M11S",
    thumbnailUrl: "https://i.ytimg.com/vi/Q1lbQhtD5Vg/maxresdefault.jpg",
  },
  QfQo4WkF5ZM: {
    description:
      "Yoyaku instore session with Camion Bazar, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2025-02-05T16:47:51Z",
    duration: "PT1H3M36S",
    thumbnailUrl: "https://i.ytimg.com/vi/QfQo4WkF5ZM/maxresdefault.jpg",
  },
  RcyUYhcu99k: {
    description:
      "Yoyaku instore session with Vincent Lemieux, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2024-07-23T15:45:06Z",
    duration: "PT1H17S",
    thumbnailUrl: "https://i.ytimg.com/vi/RcyUYhcu99k/maxresdefault.jpg",
  },
  "U-NSmf1tj8M": {
    description:
      "Yoyaku instore session with Flabaire, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2024-11-14T16:13:44Z",
    duration: "PT57M43S",
    thumbnailUrl: "https://i.ytimg.com/vi/U-NSmf1tj8M/hqdefault.jpg",
  },
  "XsbY-y_m9z8": {
    description:
      "Yoyaku instore session with D'Julz, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2018-11-02T00:54:35Z",
    duration: "PT1H24M32S",
    thumbnailUrl: "https://i.ytimg.com/vi/XsbY-y_m9z8/hqdefault.jpg",
  },
  ZM3pLQRLWks: {
    description:
      "Yoyaku instore session with Vincent Lemieux, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2019-10-05T17:58:23Z",
    duration: "PT2H4M18S",
    thumbnailUrl: "https://i.ytimg.com/vi/ZM3pLQRLWks/maxresdefault.jpg",
  },
  cvmcM3bUYyA: {
    description:
      "Yoyaku instore session with Molly, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2017-06-12T09:34:44Z",
    duration: "PT2H4M57S",
    thumbnailUrl: "https://i.ytimg.com/vi/cvmcM3bUYyA/hqdefault.jpg",
  },
  "foX--BrbSUo": {
    description:
      "Yoyaku instore session with Le Loup, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2016-07-17T12:43:43Z",
    duration: "PT1H50M2S",
    thumbnailUrl: "https://i.ytimg.com/vi/foX--BrbSUo/hqdefault.jpg",
  },
  g_NcmQyfr6Y: {
    description:
      "Yoyaku instore session with Raphaël Top Secret, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2023-12-14T16:00:31Z",
    duration: "PT1H5M32S",
    thumbnailUrl: "https://i.ytimg.com/vi/g_NcmQyfr6Y/maxresdefault.jpg",
  },
  iQQAmZWm04Y: {
    description:
      "Yoyaku instore session with Mad Rey, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2026-06-23T15:27:31Z",
    duration: "PT51M19S",
    thumbnailUrl: "https://i.ytimg.com/vi/iQQAmZWm04Y/maxresdefault.jpg",
  },
  j8Na5TS281U: {
    description:
      "Yoyaku instore session with Edward Giegling, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2025-08-22T15:19:07Z",
    duration: "PT1H10M13S",
    thumbnailUrl: "https://i.ytimg.com/vi/j8Na5TS281U/maxresdefault.jpg",
  },
  jQRfAIpV_FM: {
    description:
      "Yoyaku instore session with DVDE, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2023-12-21T16:50:00Z",
    duration: "PT58M18S",
    thumbnailUrl: "https://i.ytimg.com/vi/jQRfAIpV_FM/maxresdefault.jpg",
  },
  keAPZFIEbsg: {
    description:
      "Yoyaku instore session with Raphaël Top Secret, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2019-05-17T18:33:23Z",
    duration: "PT1H20M50S",
    thumbnailUrl: "https://i.ytimg.com/vi/keAPZFIEbsg/maxresdefault.jpg",
  },
  mopxW_A6PG4: {
    description:
      "Yoyaku instore session with Lowris, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2016-12-09T11:00:17Z",
    duration: "PT1H57M7S",
    thumbnailUrl: "https://i.ytimg.com/vi/mopxW_A6PG4/hqdefault.jpg",
  },
  "nY-euj66T0k": {
    description:
      "Yoyaku instore session with Camion Bazar, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2026-05-28T16:00:06Z",
    duration: "PT57M",
    thumbnailUrl: "https://i.ytimg.com/vi/nY-euj66T0k/maxresdefault.jpg",
  },
  rZb5A6ES3nw: {
    description:
      "Yoyaku instore session with DVDE, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2026-01-30T15:13:17Z",
    duration: "PT1H12M13S",
    thumbnailUrl: "https://i.ytimg.com/vi/rZb5A6ES3nw/maxresdefault.jpg",
  },
  "srUM-u2wVVc": {
    description:
      "Yoyaku instore session with Janeret, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2016-05-11T10:45:40Z",
    duration: "PT1H17M7S",
    thumbnailUrl: "https://i.ytimg.com/vi/srUM-u2wVVc/hqdefault.jpg",
  },
  "1qTFMD_id_4": {
    description:
      "Yoyaku instore session with Roger Gerressen, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2016-10-29T14:29:27Z",
    duration: "PT1H56M46S",
    thumbnailUrl: "https://i.ytimg.com/vi/1qTFMD_id_4/hqdefault.jpg",
  },
  "7PBLStcN6Os": {
    description:
      "Yoyaku instore session with Octal Industries, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2024-04-12T10:00:06Z",
    duration: "PT1H14M6S",
    thumbnailUrl: "https://i.ytimg.com/vi/7PBLStcN6Os/maxresdefault.jpg",
  },
  FJm97Ng6jS8: {
    description:
      "Yoyaku instore session with Black Loops, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2024-07-10T10:00:27Z",
    duration: "PT1H6M47S",
    thumbnailUrl: "https://i.ytimg.com/vi/FJm97Ng6jS8/maxresdefault.jpg",
  },
  FncaK1YIg_M: {
    description:
      "Yoyaku instore session with Varhat, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2019-05-17T20:12:45Z",
    duration: "PT1H1M19S",
    thumbnailUrl: "https://i.ytimg.com/vi/FncaK1YIg_M/maxresdefault.jpg",
  },
  JVqCLkgtrDI: {
    description:
      "Yoyaku instore session with Sevensol, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2024-11-21T15:09:35Z",
    duration: "PT2H36M18S",
    thumbnailUrl: "https://i.ytimg.com/vi/JVqCLkgtrDI/maxresdefault.jpg",
  },
  Kvwy81w5YJU: {
    description:
      "Yoyaku instore session with Maayan Nidam, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2019-12-06T23:18:39Z",
    duration: "PT2H13M38S",
    thumbnailUrl: "https://i.ytimg.com/vi/Kvwy81w5YJU/maxresdefault.jpg",
  },
  NItxXLoPrzM: {
    description:
      "Yoyaku instore session with DeWalta, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2018-11-22T22:08:08Z",
    duration: "PT2H16M11S",
    thumbnailUrl: "https://i.ytimg.com/vi/NItxXLoPrzM/maxresdefault.jpg",
  },
  O5l90acw7Ps: {
    description:
      "Yoyaku instore session with Monile, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2026-07-21T15:14:38Z",
    duration: "PT58M23S",
    thumbnailUrl: "https://i.ytimg.com/vi/O5l90acw7Ps/maxresdefault.jpg",
  },
  OiXjIBx05ww: {
    description:
      "Yoyaku instore session with Danny Daze, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2026-01-07T16:21:43Z",
    duration: "PT48M2S",
    thumbnailUrl: "https://i.ytimg.com/vi/OiXjIBx05ww/maxresdefault.jpg",
  },
  PetQjSdKPzY: {
    description:
      "Yoyaku instore session with Tomas Station, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2024-03-08T15:46:31Z",
    duration: "PT1H35M29S",
    thumbnailUrl: "https://i.ytimg.com/vi/PetQjSdKPzY/maxresdefault.jpg",
  },
  RR0fQDjnT8I: {
    description:
      "Yoyaku instore session with Maxime dB, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2025-01-24T17:23:51Z",
    duration: "PT1H58M55S",
    thumbnailUrl: "https://i.ytimg.com/vi/RR0fQDjnT8I/maxresdefault.jpg",
  },
  "ThhZpR-BMLc": {
    description:
      "Yoyaku instore session with Cinthie, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2024-07-19T14:19:09Z",
    duration: "PT2H40M20S",
    thumbnailUrl: "https://i.ytimg.com/vi/ThhZpR-BMLc/maxresdefault.jpg",
  },
  b3WhGfYU5Uc: {
    description:
      "Yoyaku instore session with Atree, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2024-11-07T16:17:07Z",
    duration: "PT2H35S",
    thumbnailUrl: "https://i.ytimg.com/vi/b3WhGfYU5Uc/maxresdefault.jpg",
  },
  sZunCpYnv3Y: {
    description:
      "Yoyaku instore session with Ellen Allien, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2026-05-26T16:00:06Z",
    duration: "PT42M57S",
    thumbnailUrl: "https://i.ytimg.com/vi/sZunCpYnv3Y/maxresdefault.jpg",
  },
  x5uS9CPZpyw: {
    description:
      "Yoyaku instore session with Momo Trosman, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2025-07-18T15:01:53Z",
    duration: "PT59M20S",
    thumbnailUrl: "https://i.ytimg.com/vi/x5uS9CPZpyw/maxresdefault.jpg",
  },
  yEV_H4o8TeQ: {
    description:
      "Yoyaku instore session with Jen Cardini, published on the Yoyaku Record Store YouTube channel.",
    uploadDate: "2026-05-21T15:37:47Z",
    duration: "PT1H27M2S",
    thumbnailUrl: "https://i.ytimg.com/vi/yEV_H4o8TeQ/maxresdefault.jpg",
  },
};
