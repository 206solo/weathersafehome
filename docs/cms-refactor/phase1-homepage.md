# weathersafehome CMS — Phase 1: Homepage Refactor

## Goal

Refactor `src/pages/index.astro` so that all editable content lives in a Decap-editable markdown file. The page structure, styling, and icons stay in code. Amy will edit the homepage through the Decap CMS at `/admin`.

## Success criteria

1. A new content collection `homepage` exists with a typed schema
2. A content file `src/content/homepage/index.md` contains all current homepage copy
3. `src/pages/index.astro` renders from the content file (no hardcoded copy remains)
4. `public/admin/config.yml` has a new `homepage` collection so Amy sees a "Homepage" option in the CMS
5. Running `npm run dev` shows the site looking **identical** to before (visual regression = zero)
6. Editing any field in the CMS admin UI, saving, and refreshing shows the change on the site

## Work in a feature branch

Before starting:

```bash
git checkout -b cms-homepage
```

Do NOT merge to main until the testing checklist passes.

---

## Step 1: Install content collections config

Astro content collections require a config file at `src/content/config.ts`. Check if it exists. If not, create it. If it does, extend it with the homepage collection.

**File: `src/content/config.ts`**

```typescript
import { defineCollection, z } from 'astro:content';

// Shared sub-schemas
const ctaSchema = z.object({
  text: z.string(),
  link: z.string(),
});

const statSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const cardSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string(),
  imageAlt: z.string(),
  link: z.string(),
  iconKey: z.enum([
    'hurricane', 'flood', 'wildfire', 'winter-storm', 'tornado',
    'generator', 'insurance', 'emergency-kit', 'flood-protection',
    'safe-room', 'backup-power',
  ]),
});

// Homepage collection
const homepage = defineCollection({
  type: 'content',
  schema: z.object({
    meta: z.object({
      title: z.string(),
      description: z.string(),
    }),
    hero: z.object({
      eyebrow: z.string(),
      headline: z.string(),
      subheading: z.string(),
      image: z.string(),
      imageAlt: z.string(),
      ctaPrimary: ctaSchema,
      ctaSecondary: ctaSchema,
    }),
    stats: z.array(statSchema).length(4),
    threatsSection: z.object({
      heading: z.string(),
      subheading: z.string(),
      cards: z.array(cardSchema).length(5),
    }),
    productsSection: z.object({
      heading: z.string(),
      subheading: z.string(),
      cards: z.array(cardSchema).length(6),
    }),
    emailCapture: z.object({
      heading: z.string(),
      subheading: z.string(),
      buttonText: z.string(),
      formName: z.string(),
    }),
  }),
});

// Preserve any existing collections (e.g., articles) and add homepage
export const collections = {
  homepage,
  // ... existing collections like `articles` go here
};
```

**Important:** If `src/content/config.ts` already exists with an `articles` collection defined, preserve it — just add the `homepage` collection alongside it. Don't remove anything.

---

## Step 2: Create the homepage content file

**File: `src/content/homepage/index.md`**

Extract all current values from `src/pages/index.astro` into this file as YAML frontmatter. The current hardcoded values become the defaults. Body content below the frontmatter should be empty (or a comment explaining not to put body content here — all homepage content goes in frontmatter).

Structure:

```markdown
---
meta:
  title: "Protect Your Home from Storms, Floods & Wildfires"
  description: "WeatherSafeHome helps homeowners prepare for hurricanes, flooding, wildfires, tornadoes, and winter storms. Expert guides, product reviews, and free checklists."

hero:
  eyebrow: "Trusted Home Weather Protection Guides"
  headline: "Is Your Home Ready for the Next Storm?"
  subheading: "Expert guides, honest product reviews, and free checklists to help you protect your home from hurricanes, floods, wildfires, and more."
  image: "https://images.unsplash.com/photo-1504608524841-42584120d26f?w=1600&q=80&fit=crop"
  imageAlt: "Storm approaching a neighborhood"
  ctaPrimary:
    text: "Get Free Checklists"
    link: "/free-checklists"
  ctaSecondary:
    text: "Explore by Threat"
    link: "#threats"

stats:
  - value: "$1 → $6"
    label: "Average return on home mitigation investment"
  - value: "40%"
    label: "Of businesses never reopen after a disaster"
  - value: "72 hrs"
    label: "FEMA recommends self-sufficiency after a disaster"
  - value: "30 days"
    label: "Flood insurance waiting period — don't wait"

threatsSection:
  heading: "Protect Against Every Threat"
  subheading: "Select a storm type to see risk guides, preparation checklists, and product recommendations."
  cards:
    # Extract all 5 cards from the existing index.astro
    # Each: title, description, image, imageAlt, link, iconKey
    # iconKey values: hurricane, flood, wildfire, winter-storm, tornado

productsSection:
  heading: "Home Protection Products & Guides"
  subheading: "Curated product reviews and buying guides for every category of home protection."
  cards:
    # Extract all 6 cards from the existing index.astro
    # iconKey values: generator, insurance, emergency-kit, flood-protection, safe-room, backup-power

emailCapture:
  heading: "Get the Free Storm Season Checklist"
  subheading: "5 checklists covering hurricanes, flooding, wildfires, winter storms, and tornadoes. One email, instant download."
  buttonText: "Send Me the Checklists"
  formName: "homepage-checklist"
---
```

