# 🎨 UI/UX Design Guidelines - LearnForge AI

## 📋 Document Overview

This document specifies the design system for LearnForge AI, ensuring a consistent, accessible, and premium user experience across the platform.

---

## 💎 Design Philosophy

**"Cognitive Clarity"**

Our design minimizes cognitive load to maximize learning retention. Every element serves a purpose; distractions are eliminated. The aesthetic is "Academic Modern"—clean, structured, yet warm and inviting.

---

## 🎨 Color Palette

### Primary (Brand)
| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Forge Indigo** | `#4F46E5` | Primary buttons, active states, key highlights. |
| **Deep Space** | `#312E81` | Headers, dark mode backgrounds, strong emphasis. |
| **Electric Violet**| `#818CF8` | Accents, focus rings, secondary interactions. |

### Semantic
| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Success** | `#10B981` | Progress completion, correct answers, positive feedback. |
| **Error** | `#EF4444` | Validation errors, destructive actions, incorrect answers. |
| **Warning** | `#F59E0B` | System alerts, caution notices. |
| **Info** | `#3B82F6` | Informational toasts, tips. |

### Variable Neutrals (Slate)
- **Background**: `#F8FAFC` (Light) / `#0F172A` (Dark)
- **Surface**: `#FFFFFF` (Light) / `#1E293B` (Dark)
- **Border**: `#E2E8F0` (Light) / `#334155` (Dark)
- **Text Primary**: `#0F172A` (Light) / `#F8FAFC` (Dark)
- **Text Secondary**: `#64748B` (Light) / `#94A3B8` (Dark)

---

## ✍️ Typography

**Font Family**: `Inter` (Sans-serif) via `next/font`.
*Alternative for Headings*: `Outfit` or `Plus Jakarta Sans` for a more distinct brand character.

### Scale
- **Display**: 48px / 700 / Tight Tracking (Landing page heroes)
- **H1**: 36px / 700 (Page titles)
- **H2**: 30px / 600 (Section headers)
- **H3**: 24px / 600 (Card titles)
- **Body Large**: 18px / 400 (Blog reading, long-form content)
- **Body Default**: 16px / 400 (Standard UI text)
- **Small**: 14px / 500 (Metadata, labels)
- **Tiny**: 12px / 500 (Captions, footnotes)

---

## 🧩 Component System (Atomic Design)

### 1. Buttons
- **Primary**: Solid Indigo background, white text. Rounded-lg.
- **Secondary**: White background, Indigo border, Indigo text.
- **Ghost**: Transparent background, slate text, hover effect.
- **Icon Button**: Circular, ghost style.

### 2. Cards
- **Course Card**:
  - Image aspect ratio: 16:9
  - Content: Title, Instructor Avatar + Name, Rating Star, Price/Enrolled Badges.
  - Interaction: Slight lift + shadow expansion on hover.
- **Lesson Card**:
  - Left: Status icon (Check/Lock/Play).
  - Center: Lesson Title + Duration.
  - Right: Action button.

### 3. Navigation
- **Sidebar (Dashboard)**: Collapsible, icon + label. Active state has distinct background tint.
- **Top Bar**: Global search, Notifications bell, User Avatar dropdown.

### 4. Inputs
- **Text Field**: Floating label or top label. Clear focus ring (Indigo-500). Validation message below.
- **Select**: Custom dropdown with search integration (Shadcn/Command).

---

## 💫 Micro-Interactions & Animation

### Motion Principles
- **Duration**: Fast (150ms-300ms).
- **Easing**: `ease-out` for entering, `ease-in` for exiting.
- **Purpose**: Guide the eye, confirm actions, smoothing state changes.

### Examples
- **Page Transitions**: Subtle fade-in + slide-up (10px).
- **Button Click**: Scale down (0.98) on active press.
- **List Items**: Staggered fade-in when loading lists of courses.
- **Skeleton Loading**: Shimmer effect matches the background/surface contrast.

---

## 📱 Responsiveness

### Breakpoints (Tailwind Default)
- **sm**: 640px (Mobile Landscape)
- **md**: 768px (Tablets)
- **lg**: 1024px (Laptops)
- **xl**: 1280px (Desktops)

### Strategy
- **Mobile First**: Design for small screens, then expand.
- **Touch Targets**: Minimum 44px for all interactive elements on mobile.
- **Navigation**: Sidebar becomes bottom tab bar (mobile app feel) or hamburger menu on small screens.

---

## ♿ Accessibility (A11y)

1. **Contrast**: All text must meet WCAG AA (4.5:1 ratio).
2. **Keyboard Nav**: All interactive elements must be focusable and identifiable (`outline-offset`).
3. **Screen Readers**: `aria-labels` on icon-only buttons. `alt` text on courses images.
4. **Reduced Motion**: Respect system preference for `prefers-reduced-motion`.

---

**Document Version**: 1.0  
**Last Updated**: January 8, 2026  
**Status**: Draft
