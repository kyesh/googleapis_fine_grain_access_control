# Brand Overhaul V2 Implementation Plan

## Goal
Overhaul the brand again by introducing a new logo (clean up the provided image by removing the checkerboard background) and updating the entire site's color scheme to match a new 4-color palette.

## Proposed Changes

### Image Processing
- Create a Python script using `Pillow` to process the provided logo (`media__1773732581252.jpg`). The script will intelligently find the grey and white checkerboard pixels and convert them to transparency, then crop the image to the logo's bounding box.
- Output the cleaned image to `public/logo-v2.png`.
- Generate a multi-resolution `src/app/favicon.ico` from the cleaned logo, replacing the old lock icon.

### CSS/Theme Updates
#### [MODIFY] [globals.css](file:///Users/kennethyesh/GitRepos/googleapis_fine_grain_access_control/src/app/globals.css)
- Replace former brand colors (`--color-brand-blue`, `--color-brand-orange`) with the new palette:
  - Deep Purple: `#4B2C7F`
  - Gold: `#D4AF37`
  - Teal: `#2D9B9B`
  - Glow: `#A0FFFF`

### Component & Page Refactoring
#### [MODIFY] [layout.tsx](file:///Users/kennethyesh/GitRepos/googleapis_fine_grain_access_control/src/app/layout.tsx)
- Add the new `logo-v2.png` to the navigation bar.
- Format the navigation text as requested: "FGAC.ai" in large Deep Purple font, with "Fine Grain Access Control" in Teal underneath. Ensure "Fine Grain Access Control" is consistently spelled without hyphens throughout the site.

#### [MODIFY] [page.tsx](file:///Users/kennethyesh/GitRepos/googleapis_fine_grain_access_control/src/app/page.tsx)
- Update the hero gradient text to flow from Deep Purple to Glow/Teal.
- Update primary action buttons to use Deep Purple or Teal as primary and secondary colors.

#### [MODIFY] [dashboard/page.tsx](file:///Users/kennethyesh/GitRepos/googleapis_fine_grain_access_control/src/app/dashboard/page.tsx)
- Restyle the dashboard to use Deep Purple and Teal for tags, lines, and highlighting.

## Verification Plan
### Automated Tests
- Run `npm run build` locally to ensure the Next.js production build succeeds with the new asset paths.

### Manual Verification
- We will push the branch and wait for the Vercel PR preview.
- Use the **Browser Subagent** to navigate to the preview URL.
- The subagent will verify that:
  - The checkerboard background has been successfully removed from the logo.
  - The logo is placed correctly next to the formatted text in the navigation bar.
  - The hero gradient text and buttons are utilizing the new Deep Purple and Teal colors.
  - Take a screenshot of the final UI for your review.
