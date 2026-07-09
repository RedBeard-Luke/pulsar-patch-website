# Pulsar Patch — Design System & Style Guide

> **Purpose**: This is the single source of truth for every visual and structural decision made on the Pulsar website. Reference this document before building any new page or component to ensure brand consistency.

---

## Table of Contents

1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Spacing & Layout](#spacing--layout)
4. [Buttons](#buttons)
5. [Wave Dividers](#wave-dividers)
6. [Section Architecture](#section-architecture)
7. [Page Templates](#page-templates)
8. [Component Library](#component-library)
9. [Z-Index Strategy](#z-index-strategy)
10. [Image Placeholders](#image-placeholders)
11. [Animations & Transitions](#animations--transitions)
12. [Assets & SVGs](#assets--svgs)
13. [Tailwind Config Reference](#tailwind-config-reference)
14. [Copy Rules](#copy-rules)
15. [Site Map](#site-map)

---

## Color Palette

| Token                  | Hex         | Tailwind Class           | Usage                                   |
|------------------------|-------------|--------------------------|------------------------------------------|
| **Pulsar Pink**        | `#DE64A5`   | `text-pulsar-pink` / `bg-pulsar-pink` | Primary CTA, headings with pink highlight boxes, review author names, policy page heroes |
| **Pulsar Pink Light**  | `#E268A5`   | `bg-pulsar-pink-light`   | Hero headline highlight boxes only       |
| **Pulsar Pink Dark**   | `#c9548f`   | `bg-pulsar-pink-dark`    | Hover states on pink buttons             |
| **Pulsar Blue**        | `#44C8E8`   | `text-pulsar-blue` / `bg-pulsar-blue` | Secondary brand, blue zones, product cards, footer bg, review stars, section headers on white bg, contact/blog heroes, wholesale hero |
| **Pulsar Blue Dark**   | `#35b3d1`   | `bg-pulsar-blue-dark`    | Hover states on blue buttons             |
| **Dark**               | `#1E1E1E`   | `text-pulsar-dark`       | Body text dark, default dark background  |
| **White**              | `#FFFFFF`   | `text-white` / `bg-white`| Section backgrounds, button text         |
| **Light Blue BG**      | `#E8F7FB`   | `bg-pulsar-light-blue-bg`| Alternate section backgrounds, FAQ sections, account cards |
| **Light Blue**         | `#D4F1F9`   | N/A                      | Decorative accents, form underlines      |
| **Recipe Gold**        | `#FFA700`   | `bg-[#FFA700]`           | Recipe category tags on blog             |
| **Grey Placeholder**   | `#555555`   | `bg-[#555555]`           | Image placeholder boxes                  |
| **Product Grey**       | `#757575`   | `bg-[#757575]`           | Product image placeholders, blog card images |
| **Light Grey Placeholder** | `#8e8e8e` | `bg-[#8e8e8e]`        | Left side image placeholder (Cocktails)  |
| **Dark Grey Placeholder**  | `#363636` | `bg-[#363636]`         | Right side image placeholder (Benefits)  |
| **Input Blue Tint**    | `rgba(68,200,232,0.05)` | inline style    | Contact form input backgrounds (5% opacity) |

---

## Typography

### Font Families

| Font       | Tailwind Class | Usage                                     |
|------------|----------------|-------------------------------------------|
| **Futura PT** | `font-futura`  | Headlines, buttons, section titles, labels, nav links |
| **Inter**     | `font-inter`   | Body copy, review text, descriptions, legal text, form labels |

### Font Scale

> [!IMPORTANT]
> All headlines use `font-futura font-bold`. All body/descriptive text uses `font-inter`.
> Headlines are **always uppercase** via `uppercase` class.
> Never use em dashes (—) in any user-visible copy.

| Element                        | Font    | Weight        | Size     | Leading   | Extra Classes                              |
|-------------------------------|---------|---------------|----------|-----------|---------------------------------------------|
| **Hero H1**                   | Futura  | `font-bold`   | `54px`   | `1.1`     | `uppercase tracking-wide`                   |
| **Hero subtitle**             | Inter   | `font-[500]`  | `18px`   | `1.6`     | `text-white/80`                             |
| **Section Title (large)**     | Futura  | `font-bold`   | `48px`   | `1.1`     | `uppercase tracking-wide`                   |
| **Section Title (medium)**    | Futura  | `font-bold`   | `42px`   | `none`    | `uppercase tracking-wide`, used with highlight boxes |
| **Section Title (small)**     | Futura  | `font-bold`   | `36px`   | `none`    | `uppercase tracking-wide`                   |
| **Section Subtitle / H2**     | Futura  | `font-bold`   | `28px`   | `1.2`     | `uppercase tracking-wide`                   |
| **Policy/FAQ Section Header** | Futura  | `font-bold`   | `24px`   | N/A       | `text-pulsar-blue uppercase tracking-wide`  |
| **Body intro (Futura)**       | Futura  | `font-[700]`  | `18px`   | `1.5`     | `text-pulsar-blue`                          |
| **Benefit/icon title**        | Futura  | `font-bold`   | `18px`–`22px` | N/A  | `text-white uppercase` or `text-pulsar-blue` |
| **Body copy**                 | Inter   | `font-[400]`–`font-[500]` | `14px`–`15px` | `1.6`–`1.8` | Standard paragraph text |
| **Review text**               | Inter   | `font-semibold`| `16px`  | `1.6`     | `text-gray-800`                             |
| **Review author**             | Futura  | `font-bold`   | `16px`   | N/A       | `text-pulsar-pink uppercase tracking-widest` |
| **Product card tagline**      | Futura  | `font-[800]`  | `18px`   | `1.2`     | `uppercase`                                 |
| **Marquee text**              | Futura  | `font-bold`   | `18px`   | N/A       | `uppercase tracking-[2px]`                  |
| **Nav links**                 | Futura  | `font-bold`   | `13px`   | N/A       | `uppercase tracking-wider`                  |
| **Footer disclaimer**         | Inter   | regular       | `10px`   | `1.5`     | `text-white/60`                             |
| **Blog tag**                  | Futura  | `font-bold`   | `10px`–`11px` | N/A  | `uppercase tracking-widest`, pill bg        |
| **Search result title**       | Futura  | `font-bold`   | `20px`   | `1.1`     | `text-pulsar-pink uppercase`                |
| **Form label**                | Inter   | `font-[600]`  | `13px`   | N/A       | `text-pulsar-dark`                          |
| **FAQ question**              | Inter   | `font-[600]`  | `16px`   | N/A       | `text-pulsar-dark`                          |
| **FAQ answer**                | Inter   | regular       | `14px`   | `1.8`     | `text-gray-600`                             |

### Headline Highlight Box Pattern

```jsx
<div className="bg-pulsar-pink text-white px-4 py-1 mb-2">
  <h2 className="font-futura font-bold text-[42px] leading-none uppercase tracking-wide">
    LINE ONE TEXT
  </h2>
</div>
```

**Rules**:
- Each line gets its own `<div>` wrapper with the background color
- Padding: `px-4 py-1`
- Gap between lines: `mb-2` on the top line
- Can mix: first line plain colored text, second line in highlight box

---

## Spacing & Layout

### Global Layout Rules

| Property              | Value                    | Notes                                  |
|-----------------------|--------------------------|----------------------------------------|
| **Max content width** | `1920px`                 | `max-w-[1920px] mx-auto`              |
| **Section padding X** | `140px`                  | `px-[140px]` on all content sections   |
| **Footer padding X**  | `100px`                  | `px-[100px]` on footer                 |
| **Header padding X**  | `80px`                   | `px-20` on nav                         |
| **Section padding Y** | `80px`–`100px`           | `py-[100px]` standard, `py-[80px]` for CTA/compact |
| **Column gap**        | `80px`                   | `gap-[80px]` for two-column layouts    |
| **Grid gap**          | `10px` (40px)            | `gap-10` for product/image grids       |

### Two-Column Layout Pattern

```jsx
<div className="max-w-[1920px] mx-auto px-[140px] flex items-start gap-[80px]">
  <div className="flex-[0_0_45%]">{/* Left: image or content */}</div>
  <div className="flex-1">{/* Right: content */}</div>
</div>
```

### Contact Form Layout (side-by-side title)

```jsx
<div className="flex items-start gap-[60px]">
  <div className="flex-shrink-0 pt-2"><h2>TITLE</h2></div>
  <div className="flex-1"><form>...</form></div>
</div>
```

---

## Buttons

### Button Rules

| Property     | Value                           |
|-------------|----------------------------------|
| Border radius | `rounded-full` (pill shape)    |
| Font        | `font-futura font-bold`         |
| Case        | `uppercase`                      |
| Size (main) | `text-[13px]`–`text-[15px]`     |
| Size (small)| `text-[11px]`–`text-[12px]`     |
| Padding     | `px-8 py-3.5` (standard)        |
| Hover       | `hover:-translate-y-0.5`        |
| Transition  | `transition-all duration-300`    |

### Button Variants

- **Primary Pink**: `bg-pulsar-pink text-white hover:bg-pulsar-pink-dark`
- **Primary Blue**: `bg-pulsar-blue text-white hover:bg-pulsar-blue-dark`
- **White on Pink**: `bg-white text-pulsar-pink hover:bg-pulsar-dark hover:text-white`
- **White on Blue**: `bg-white text-pulsar-blue hover:bg-pulsar-pink hover:text-white`
- **Ghost (on colored bg)**: `bg-transparent border-2 border-white text-white hover:bg-white/10`
- **Card Button**: `px-6 py-2 text-[12px]`
- **Filter Pill**: `rounded-[16px] px-5 py-3 text-[11px]`

### Arrow Convention

- Use `currentColor` for SVG arrows so they inherit button text color
- Arrow icon: `w-[18px]`–`w-[20px]`

---

## Wave Dividers

> [!IMPORTANT]
> ALL waves use these exact SVG paths for consistency.

### Standard Wave Geometry

| Property       | Value       |
|---------------|-------------|
| **ViewBox**    | `0 0 1440 120` |
| **Height**     | `h-[120px]` |
| **Wavelength** | 240 units   |
| **Amplitude**  | 40 units    |

### SVG Wave Paths

```
Normal:  M0 40 Q 120 80, 240 40 T 480 40 T 720 40 T 960 40 T 1200 40 T 1440 40
Flipped: M0 80 Q 120 0, 240 80 T 480 80 T 720 80 T 960 80 T 1200 80 T 1440 80
```

### Wave Placement Patterns

1. **Bottom of hero (absolute)**: wave inside the colored section with `absolute bottom-0`
2. **Between zones (Science pattern)**: rect fills top color, path fills bottom color
3. **Footer top**: white wave mask over blue footer

### Avoiding Wave Gaps

Always place the wave SVG `absolute bottom-0` inside the colored section rather than as a separate div. This prevents subpixel rendering gaps between sections.

---

## Page Templates

### Hero Image Page (Home, Reviews, Subscription, Science)
- Full-width background image or grey placeholder
- `min-h-[50vh]`–`min-h-[80vh]` depending on content
- White wave at bottom
- Nav is `absolute bg-transparent` (blends into hero)

### Blue Hero Page (Blog, Contact, Wholesale)
- `bg-pulsar-blue` with squiggle background (`footer_Squigle.svg` as `<img>`, `opacity-[0.05]`)
- White wave at bottom
- Nav is `absolute bg-transparent`

### Pink Hero Page (Shipping, Refunds, Terms, FAQ)
- `bg-pulsar-pink` with squiggle background (`footer_Squigle.svg` as `<img>`, `opacity-[0.05]`)
- White wave at bottom
- Nav is `absolute bg-transparent`, scrolled state `bg-pulsar-pink/95`
- Content below is white bg with section headers in `text-pulsar-blue font-bold text-[24px] uppercase`

### Standard Blue Nav Page (About, Shop, Science, etc.)
- Nav is `relative bg-pulsar-blue`
- Scrolled: `fixed bg-pulsar-blue/95 backdrop-blur-md shadow-xl`

### Product Page
- Nav is `relative bg-white` with `text-pulsar-blue`
- Scrolled: `fixed bg-white/95 backdrop-blur-md shadow-xl`

---

## Section Architecture

### Multi-Zone Pattern (Science section style)

```
┌──────────────────────────────────────────┐
│  COLOR A ZONE  │  Headers               │  bg-[colorA]
├────────────────┤─────────────────────────┤
│         WAVE DIVIDER (A → B)            │  inline SVG
├────────────────┤─────────────────────────┤
│  Image         │  Content               │  bg-[colorB]
│  Placeholder   │  + CTA button          │
└────────────────┴─────────────────────────┘
```

Used on: Homepage Science (white→blue), Subscription Why Subscribe (pink→white), Science page How It Works (white→blue)

### FAQ Accordion Pattern

```jsx
<div className="border-t border-pulsar-blue/30">
  {faqs.map((faq, i) => (
    <div className="border-b border-pulsar-blue/30 cursor-pointer" onClick={toggle}>
      <div className="flex justify-between items-center py-6">
        <span className="font-inter font-[600] text-[16px]">{faq.q}</span>
        <span className="text-pulsar-blue text-[24px]" style={{ transform: active ? 'rotate(45deg)' : '' }}>+</span>
      </div>
      <div className={active ? 'max-h-[400px] opacity-100 pb-6' : 'max-h-0 opacity-0'}>
        <p className="font-inter text-[14px] leading-[1.8] text-gray-600">{faq.a}</p>
      </div>
    </div>
  ))}
</div>
```

Used on: FAQ page (full width), Product page (in tab), Wholesale page (light blue bg)

### Blog Category Row (Carousel)

- 3 visible cards at a time
- Left/right arrow navigation
- Cards: `aspect-[4/3] bg-[#757575] rounded-[16px]` with category tag pill at `absolute bottom-3 left-3`
- Category tag colors: Lifestyle = `bg-pulsar-blue`, Science = `bg-pulsar-pink`, Recipes = `bg-[#FFA700]`

### Review List Pattern

```jsx
<div className="flex py-10 border-b border-gray-200">
  <div className="flex-[0_0_250px]">{/* Author, date, verified */}</div>
  <div className="flex-1">{/* Stars, title, text */}</div>
</div>
```

Stars fill color: `#44C8E8` (blue) in lists, `#DE64A5` (pink) in review form

---

## Component Library

### Header (`src/components/Header/Header.jsx`)

- Position: `absolute top-0` on hero pages, `relative` otherwise → `fixed` on scroll (>50px)
- Transparent pages: `/`, `/blog`, `/shipping`, `/refunds`, `/terms`, `/faq`, `/wholesale`
- Pink scrolled state pages: `/shipping`, `/refunds`, `/terms`, `/faq`
- Layout: 3-column flex (`nav links | logo | actions`)
- Logo height: `h-[44px]`

#### Account Icon States
- **Not logged in**: standard person SVG, no circle
- **Logged in, no avatar**: person SVG inside a circle border (`w-[28px] h-[28px] rounded-full border-2`)
- **Logged in, with avatar**: profile image in circle

#### Account Dropdown States
- **Not logged in**: Sign Up / Sign In buttons → forms
- **Logged in**: "Hey, [name]!" + links to My Account, My Orders, My Subscription, Sign Out

#### Cart Drawer
- `w-[450px]`, `rounded-l-[40px]`, slide from right
- Shows item count badge on cart icon when items > 0
- Subscription items show "Monthly Subscription" label and `/mo` suffix
- "WE KNOW YOU WANT:" section shows products not in cart

### Search (`Header search dropdown`)
- Functional search across all pages, products, and blog posts
- Results show grey thumbnail + pulsar pink title
- Enter key navigates to first result
- "No results found" when empty

### Footer (`src/components/Footer/Footer.jsx`)
- Three link columns: Explore, Connect, Support
- Disclaimer/warning text at bottom in `text-[10px] text-white/60`
- Social links: Instagram, Facebook, TikTok (real URLs)

### Cart Context (`src/context/CartContext.jsx`)
- Products include `subscription: true/false` flag
- Subscription products: `sub-weekend`, `sub-social`, `sub-jugular`

### Auth Context (`src/context/AuthContext.jsx`)
- `login(userData)`, `logout()`, `updateUser(updates)`
- User object: name, email, phone, avatar, addresses, orders, subscription, referralCode, smsOptIn, emailOptIn

---

## Z-Index Strategy

| Layer                  | z-index    | Notes                                   |
|------------------------|------------|------------------------------------------|
| **Cart drawer**        | `z-[2000]` | Above everything                         |
| **Cart overlay**       | `z-[1500]` | Dark backdrop                            |
| **Header**             | `z-[1000]` | Always on top of page content            |
| **Login modal**        | `z-[2001]` | Wholesale login prompt                   |
| **Foreground content** | `z-10`–`z-20` | Image placeholders, text blocks       |
| **Wave masks**         | `z-10`     | Footer/section wave masks                |
| **Swiggle lines**      | `z-[1]`    | Background texture, behind everything    |
| **Background textures**| `z-0`      | Squiggle patterns                        |

---

## Image Placeholders

### Standard Placeholder Box
```jsx
<div className="w-full aspect-[3/4] bg-[#555555] rounded-[30px] shadow-2xl"></div>
```

### Product/Blog Card Placeholder
```jsx
<div className="w-full aspect-[4/3] bg-[#757575] rounded-[16px]–[24px] shadow-md"></div>
```

### Hero Placeholder
```jsx
<section className="relative w-full min-h-[50vh]–[80vh] bg-[#555555] overflow-hidden">
```

---

## Animations & Transitions

### CSS Animations (defined in `index.css`)

| Animation            | Duration | Usage                  |
|---------------------|----------|------------------------|
| `marquee`            | `30s`    | Forward scrolling text |
| `marqueeReverse`     | `30s`    | Reverse scrolling text |
| `fadeIn`             | `0.3s`   | Tab content transitions|

### Marquee Usage

```jsx
<div className="flex animate-marquee whitespace-nowrap">
  {[...Array(20)].map((_, i) => <span key={i}>TEXT →</span>)}
</div>
```

Colors: pink bg on homepage, blue bg on subscription page

### Hover Conventions

| Element               | Hover Effect                                     |
|----------------------|--------------------------------------------------|
| **Buttons**           | `hover:-translate-y-0.5` + color darkening       |
| **Cards**             | `hover:-translate-y-1.5 hover:shadow-lg`         |
| **Subscription tiers**| `hover:scale-105` (recommended: `hover:scale-110`) |
| **Blog cards**        | `group-hover:-translate-y-1 group-hover:shadow-lg` |
| **Links**             | `hover:text-pulsar-pink`                         |
| **Social icons**      | `hover:-translate-y-1`                           |
| **Toggle switches**   | Pulsar pink when on, gray when off               |

---

## Assets & SVGs

### Asset Directory: `src/assets/`

| File                   | Usage                                    |
|------------------------|------------------------------------------|
| `Logo_White.svg`       | Header + Footer logos                    |
| `Logo_Blue.svg`        | Alt logo (white backgrounds)             |
| `Logo_full color.svg`  | Product page logo                        |
| `hero-bg.jpg`          | Homepage hero background                 |
| `about-hero.jpg`       | About page hero                          |
| `subscription-hero.jpg`| Subscription page hero                   |
| `reviews-hero.jpg`     | Reviews page hero                        |
| `patch-front.svg`      | Floating patch front face                |
| `patch-back.svg`       | Floating patch back face                 |
| `icon-arrow.svg`       | Button arrow icon (white)                |
| `swiggle-line.svg`     | Science section background decoration    |
| `footer_Squigle.svg`   | Footer + hero squiggle backgrounds       |
| `Squigle_What is Pulsar.svg` | Shop/contact squiggle backgrounds |
| `icon-vitamin-b.svg`   | Vitamin B ingredient icon                |
| `icon-vitamin-b3.svg`  | Vitamin B3 ingredient icon               |
| `icon-vitamin-b9.svg`  | Vitamin B9 ingredient icon               |
| `icon-glutathione.svg` | Glutathione ingredient icon              |
| `icon-nac.svg`         | NAC ingredient icon                      |
| `icon-ginger.svg`      | Ginger Extract ingredient icon           |
| `Cheers_icon.svg`      | Subscription benefit icon                |
| `Calender_icon.svg`    | Subscription benefit icon                |
| `$.svg`                | Subscription benefit icon                |
| `Stupid simple_1.svg`  | How-to step 1 icon                       |
| `Stupid simple_2.svg`  | How-to step 2 icon                       |
| `Smile_Icon_3.svg`     | How-to step 3 icon                       |

### Blog Images: `src/assets/blog/`

Downloaded from Unsplash (free license). Used for mid-article images in blog posts.

---

## Copy Rules

> [!IMPORTANT]
> These rules must be followed for ALL user-visible text on the site.

1. **Never use em dashes (—)**. Use commas, periods, or colons instead.
2. **Headlines are always uppercase** via Tailwind `uppercase` class.
3. **FDA disclaimer required** on any page referencing hangover defense: "Hangover Defense Patch" is a product descriptor only and does not imply prevention, treatment, or cure of hangovers or intoxication. Results may vary. Statements have not been evaluated by the FDA.
4. **Product descriptions are unique** per product (stored in Product.jsx `overviews` object).
5. **FAQ answers should have personality** while remaining accurate.
6. **Blog posts must include sources** for scientific claims with clickable links at the bottom.
7. **Contact email**: hello@pulsarpatch.com

---

## Site Map

```
/                     Home
/about                About Us
/science              The Science
/shop                 Shop All
/product/:id          Product Detail (1-5)
/reviews              Customer Reviews
/subscription         Subscription Plans
/contact              Contact Us
/blog                 Blog (all posts)
/blog/:id             Blog Post Detail
/shipping             Shipping Policy
/refunds              Refund Policy
/terms                Terms of Service
/faq                  FAQ
/wholesale            Wholesale Portal (business login gated pricing)
/business-signup      Business Account Application
/account              Personal Account Settings
/admin                Admin Dashboard
```

---

## Quick Reference Checklist (New Page/Section)

- [ ] Use `max-w-[1920px] mx-auto px-[140px]` for content containers
- [ ] Headlines: `font-futura font-bold uppercase tracking-wide`
- [ ] Body text: `font-inter text-[14px]–[15px] leading-[1.6]–[1.8]`
- [ ] Buttons: pill-shaped, `font-futura font-bold uppercase rounded-full`
- [ ] Wave dividers: use standard SVG path, `absolute bottom-0` inside colored section
- [ ] Image placeholders: `bg-[#555555] rounded-[30px]` or `bg-[#757575] rounded-[16px]`
- [ ] Highlight boxes: individual `<div>` per line with `bg-pulsar-pink` or `bg-pulsar-blue`
- [ ] White text only on colored backgrounds
- [ ] All hover effects include `-translate-y-0.5` lift
- [ ] Squiggle backgrounds: `<img>` tag, `opacity-[0.05]`, `pointer-events-none`
- [ ] No em dashes in any copy
- [ ] FDA disclaimer on product/science pages
- [ ] Section headers on policy pages: `text-pulsar-blue font-bold text-[24px] uppercase`
- [ ] FAQ accordions: `border-pulsar-blue/30`, `+` rotates to `x`
