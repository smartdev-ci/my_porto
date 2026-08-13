---
name: Fluent Developer OS
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#404752'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#717783'
  outline-variant: '#c0c7d4'
  surface-tint: '#0060ab'
  primary: '#005faa'
  on-primary: '#ffffff'
  primary-container: '#0078d4'
  on-primary-container: '#ffffff'
  inverse-primary: '#a3c9ff'
  secondary: '#00658d'
  on-secondary: '#ffffff'
  secondary-container: '#4bc1fe'
  on-secondary-container: '#004d6c'
  tertiary: '#974700'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc5b00'
  on-tertiary-container: '#ffffff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d3e3ff'
  primary-fixed-dim: '#a3c9ff'
  on-primary-fixed: '#001c39'
  on-primary-fixed-variant: '#004883'
  secondary-fixed: '#c6e7ff'
  secondary-fixed-dim: '#81cfff'
  on-secondary-fixed: '#001e2d'
  on-secondary-fixed-variant: '#004c6b'
  tertiary-fixed: '#ffdbc8'
  tertiary-fixed-dim: '#ffb689'
  on-tertiary-fixed: '#311300'
  on-tertiary-fixed-variant: '#743500'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
  terminal-green: '#4E9A06'
  surface-light: '#FFFFFF'
  surface-dark: '#1E1E1E'
  bg-dark: '#121212'
  text-primary-light: '#1A1A1A'
  text-primary-dark: '#E0E0E0'
  accent-blue-gradient: 'linear-gradient(135deg, #0078D4 0%, #50B0E8 100%)'
typography:
  window-title:
    fontFamily: manrope
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  metadata:
    fontFamily: inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.02em
  clock:
    fontFamily: inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  icon-label:
    fontFamily: inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  desktop-margin: 24px
  window-padding: 24px
  gutter: 16px
  taskbar-height: 50px
  icon-grid: 80px
---

## Brand & Style

This design system draws inspiration from the Windows 11 "Fluent" design language, translated into a high-fidelity developer portfolio experience. The design narrative centers on the "Desktop as Portfolio" metaphor, evoking a sense of technical mastery and professional organization.

The style is **Glassmorphism-heavy**, prioritizing depth, material translucency (Mica and Acrylic effects), and soft environmental lighting. It aims to make recruiters feel as though they are interacting with a high-end, functional operating system rather than a static webpage. The aesthetic balance combines the structured reliability of an enterprise OS with the creative flair of a modern developer environment.

## Colors

The palette is optimized for a dual-mode experience. 

- **Light Mode** utilizes the iconic Windows Blue as the primary driver, set against high-translucency white surfaces. The background uses the signature blue-to-light-blue gradient to ground the desktop icons.
- **Dark Mode** shifts to a deep charcoal aesthetic. The primary accent becomes a more luminous sky blue (#4CC2FF) to maintain contrast against dark acrylic surfaces.
- **Functional Accents**: A specific Terminal Green is reserved for code blocks, status indicators, and technical "success" states, paying homage to the developer's native environment.

Surface colors should never be fully opaque when used in "Window" components; they should always utilize a 70-85% alpha channel to allow background gradients to bleed through subtly.

## Typography

The typography system is clean and highly legible, using **Manrope** for structural headings (Window titles, section headers) to provide a slightly more modern, geometric feel than standard system fonts. **Inter** handles all functional and body text due to its exceptional clarity at small scales.

- **Scale Management**: Font sizes are kept tight (12px to 18px) to mimic the information density of a desktop OS. 
- **Hierarchy**: Emphasize hierarchy through weight rather than massive size jumps. A semi-bold weight for titles is sufficient to distinguish windows from content.
- **Developer Context**: Monospaced elements (code snippets, terminal inputs) should use a fallback system mono font or a dedicated monospaced variant to reinforce the tech-forward narrative.

## Layout & Spacing

The layout follows a **Windowed Fluid** model. The background "Desktop" is the root container, with various "Windows" acting as floating, draggable-style containers.

- **The Taskbar**: A fixed 50px element at the bottom of the viewport. It features centered application icons and a right-aligned system tray for the clock and toggles.
- **The Icon Grid**: Desktop icons should be aligned to a strict 80x80px invisible grid on the left side of the screen.
- **Responsive Behavior**: 
  - **Desktop**: Windows have fixed widths/heights (or max-widths) and appear stacked or tiled.
  - **Mobile**: Windows reflow into a standard full-screen vertical stack. The taskbar transforms into a bottom navigation bar.

## Elevation & Depth

Depth is the primary driver of hierarchy in this design system. It is achieved through a combination of backdrop blurs and multi-layered shadows:

- **Level 1 (Surface)**: Desktop icons and taskbar. Low elevation, subtle 2px blur shadow to lift them slightly off the wallpaper.
- **Level 2 (Standard Window)**: Passive windows. 12px blur, 10% opacity black shadow. Significant backdrop-filter (20px blur) to create the "Mica" effect.
- **Level 3 (Active Window)**: The focused window. Increased shadow spread (24px) and a subtle 1px inner border (white at 20% opacity) to catch "light" on the edges.

Avoid using solid borders; instead, use high-contrast tonal shifts or subtle semi-transparent strokes to define edges.

## Shapes

The shape language is sophisticated and consistent. Windows use a **12px radius** to feel soft but professional. Smaller interactive elements like buttons and input fields use an **8px radius**.

The "Pill" shape (20px+) is reserved exclusively for high-priority status indicators, skill badges, and the Start Menu search bar, providing a visual break from the predominantly rectangular window structures.

## Components

### Windows & Modals
- **Header**: Includes a window title (left-aligned) and standard window controls (minimize, maximize, close) on the right.
- **Content Area**: 24px internal padding. Uses a slightly less transparent background than the header to improve text readability.

### Desktop Icons
- **Size**: 48x48px container for the icon.
- **Label**: 12px Inter text, centered below the icon. In light mode, uses a subtle drop shadow on the text to ensure legibility against various wallpaper colors.

### Buttons
- **Primary**: Accent blue background, white text, 8px corners. On hover, a subtle brightness increase (+10%).
- **Secondary/Ghost**: Transparent with a 1px border or a slight grey hover fill.

### The Start Menu
- A floating panel that slides up from the taskbar. It should be divided into "Pinned" apps (projects) and "Recommended" items (recent blog posts or resume downloads).

### Skill Badges
- Small pill-shaped containers with a low-opacity version of the accent color and 12px metadata-style text.

### Form Fields
- 8px rounded corners, subtle grey fill (#F3F3F3 in light, #2A2A2A in dark), with a 2px bottom border that animates to the primary accent color on focus.