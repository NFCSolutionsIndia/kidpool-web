# KidPool — Compliance Checkpoints

As of November 13, 2026

Each checkpoint below has a pass condition, a way to verify it, and who signs it off. A step is complete only when every checkpoint in it passes. Mark the status column `Not started`, `In progress`, `Passed` or `Blocked`.

Owners: **Team** (business decision or fact about the live app), **Dev** (website code), **Lawyer** (legal review).

This is practical guidance, not legal advice. A US lawyer should review the final Privacy Policy and Terms.

## Step 1: Legal identity

| # | Checkpoint (passes when…) | How to verify | Sign-off | Status |
|---|---|---|---|---|
| 1.1 | The registered company's exact legal name and type are confirmed in writing | Matches the Georgia Secretary of State business record | Team | Not started |
| 1.2 | Privacy Policy and Terms name that company, not just "KidPool" | Open `/privacy` and `/terms`; the first paragraph of each shows the legal name (`Legal.jsx` lines 21 and 112) | Dev | Not started |
| 1.3 | The effective date equals the real go-live date | The date at the top of both pages matches the launch date (`Legal.jsx` line 7) | Dev | Not started |
| 1.4 | Governing law (Georgia) is confirmed | Lawyer's written OK; Terms clause matches (`Legal.jsx` line 187) | Lawyer | Not started |

## Step 2: Safety claims match the live app

| # | Checkpoint (passes when…) | How to verify | Sign-off | Status |
|---|---|---|---|---|
| 2.1 | Driver ID wording matches reality: "required and checked" only if it is, otherwise "Drivers can add a photo ID" | Test the app as a new driver; compare with the Safety section (`Safety.jsx` line 26) | Team + Dev | Not started |
| 2.2 | SOS wording says exactly what SOS does, plus "In an emergency, always call 911" | Press SOS in a test ride; compare the result with the Safety section and app carousel text (`Safety.jsx` line 24, `AppDownload.jsx` line 45) | Team + Dev | Not started |
| 2.3 | "Private phone numbers" and "You choose who can call" appear only if masked calling is live | Make a test in-app call; the other phone must not show the real number | Team | Not started |
| 2.4 | "Live ride tracking" and "QR check-in" appear only if both are live | Run a test ride with tracking and QR check-in | Team | Not started |
| 2.5 | Every "verified" badge or tag has a defined, real check behind it, or is removed | Written definition of "verified"; hero tag and screenshots match it | Team + Dev | Not started |
| 2.6 | The "Safe" label in the tracking screenshot is removed or means something specific | Check the app-screen image on the website | Dev | Not started |
| 2.7 | No page or ad claims more safety than the app delivers | Read the full site top to bottom against the app feature list | Team | Not started |

## Step 3: Children's privacy (COPPA)

| # | Checkpoint (passes when…) | How to verify | Sign-off | Status |
|---|---|---|---|---|
| 3.1 | Children cannot sign up, log in or send messages | Try to create an account as a child; the app must not allow it | Team | Not started |
| 3.2 | Only a parent or guardian can add a child's details | Test with a parent account; no other path adds child data | Team | Not started |
| 3.3 | Parents can view, edit and delete their child's data in the app | Add, edit and delete a test child; confirm the data is gone from the backend | Team | Not started |
| 3.4 | Children's data is never sent to ad or analytics tools | Review analytics and ad SDK settings; no child fields are shared | Team + Dev | Not started |
| 3.5 | The Privacy Policy states the real location-data retention period | The number in the policy matches the backend deletion setting | Team + Dev | Not started |
| 3.6 | The FAQ answers "Do kids have accounts?" | Open the FAQ on the home page | Dev | Passed (Nov 13, 2026) |

## Step 4: US state privacy laws (before any marketing tags)

| # | Checkpoint (passes when…) | How to verify | Sign-off | Status |
|---|---|---|---|---|
| 4.1 | No analytics or ad tag loads before the consent tool is live | Browser network tab on a fresh visit shows no Google or Meta requests | Dev | Passed (Nov 13, 2026) |
| 4.2 | A consent tool supporting the Global Privacy Control signal is live | Visit with GPC turned on; marketing tags stay off | Dev | Not started |
| 4.3 | "Your Privacy Choices" link is in the footer and works | Click it from every page | Dev | Not started |
| 4.4 | The Privacy Policy names each analytics and ad tool and explains opting out | Read the policy's sharing section | Lawyer | Not started |
| 4.5 | No ad audience targets children or uses children's data | Review targeting settings in Google Ads and Meta Ads Manager | Team | Not started |

## Step 5: Accessibility (ADA / WCAG 2.1 AA)

| # | Checkpoint (passes when…) | How to verify | Sign-off | Status |
|---|---|---|---|---|
| 5.1 | The app carousel has a visible pause button | Pause it with mouse and keyboard; it stays paused | Dev | Passed (Nov 13, 2026) |
| 5.2 | The hero 3D animation has a pause control | Pause it; the scene stops moving | Dev | Passed (Nov 13, 2026) |
| 5.3 | One "Pause animation" control stops all looping effects site-wide (beside the hero illustration) | Turn it on; nothing on the page keeps moving | Dev | Passed (Nov 13, 2026) |
| 5.4 | Each 3D scene has a text description for screen readers | Test with NVDA (Windows) or VoiceOver (Mac/iPhone) | Dev | Passed (Nov 13, 2026) |
| 5.5 | All text meets 4.5:1 contrast (3:1 for large text) | Run axe DevTools or WAVE; zero contrast errors (axe 4.10: 0 WCAG A/AA violations on /, /privacy, /terms, /accessibility) | Dev | Passed (Nov 13, 2026) |
| 5.6 | Every feature works with the keyboard alone, with a visible focus outline | Tab through the whole page without a mouse | Dev | Passed (Nov 13, 2026) |
| 5.7 | An accessibility statement page exists at `/accessibility` with a contact email | Open the page; footer link works | Dev | Not started (page removed on request, Nov 13, 2026) |

## Step 6: US English

| # | Checkpoint (passes when…) | How to verify | Sign-off | Status |
|---|---|---|---|---|
| 6.1 | No British spellings remain on the site or legal pages | Search the code for licence, tyre, neighbourhood, behavioural, colour; zero matches in visible text | Dev | Passed (Nov 13, 2026) |

## Step 7: Before launch

| # | Checkpoint (passes when…) | How to verify | Sign-off | Status |
|---|---|---|---|---|
| 7.1 | The lawyer has approved the final Privacy Policy and Terms | Written approval on file, dated after Steps 1 to 3 passed | Lawyer | Not started |
| 7.2 | A USPTO trademark search for "KidPool" is done, with no blocking conflict | Search report on file; lawyer's view on any conflicts | Team + Lawyer | Not started |
| 7.3 | App Store and Google Play privacy labels match the Privacy Policy | Compare each label item with the policy | Team | Not started |
| 7.4 | Every marketing email has an unsubscribe link and the postal address | Send a test email; check the footer | Team | Not started |
| 7.5 | Marketing texts are sent only with written consent, and "STOP" works | Test the sign-up form and reply STOP from a test phone | Team | Not started |

## Launch gates

**Before public launch, these must all pass:** Steps 1, 2, 3 and 6, plus checkpoints 4.1, 7.1, 7.2 and 7.3.

**Before running any paid ads or adding analytics:** all of Step 4 must pass.

**Within the first month after launch:** all of Step 5. Treat it as urgent; accessibility lawsuits are common in the US.
