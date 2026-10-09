import type { BlogVideoMeta } from "./video-metadata";

// Metadata for RTS.FM's own archive sets embedded in artist bios via
// <YouTubeEmbed videoId="...">. Unlike video-metadata.ts (third-party
// label/artist-channel uploads embedded in blog posts), these are RTS.FM's
// own channel uploads, fetched from the same videos.list API call used to
// scan the channel for artists with a viral (10k+ view) archive set.
export const ARTIST_VIDEO_META: Record<string, BlogVideoMeta> = {
  UxYhwRA2HrE: {
    description: "Motor City Drum Ensemble DJ set recorded live at RTS.FM's St. Petersburg studio, 24.10.2009.",
    uploadDate: "2013-04-06T03:18:52Z",
    duration: "PT1H9M14S",
    thumbnailUrl: "https://i.ytimg.com/vi/UxYhwRA2HrE/maxresdefault.jpg",
  },
  _VYggjoRb4o: {
    description: "Kevin Yost DJ set recorded live at RTS.FM's Moscow studio, 03.05.2009.",
    uploadDate: "2013-04-05T21:10:18Z",
    duration: "PT1H11M47S",
    thumbnailUrl: "https://i.ytimg.com/vi/_VYggjoRb4o/maxresdefault.jpg",
  },
  "4L45jvmvYSQ": {
    description: "Okain DJ set recorded live for RTS.FM Budapest at 360 Bar, Budapest, 24.09.2016.",
    uploadDate: "2016-09-26T10:28:28Z",
    duration: "PT1H14M40S",
    thumbnailUrl: "https://i.ytimg.com/vi/4L45jvmvYSQ/maxresdefault.jpg",
  },
  vHBFYwxsKEc: {
    description: "Shonky DJ set recorded live for RTS.FM, 11.11.2011.",
    uploadDate: "2013-07-30T16:27:54Z",
    duration: "PT1H28M15S",
    thumbnailUrl: "https://i.ytimg.com/vi/vHBFYwxsKEc/hqdefault.jpg",
  },
  S8ZeiKfUj2Y: {
    description: "Shonky DJ set recorded live at RTS.FM's Berlin studio, 08.12.2009.",
    uploadDate: "2013-04-06T06:32:52Z",
    duration: "PT2H46S",
    thumbnailUrl: "https://i.ytimg.com/vi/S8ZeiKfUj2Y/hqdefault.jpg",
  },
  m4FQW9CVqv0: {
    description: "Dirty Doering DJ set, part of a Bar25 showcase recorded live for RTS.FM, 21.10.2010.",
    uploadDate: "2013-07-19T13:59:46Z",
    duration: "PT1H30M23S",
    thumbnailUrl: "https://i.ytimg.com/vi/m4FQW9CVqv0/maxresdefault.jpg",
  },
  fKQnvko_JF0: {
    description: "Kalabrese DJ set recorded live for RTS.FM, 01.12.2010.",
    uploadDate: "2013-07-19T20:23:55Z",
    duration: "PT1H29M16S",
    thumbnailUrl: "https://i.ytimg.com/vi/fKQnvko_JF0/hqdefault.jpg",
  },
  ij_NZzClgHY: {
    description: "Terry Lee Brown Jr DJ set recorded live for RTS.FM, 04.11.2010.",
    uploadDate: "2013-07-19T15:33:09Z",
    duration: "PT1H34M49S",
    thumbnailUrl: "https://i.ytimg.com/vi/ij_NZzClgHY/hqdefault.jpg",
  },
  Y0pXuLSjXY8: {
    description: "Rick Wade DJ set recorded live at RTS.FM's Moscow studio, 12.12.2008.",
    uploadDate: "2013-04-04T23:40:15Z",
    duration: "PT1H23M51S",
    thumbnailUrl: "https://i.ytimg.com/vi/Y0pXuLSjXY8/hqdefault.jpg",
  },
  RsqMVonbVbs: {
    description: "Tom Middleton DJ set recorded live at RTS.FM's St. Petersburg studio, 01.11.2009.",
    uploadDate: "2013-04-06T04:02:08Z",
    duration: "PT1H18M34S",
    thumbnailUrl: "https://i.ytimg.com/vi/RsqMVonbVbs/hqdefault.jpg",
  },
  "ShmIdhv-YFY": {
    description: "Anton Kubikov DJ set recorded live at RTS.FM's Moscow studio, 05.04.2009.",
    uploadDate: "2013-04-05T17:32:37Z",
    duration: "PT1H37M41S",
    thumbnailUrl: "https://i.ytimg.com/vi/ShmIdhv-YFY/hqdefault.jpg",
  },
  DXBQUQTEgWc: {
    description: "Anton Kubikov DJ set recorded live for RTS.FM Budapest, 31.08.2019.",
    uploadDate: "2020-01-11T04:14:44Z",
    duration: "PT1H26M26S",
    thumbnailUrl: "https://i.ytimg.com/vi/DXBQUQTEgWc/maxresdefault.jpg",
  },
  L7HBMMHV11A: {
    description: "Anton Kubikov DJ set, part of a Pro-Tez showcase recorded live for RTS.FM, 27.06.2011.",
    uploadDate: "2013-07-23T04:45:32Z",
    duration: "PT1H29M49S",
    thumbnailUrl: "https://i.ytimg.com/vi/L7HBMMHV11A/hqdefault.jpg",
  },
  arV0ftZXwcY: {
    description: "Anton Kubikov DJ set recorded live at RTS.FM's Moscow studio, 18.01.2009.",
    uploadDate: "2013-04-05T12:51:52Z",
    duration: "PT1H32M29S",
    thumbnailUrl: "https://i.ytimg.com/vi/arV0ftZXwcY/hqdefault.jpg",
  },
  mXGN8OXjuNg: {
    description: "Anton Kubikov DJ set, part of a Pro-Tez showcase recorded live for RTS.FM, 25.07.2011.",
    uploadDate: "2013-07-25T16:05:36Z",
    duration: "PT1H37M30S",
    thumbnailUrl: "https://i.ytimg.com/vi/mXGN8OXjuNg/hqdefault.jpg",
  },
  OUcBI3cLB1U: {
    description: "Anton Kubikov DJ set recorded live at RTS.FM's Moscow studio, 13.09.2009.",
    uploadDate: "2013-04-06T01:20:10Z",
    duration: "PT1H32M35S",
    thumbnailUrl: "https://i.ytimg.com/vi/OUcBI3cLB1U/hqdefault.jpg",
  },
  sJMdOqS3I_Y: {
    description: "Anton Kubikov DJ set, part of a Pro-Tez showcase recorded live for RTS.FM, 03.04.2011.",
    uploadDate: "2013-07-22T19:23:46Z",
    duration: "PT1H29M42S",
    thumbnailUrl: "https://i.ytimg.com/vi/sJMdOqS3I_Y/hqdefault.jpg",
  },
  QShTvaXq15M: {
    description: "Jus-Ed DJ set recorded live at RTS.FM's Moscow studio, 10.04.2009.",
    uploadDate: "2013-04-05T17:31:14Z",
    duration: "PT1H6M53S",
    thumbnailUrl: "https://i.ytimg.com/vi/QShTvaXq15M/hqdefault.jpg",
  },
  a8vM58i91x0: {
    description: "James Dexter DJ set, part of a Bedroom x RTS.FM Budapest showcase at Vinyl & Wood, Budapest, 08.12.2017.",
    uploadDate: "2017-12-13T11:55:22Z",
    duration: "PT1H31M28S",
    thumbnailUrl: "https://i.ytimg.com/vi/a8vM58i91x0/maxresdefault.jpg",
  },
  BZYil1c4Gy0: {
    description: "Marek Hemmann live set recorded at RTS.FM's studio, 05.06.2009.",
    uploadDate: "2013-04-06T08:02:45Z",
    duration: "PT1H7M24S",
    thumbnailUrl: "https://i.ytimg.com/vi/BZYil1c4Gy0/hqdefault.jpg",
  },
  "9oYMVzZodTo": {
    description: "Traumer DJ set recorded live at Lizdas club, Kaunas, for a Déclique x Berg Audio x RTS.FM showcase, 25.01.2018.",
    uploadDate: "2018-02-14T08:41:00Z",
    duration: "PT1H35M8S",
    thumbnailUrl: "https://i.ytimg.com/vi/9oYMVzZodTo/maxresdefault.jpg",
  },
  HaUFAjLoZrA: {
    description: "Lola Palmer DJ set recorded live for RTS.FM, 06.07.2010.",
    uploadDate: "2013-07-17T11:59:43Z",
    duration: "PT1H6M",
    thumbnailUrl: "https://i.ytimg.com/vi/HaUFAjLoZrA/hqdefault.jpg",
  },
  kLqNVde_QHs: {
    description: "Lola Palmer DJ set recorded live for RTS.FM, 19.02.2011.",
    uploadDate: "2013-07-21T17:01:55Z",
    duration: "PT1H3M26S",
    thumbnailUrl: "https://i.ytimg.com/vi/kLqNVde_QHs/hqdefault.jpg",
  },
  cxr9erybqGA: {
    description: "Lola Palmer DJ set recorded live for RTS.FM, 16.12.2010.",
    uploadDate: "2013-07-19T22:34:12Z",
    duration: "PT1H7M39S",
    thumbnailUrl: "https://i.ytimg.com/vi/cxr9erybqGA/hqdefault.jpg",
  },
  jhAhgIs2HuU: {
    description: "Lola Palmer DJ set recorded live for RTS.FM, 05.10.2010.",
    uploadDate: "2013-07-19T11:38:19Z",
    duration: "PT1H1M21S",
    thumbnailUrl: "https://i.ytimg.com/vi/jhAhgIs2HuU/hqdefault.jpg",
  },
  Yl7ll9jdHQo: {
    description: "Lola Palmer DJ set recorded live for RTS.FM, 23.10.2011.",
    uploadDate: "2013-07-30T13:56:03Z",
    duration: "PT1H27M13S",
    thumbnailUrl: "https://i.ytimg.com/vi/Yl7ll9jdHQo/hqdefault.jpg",
  },
  "7xPwNZENXLs": {
    description: "Mollono.Bass DJ set, part of a 3000° showcase recorded live for RTS.FM, 21.11.2010.",
    uploadDate: "2013-07-19T18:38:16Z",
    duration: "PT1H42M33S",
    thumbnailUrl: "https://i.ytimg.com/vi/7xPwNZENXLs/hqdefault.jpg",
  },
  Hy5HlwF4OxI: {
    description: "Mihai Popoviciu DJ set recorded live for RTS.FM Chile.",
    uploadDate: "2016-01-10T15:11:40Z",
    duration: "PT1H2M53S",
    thumbnailUrl: "https://i.ytimg.com/vi/Hy5HlwF4OxI/maxresdefault.jpg",
  },
  "CQjlblcv-18": {
    description: "Fred P DJ set recorded live at RTS.FM's St. Petersburg studio, 09.10.2010.",
    uploadDate: "2013-07-19T12:30:12Z",
    duration: "PT1H7M43S",
    thumbnailUrl: "https://i.ytimg.com/vi/CQjlblcv-18/hqdefault.jpg",
  },
  gGufiyCA44A: {
    description: "Nastia DJ set recorded live for RTS.FM, 23.12.2010.",
    uploadDate: "2013-07-19T23:44:32Z",
    duration: "PT1H14M51S",
    thumbnailUrl: "https://i.ytimg.com/vi/gGufiyCA44A/hqdefault.jpg",
  },
  "JuePD-3Z-sU": {
    description: "Tigerhead vinyl DJ set recorded live for RTS.FM Berlin at Oye Records, Berlin, 13.11.2018.",
    uploadDate: "2018-11-29T16:31:47Z",
    duration: "PT1H6M10S",
    thumbnailUrl: "https://i.ytimg.com/vi/JuePD-3Z-sU/maxresdefault.jpg",
  },
  "RRhO4lajPRE": {
    description: "Chris Stussy DJ set recorded live for RTS.FM Budapest at Vinyl & Wood, Budapest, 19.01.2018.",
    uploadDate: "2018-01-29T12:23:50Z",
    duration: "PT1H22M21S",
    thumbnailUrl: "https://i.ytimg.com/vi/RRhO4lajPRE/maxresdefault.jpg",
  },
  "9tGztDVgCcs": {
    description: "Theo Parrish master class, presented with Red Bull Music Academy and recorded at RTS.FM Moscow, 10.07.2009.",
    uploadDate: "2013-04-05T23:45:31Z",
    duration: "PT2H23M59S",
    thumbnailUrl: "https://i.ytimg.com/vi/9tGztDVgCcs/hqdefault.jpg",
  },
  "-p3GN6OS0go": {
    description: "Daniel Wang DJ set recorded for RTS.FM, 03.06.2011.",
    uploadDate: "2013-07-23T01:50:26Z",
    duration: "PT1H14M39S",
    thumbnailUrl: "https://i.ytimg.com/vi/-p3GN6OS0go/hqdefault.jpg",
  },
  "ltDQBYOCeqs": {
    description: "Move D DJ set recorded for RTS.FM, 07.11.2010.",
    uploadDate: "2013-07-19T16:18:53Z",
    duration: "PT2H8M9S",
    thumbnailUrl: "https://i.ytimg.com/vi/ltDQBYOCeqs/hqdefault.jpg",
  },
  "Exukg3a1MkI": {
    description: "Move D DJ set recorded live at RTS.FM's St. Petersburg studio, 06.02.2010.",
    uploadDate: "2013-07-11T08:47:35Z",
    duration: "PT1H16M40S",
    thumbnailUrl: "https://i.ytimg.com/vi/Exukg3a1MkI/hqdefault.jpg",
  },
  "fl6VuCNtO9M": {
    description: "Daniel Bell DJ set recorded live at RTS.FM's Berlin studio, 14.01.2010.",
    uploadDate: "2013-07-10T17:02:06Z",
    duration: "PT1H8M",
    thumbnailUrl: "https://i.ytimg.com/vi/fl6VuCNtO9M/hqdefault.jpg",
  },
  "4VthSs_Ci8g": {
    description: "Vince Watson live set recorded at RTS.FM's Moscow studio, 06.11.2008.",
    uploadDate: "2013-04-04T22:08:47Z",
    duration: "PT1H26S",
    thumbnailUrl: "https://i.ytimg.com/vi/4VthSs_Ci8g/hqdefault.jpg",
  },
  "WTQ2WT49PYg": {
    description: "Andrey Pushkarev DJ set recorded live for RTS.FM Budapest at Aktrecords, Budapest, 23.12.2014.",
    uploadDate: "2016-12-06T22:13:37Z",
    duration: "PT1H10M32S",
    thumbnailUrl: "https://i.ytimg.com/vi/WTQ2WT49PYg/maxresdefault.jpg",
  },
  "KaX8kVsOTlM": {
    description: "Andrey Pushkarev DJ set at the opening of RTS.FM's Bucharest studio, 24.09.2014.",
    uploadDate: "2016-01-10T16:49:31Z",
    duration: "PT1H9M8S",
    thumbnailUrl: "https://i.ytimg.com/vi/KaX8kVsOTlM/maxresdefault.jpg",
  },
};
