# RTS.FM site audit, 2026-10-22 (after fixes)

Crawled 209 URLs from the live sitemap. All returned 200.

| Check | Result |
|---|---|
| JSON-LD on every page | Pass, 209 of 209, none invalid |
| Exactly one H1 per page | Pass, 209 of 209 |
| Rendered title <= 60 characters | Pass, none over, no duplicates |
| More than 1 inbound link | Pass: every blog, artist and festival page has at least 2 links from non-index pages (links in nav and footer excluded, related-link blocks included) |
| FAQ section with FAQPage JSON-LD | Pass, all 198 content pages |
| Meta description <= 155 | Pass, none over |

Correction to the first run of this audit: it undercounted inbound links because the crawler skipped the related-links blocks. With them counted, only 5 pages had fewer than 2 non-index inbound links before the fixes. Four of them were new or recently updated blog posts.