**For each card**, extract the exact values from the existing `index.astro` file. Do not invent or alter copy.

Notes on iconKey mapping (match these to the existing SVGs in index.astro):
- Threats cards, in order: `hurricane`, `flood`, `wildfire`, `winter-storm`, `tornado`
- Products cards, in order: `generator`, `insurance`, `emergency-kit`, `flood-protection`, `safe-room`, `backup-power`

---

## Step 3: Create an icon component

Move all 11 SVG icon definitions from `index.astro` into a new reusable component keyed by the `iconKey` field.

**File: `src/components/CardIcon.astro`**

```astro
---
interface Props {
  iconKey: string;
  size?: 'default' | 'small';
}
const { iconKey, size = 'default' } = Astro.props;
const isSmall = size === 'small';
---

<div class={`nav-card-icon ${isSmall ? 'nav-card-icon-sm' : ''}`}>
  {iconKey === 'hurricane' && (
    <!-- paste the existing hurricane SVG from index.astro -->
  )}
  {iconKey === 'flood' && (
    <!-- paste flood SVG -->
  )}
  <!-- etc for all 11 iconKeys -->
</div>

<style>
  /* move the .nav-card-icon and .nav-card-icon-sm styles here from index.astro */
</style>
```

Extract all 11 SVG blocks from the existing `index.astro` verbatim. Preserve every attribute (stroke, fill, viewBox, etc.). The only change is moving them into this component.

---

## Step 4: Refactor `src/pages/index.astro`

Completely rewrite `index.astro` to read from the content collection. It should become much shorter — roughly 60-80 lines instead of the current ~400.

Key requirements:

1. Import `getEntry` from `astro:content`
2. Load the homepage entry: `const homepage = await getEntry('homepage', 'index');`
3. Destructure `homepage.data` for each section
4. Render each section using the data (not hardcoded strings)
5. Use `<CardIcon iconKey={card.iconKey} />` instead of inline SVGs
6. Preserve all existing `<style>` rules EXCEPT the ones moved to CardIcon.astro
7. Preserve the Netlify form's `data-netlify="true"` attribute and hidden `form-name` field
8. Preserve ALL CSS classes (`hero`, `nav-card`, `stats-bar`, etc.) — the template structure must be identical so no styles break

**The visual output must be byte-for-byte identical to the current homepage.** If you render the new version next to the old version, they should look exactly the same. This is the primary visual regression check.

---

## Step 5: Update `public/admin/config.yml`

Add a new `homepage` collection so Amy can edit it. The `files` type (not `folder`) is used because there's only one homepage instance.

