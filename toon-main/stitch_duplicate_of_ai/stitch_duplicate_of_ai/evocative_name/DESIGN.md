---
name: Evocative Name
colors:
  surface: '#e4feff'
  surface-dim: '#81eaee'
  surface-bright: '#e4feff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#c9fdff'
  surface-container: '#a9fcff'
  surface-container-high: '#90f9fd'
  surface-container-highest: '#8af3f7'
  on-surface: '#002021'
  on-surface-variant: '#544434'
  inverse-surface: '#003738'
  inverse-on-surface: '#bafdff'
  outline: '#877461'
  outline-variant: '#dac2ad'
  surface-tint: '#895100'
  primary: '#895100'
  on-primary: '#ffffff'
  primary-container: '#fa9800'
  on-primary-container: '#623900'
  inverse-primary: '#ffb86c'
  secondary: '#146d1a'
  on-secondary: '#ffffff'
  secondary-container: '#9ff893'
  on-secondary-container: '#1c7420'
  tertiary: '#626200'
  on-tertiary: '#ffffff'
  tertiary-container: '#b6b500'
  on-tertiary-container: '#454500'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcbc'
  primary-fixed-dim: '#ffb86c'
  on-primary-fixed: '#2c1700'
  on-primary-fixed-variant: '#683c00'
  secondary-fixed: '#9ff893'
  secondary-fixed-dim: '#83db79'
  on-secondary-fixed: '#002202'
  on-secondary-fixed-variant: '#00530c'
  tertiary-fixed: '#ebea16'
  tertiary-fixed-dim: '#cecd00'
  on-tertiary-fixed: '#1d1d00'
  on-tertiary-fixed-variant: '#4a4900'
  background: '#e4feff'
  on-background: '#002021'
  surface-variant: '#8af3f7'
typography:
  headline-xl:
    fontFamily: Quicksand
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Quicksand
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Quicksand
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Quicksand
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Quicksand
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Comfortaa
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Comfortaa
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Quicksand
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
  label-md:
    fontFamily: Quicksand
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Quicksand
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
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

This design system embraces a vibrant, energetic, and expressive cartoon diary aesthetic. Drawing inspiration from high-saturation stationery, pop art stickers, and dynamic journaling apps, it evokes feelings of excitement, creativity, playfulness, and bold emotional expression. 

The visual style blends vivid tactile surfaces with clean modern UI discipline. Instead of stark corporate boundaries, elements feel punchy, playful, and softly modular—reminiscent of bold washi tape, vibrant sticky notes, and fluorescent highlighters. The interface welcomes everyday reflection, energetic personal logging, creative capture, and joyful routine management.

## Colors

The palette takes direct cues from vibrant pop culture spectrums and high-energy stationery markers:
- **Primary (`#FA9800` - Vibrant Tangerine)**: The grounding anchor for key actions, brand marks, and prominent navigation headers.
- **Secondary (`#60B559` - Energetic Leaf Green)**: Highlights interactive accents, secondary callouts, badges, and positive affirmations.
- **Tertiary (`#E6E50A` - Electric Yellow)**: Used for notifications, alert ribbons, tag highlights, and cheerful prompts.
- **Accents**: Form a rich suite of diary stickers, categorization labels, mood trackers, and decorative highlight washes.
- **Neutrals & Surfaces**: A vibrant aqua-tinted canvas prevents stark sterile white, while typography uses high-contrast dark tones to preserve readability and punchy storybook pop.

## Typography

The type system pairs **Quicksand** for headlines and interactive labels with **Comfortaa** for body text and intimate diary passages. Both typefaces share rounded geometry, curved terminals, and open counters that reinforce the friendly, cartoon diary tone.

Key titles maintain generous line heights to preserve breathing room, while body copy prioritizes easy legibility with comfortable character tracking.

## Layout & Spacing

A fluid grid architecture structures screens across mobile, tablet, and desktop views:
- **Mobile (< 768px)**: 4-column layout with 16px (`1rem`) gutters and outer margin.
- **Tablet (768px – 1024px)**: 8-column layout with 24px (`1.5rem`) margins.
- **Desktop (> 1024px)**: 12-column layout with centered maximum content bounds (1120px) to maintain personal diary intimacy without awkward horizontal stretch.

Spacing focuses on buoyant padding within cards and interactive capsules, making containers look soft and pillowy rather than crowded.

## Elevation & Depth

Visual hierarchy avoids stark drop shadows and sharp borders. Instead, depth is constructed using:
- **Tinted Ambient Glows**: Low-opacity shadows tinted with vibrant orange or green tones.
- **Soft Outlines**: Micro-borders (1.5px to 2px) in slightly deepened vibrant shades that define components like die-cut stickers.
- **Stacked Washi Tiers**: Surface containers overlap with subtle offset rotations (-1° to 1°) and colored background ribbons to create a playful stationery notebook collage.

## Shapes

Every element utilizes pill-shaped or hyper-rounded geometry (`roundedness: 3`). Buttons, badge chips, and tags feature full pill radiuses (`9999px`), while surface containers and diary cards adopt `1.5rem` to `2rem` rounded corners. Sharp right angles are strictly eliminated to preserve a friendly, soft-touch aesthetic.

## Components

- **Buttons**: Pill-shaped with a tactile 2px bottom offset shade or warm tinted shadow. Primary buttons use vibrant tangerine (`#FA9800`) with white or dark text; secondary buttons feature energetic green (`#60B559`); ghost buttons feature a dashed vibrant border.
- **Cards & Diary Entries**: Enclosed in smooth `2rem` rounded white containers with subtle rim borders. Entry headers can feature a top "washi tape" decorative bar colored in electric yellow (`#E6E50A`) or vibrant green.
- **Chips & Tags**: Miniature pill capsules filled with vibrant accents paired with high-contrast text, resembling colorful planner stickers.
- **Input Fields**: Soft rounded inputs with thick 1.5px borders, warm tinted focus rings, and friendly placeholder typography.
- **Checkboxes & Radios**: Plump rounded check boxes with rounded checkmark strokes and soft jelly-bean fill transitions when toggled.
- **Sticker Badges & Mood Icons**: Circular or scalloped vibrant tokens with gentle hover lifts and springy micro-interactions for rating daily mood and milestones.