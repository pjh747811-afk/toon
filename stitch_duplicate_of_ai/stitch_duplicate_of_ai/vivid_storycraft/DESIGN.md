---
name: Vivid Storycraft
colors:
  surface: '#f5fafc'
  surface-dim: '#d5dbdd'
  surface-bright: '#f5fafc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4f7'
  surface-container: '#e9eff1'
  surface-container-high: '#e3e9eb'
  surface-container-highest: '#dee3e5'
  on-surface: '#171d1e'
  on-surface-variant: '#3c494c'
  inverse-surface: '#2b3133'
  inverse-on-surface: '#ecf2f4'
  outline: '#6c797c'
  outline-variant: '#bbc9cc'
  surface-tint: '#006875'
  primary: '#006875'
  on-primary: '#ffffff'
  primary-container: '#39d6ed'
  on-primary-container: '#005965'
  inverse-primary: '#3ed9f0'
  secondary: '#36656e'
  on-secondary: '#ffffff'
  secondary-container: '#baebf5'
  on-secondary-container: '#3c6b74'
  tertiary: '#744e92'
  on-tertiary: '#ffffff'
  tertiary-container: '#dfb3ff'
  on-tertiary-container: '#664083'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9defff'
  primary-fixed-dim: '#3ed9f0'
  on-primary-fixed: '#001f24'
  on-primary-fixed-variant: '#004e59'
  secondary-fixed: '#baebf5'
  secondary-fixed-dim: '#9ecfd8'
  on-secondary-fixed: '#001f24'
  on-secondary-fixed-variant: '#1b4d56'
  tertiary-fixed: '#f2daff'
  tertiary-fixed-dim: '#e1b6ff'
  on-tertiary-fixed: '#2c044a'
  on-tertiary-fixed-variant: '#5b3678'
  background: '#f5fafc'
  on-background: '#171d1e'
  surface-variant: '#dee3e5'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style
This design system crafts an emotional bridge between personal diary entries and visual graphic storytelling. It treats everyday moments as narrative art. The atmosphere blends creative studio precision with the playful, expressive warmth of personal social storytelling. 

The aesthetic is grounded in a hybrid of **Atmospheric Glassmorphism** and **Modern Light Studio UI**:
- **Atmospheric Depth:** Clean cyan-tinted light backgrounds punctuated by luminous cyan and energetic accent illumination give the interface a daytime studio ambience where creativity comes alive.
- **Expressive Warmth:** Tactile, luminous surfaces with generous soft corners make users feel like creators rather than prompt engineers.
- **Graphic Polish:** Crisp comic frame motifs, subtle borders with gentle gradients, and vibrant micro-interactions evoke the tactile satisfaction of an ink pad and digital art canvas.

## Colors
The palette leverages high contrast against clean, cyan-tinted light backdrops to ensure illustrations and creative text stand out vividly.

- **Primary (`#02C2D9`) & Secondary (`#4F7E87`):** The creative engine. Used for hero interaction states, creation triggers, active comic panel frames, and luminous gradient accents that signify AI transformation.
- **Tertiary Accent (`#DFB3FF` / `#4f7e87`):** Warm emotional anchors. Reserved for reaction tags, emotional tone toggles, delight badges, and notifications.
- **Canvas & Surfaces:**
  - Base Canvas: `#F4F9FA` (Pure Light Canvas)
  - Surface Default: `#FFFFFF` (Clean White)
  - Surface Raised / Glass: `#E6F2F5` with 70–85% alpha overlays and delicate border tints (`rgba(2, 194, 217, 0.08)`).
- **Text & Content Contrast:**
  - Text Primary: `#1E293B` for high legibility across all panels.
  - Text Secondary: `#64748B` for contextual cues, panel metadata, and timestamps.

## Typography
The typographic architecture pairs structural clarity with approachable warmth. 

- **Display & Headlines (`Plus Jakarta Sans`):** Selected for its geometric structure softened by contemporary rounded subtleties. Gives episode titles, punchlines, and feature headers an editorial, comic-strip charm without feeling cartoonish.
- **Body & Dialogue (`Inter`):** Delivers clean readability inside small speech balloons, diary prompt text areas, and descriptive captions.
- **Line Heights & Rhythm:** Dialogue-heavy bubbles leverage tight, compact tracking (`letter-spacing: -0.01em`) and proportional line heights so multi-line quips maintain comic pacing.

## Layout & Spacing
The layout follows a modular fluid rhythm anchored around standard webtoon and 4-cut formats:

- **Canvas & Gutters:** Mobile operates on a single-column continuous scroll mimicking webtoon mobile readers, using `margin: 1rem` and `gutter: 1.25rem`. Desktop expands to a two-pane studio view: Prompt Composer / Daily Journal on the left, Real-time 4-Cut Preview on the right.
- **Comic Grid Proportions:** 4-cut layouts dynamically adopt a 1:1 square or 4:5 vertical panel aspect ratio. On handheld screens, panels cascade vertically with standard `space-md` gaps. On desktop screens, panels align into a balanced 2x2 grid or a clean vertical story strip.
- **Component Padding Scale:** Small status pills and emotional tags use `space-xs` to `space-sm`. Interactive story panels, input text areas, and floating glass menus deploy `space-md` and `space-lg` to maintain an airy feel.

## Elevation & Depth
Depth relies on layered translucency, subtle edge luminance, and localized neon glow rather than heavy drop shadows:

- **Level 0 (Canvas Base):** Clean light flat surface (`#F4F9FA`) providing absolute optical contrast.
- **Level 1 (Subdued Containers & Inactive Panels):** Solid `#FFFFFF` with a 1px border of `rgba(0, 0, 0, 0.05)`.
- **Level 2 (Cards & Active Workspaces):** Translucent `#E6F2F5` at 80% opacity with `backdrop-filter: blur(16px)` and a subtle light-catching top border `rgba(2, 194, 217, 0.12)`.
- **Level 3 (Floating Bars & Modals):** Translucent `#FFFFFF` at 90% opacity with `backdrop-filter: blur(24px)`, combined with an ambient cyan-tinted shadow (`0 20px 40px -15px rgba(2, 194, 217, 0.15)`).
- **Luminescent Accent Glow:** Key elements such as "Generate Webtoon" triggers and active frame borders cast soft peripheral lighting: `box-shadow: 0 0 24px rgba(2, 194, 217, 0.25)`.

## Shapes
The shape philosophy is organic, soft, and inviting to make creative expression feel approachable:

- **Pill & Floating Controls (`rounded-full`):** Action chips, tag selectors, mood pills, and primary CTAs use fully rounded pill silhouettes for effortless tap targets.
- **Frames & Cards (`rounded-2xl` to `rounded-3xl` / 1.5rem to 2rem):** 4-cut webtoon frames, prompt composition cards, and preview tiles embrace substantial corner smoothing to mimic modern mobile sticker packs and polished digital canvases.
- **Speech Balloons & Callouts:** Built with rounded geometric continuity, featuring tailored corner radiuses that seamlessly taper into dialogue pointers.

## Components

- **4-Cut Webtoon Canvas Frame:**
  - High-precision aspect-ratio containers (1:1 or 4:5) with clean borders (`rgba(2, 194, 217, 0.12)`) and `rounded-2xl` corners.
  - Active/generating states display a shifting gradient rim (`#02C2D9` to `#4F7E87`) with inner shimmer skeletons.
  - Overlaid quick actions (regenerate, edit prompt, swap scene) appear on hover/tap as glassmorphic icon pills.

- **Prompt & Diary Text Input:**
  - Background surface of frosted `#E6F2F5` (60% alpha) with `rounded-2xl` shaping.
  - Focused state transitions the border to glowing cyan (`#02C2D9`) with zero intrusive outlines.
  - Includes integrated micro-toolbars at the bottom for mood chips, character tags, and cut-length selectors.

- **Buttons & Action Triggers:**
  - *Primary (Create / Publish):* Linear gradient from `#02C2D9` to `#4F7E87` with white text, full pill curvature, and a subtle cyan neon bottom-cast shadow. Press state gently scales down to 0.98.
  - *Secondary / Ghost:* Transparent with 1px border `rgba(2, 194, 217, 0.2)`, turning to solid `#E6F2F5` on hover.

- **Mood & Character Chips:**
  - Compact pills with light surface fills (`#E6F2F5` at 70% opacity).
  - Selected state activates full color accents (e.g., `#DFB3FF` for Romance/Daily) with matched tinted text and subtle inner glow.

- **Floating Navigation & Control Bar:**
  - Centered bottom-docked pill with backdrop blur (`blur(20px)`), containing quick navigation icons, draft counts, and the central vibrant "+ Draw" creation button.

- **Dialogue & Caption Bubbles:**
  - Crisp white or cream (`#FFFFFF`) floating overlays directly on the panel illustrations, styled with rounded corners and bold sans dialogue text.