Paste this into `config.yml`, adding it to the existing `collections` array (keep the `articles` collection that's already there):

```yaml
collections:
  # Keep the existing articles collection here

  - name: "homepage"
    label: "Homepage"
    files:
      - label: "Homepage Content"
        name: "homepage"
        file: "src/content/homepage/index.md"
        fields:
          - label: "Meta / SEO"
            name: "meta"
            widget: "object"
            fields:
              - { label: "Page Title", name: "title", widget: "string", hint: "Shown in browser tab and search results" }
              - { label: "Meta Description", name: "description", widget: "text", hint: "1-2 sentences for search engine previews" }

          - label: "Hero Section"
            name: "hero"
            widget: "object"
            fields:
              - { label: "Eyebrow (small text above headline)", name: "eyebrow", widget: "string" }
              - { label: "Headline", name: "headline", widget: "string" }
              - { label: "Subheading", name: "subheading", widget: "text" }
              - { label: "Hero Image", name: "image", widget: "image", hint: "Upload or paste a URL. Recommended: 1600×900px" }
              - { label: "Image Alt Text (for accessibility)", name: "imageAlt", widget: "string" }
              - label: "Primary CTA Button"
                name: "ctaPrimary"
                widget: "object"
                fields:
                  - { label: "Button Text", name: "text", widget: "string" }
                  - { label: "Link", name: "link", widget: "string", hint: "e.g. /free-checklists" }
              - label: "Secondary CTA Button"
                name: "ctaSecondary"
                widget: "object"
                fields:
                  - { label: "Button Text", name: "text", widget: "string" }
                  - { label: "Link", name: "link", widget: "string" }

          - label: "Stats Bar"
            name: "stats"
            widget: "list"
            min: 4
            max: 4
            fields:
              - { label: "Value (big number/text)", name: "value", widget: "string" }
              - { label: "Label", name: "label", widget: "string" }

          - label: "Threats Section"
            name: "threatsSection"
            widget: "object"
            fields:
              - { label: "Heading", name: "heading", widget: "string" }
              - { label: "Subheading", name: "subheading", widget: "text" }
              - label: "Threat Cards"
                name: "cards"
                widget: "list"
                min: 5
                max: 5
                fields:
                  - { label: "Title", name: "title", widget: "string" }
                  - { label: "Description", name: "description", widget: "text" }
                  - { label: "Image", name: "image", widget: "image" }
                  - { label: "Image Alt Text", name: "imageAlt", widget: "string" }
                  - { label: "Link", name: "link", widget: "string" }
                  - label: "Icon"
                    name: "iconKey"
                    widget: "select"
                    options:
                      - { label: "Hurricane", value: "hurricane" }
                      - { label: "Flood", value: "flood" }
                      - { label: "Wildfire", value: "wildfire" }
                      - { label: "Winter Storm", value: "winter-storm" }
                      - { label: "Tornado", value: "tornado" }

          - label: "Products Section"
            name: "productsSection"
            widget: "object"
            fields:
              - { label: "Heading", name: "heading", widget: "string" }
              - { label: "Subheading", name: "subheading", widget: "text" }
              - label: "Product Cards"
                name: "cards"
                widget: "list"
                min: 6
                max: 6
                fields:
                  - { label: "Title", name: "title", widget: "string" }
                  - { label: "Description", name: "description", widget: "text" }
                  - { label: "Image", name: "image", widget: "image" }
                  - { label: "Image Alt Text", name: "imageAlt", widget: "string" }
                  - { label: "Link", name: "link", widget: "string" }
                  - label: "Icon"
                    name: "iconKey"
                    widget: "select"
                    options:
                      - { label: "Generator", value: "generator" }
                      - { label: "Insurance", value: "insurance" }
                      - { label: "Emergency Kit", value: "emergency-kit" }
                      - { label: "Flood Protection", value: "flood-protection" }
                      - { label: "Safe Room", value: "safe-room" }
                      - { label: "Backup Power", value: "backup-power" }

          - label: "Email Capture Section"
            name: "emailCapture"
            widget: "object"
            fields:
              - { label: "Heading", name: "heading", widget: "string" }
              - { label: "Subheading", name: "subheading", widget: "text" }
              - { label: "Button Text", name: "buttonText", widget: "string" }
              - { label: "Form Name (don't change unless you know what you're doing)", name: "formName", widget: "string" }
```

---

## Step 6: Local testing

Before pushing anything:

```bash
npm run dev
```

Visual regression checklist — open http://localhost:4321 and compare against the current live production site:

- [ ] Hero image, overlay, and gradient look identical
- [ ] Hero headline breaks on two lines (note the `<br/>` in the original — we'll need to handle this in the template, either via markdown or a multi-line string)
- [ ] All 4 stats show with correct dividers
- [ ] All 5 threat cards render with correct images, titles, descriptions, and icons
- [ ] All 6 product cards render correctly
- [ ] Email capture form has `data-netlify="true"` and the hidden form-name field
- [ ] Page is pixel-identical to production (use browser dev tools to verify)
- [ ] `npm run build` completes with no errors or warnings

Special note on the headline line break: the original hero headline is `Is Your Home Ready<br/>for the Next Storm?`. In the markdown file, this should be a single string. In the Astro template, split on the string or replace with a CSS-controlled line break. Simplest solution: render the headline as-is without the `<br/>`, and let CSS `max-width` handle natural wrapping. If the exact line break matters, use a sentinel like `|` in the content file and replace with `<br/>` in the template. Flag this decision to Kate if unsure.

---

## Step 7: Test the CMS edit flow

After verifying the local build looks correct:

1. Commit and push the `cms-homepage` branch:
   ```bash
   git add .
   git commit -m "Phase 1: Homepage CMS refactor"
   git push -u origin cms-homepage
   ```

2. Netlify will build a deploy preview. Get the preview URL from Netlify dashboard.

3. Visit `[preview-url]/admin` and log in.

4. You should see a new "Homepage" option in the CMS sidebar.

5. Click Homepage → Homepage Content. Verify:
   - All fields are populated with current values
   - Every section (Hero, Stats, Threats, Products, Email Capture) is editable
   - Icon dropdowns show all valid options

6. Make a small test edit (e.g., change hero eyebrow to "Test Edit"), save, and verify it commits to the branch.

7. Wait for the rebuild, then check the preview URL — the change should be visible.

8. Revert the test edit via the CMS before merging.

---

## Step 8: Merge to main

Only after all of Step 7 passes:

```bash
git checkout main
git merge cms-homepage
git push
```

Or open a PR on GitHub and merge via the web UI (Kate's preference).

Netlify will rebuild production. Verify weathersafehome.com still looks correct.

Delete the feature branch:

```bash
git branch -d cms-homepage
git push origin --delete cms-homepage
```

---

## When done, report back

Summarize to Kate:

1. What files were created (paths)
2. What files were modified (paths + brief description)
3. Any decisions made that weren't specified in this doc (especially the hero `<br/>` handling)
4. Any unexpected issues or changes from the plan
5. Confirmation that all testing checklist items passed
6. The Netlify preview URL so Kate can spot-check before merge

**Do not proceed to Phase 2 (threat pages).** Phase 1 ships independently. Kate will initiate Phase 2 when ready.
