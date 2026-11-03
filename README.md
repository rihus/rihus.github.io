# rihus.github.io

Personal portfolio and research site of **Riaz Hussain, PhD**, MRI Physicist / Research Scientist.
It's live at **https://rihus.github.io**.

The site is built with [Astro](https://astro.build) as a static site and deployed to GitHub Pages
by a GitHub Actions workflow. **All the text lives in plain Markdown and YAML files**, so you can
update the site without touching any code.

---

## Editing content (no coding needed)

Every file below is in `src/content/`. You can edit a file directly on GitHub: open it, click the
✏️ pencil icon, make your change and click **Commit changes**. The site rebuilds and redeploys
automatically within a minute or two (see the **Actions** tab for progress).

| What you want to change | File |
| --- | --- |
| Name, title, home-page summary, email, social links, photo, SEO description | `src/content/profile.md` |
| Intro text on the About page | `src/content/about.md` |
| Jobs and positions | `src/content/experience.yaml` |
| Degrees | `src/content/education.yaml` |
| Awards, teaching, society memberships | `src/content/honors.yaml` |
| Journal articles | `src/content/publications.yaml` |
| Talks and posters | `src/content/presentations.yaml` |
| Research areas (one file per area) | `src/content/research/*.md` |
| Software projects | `src/content/projects.yaml` |
| Skills | `src/content/skills.yaml` |
| CV PDF | `public/Hussain_CV_simple.pdf` |

### A few rules for YAML files

- Each entry starts with `- id: something-unique`. Fields are indented by **two spaces** under it.
- Lines starting with `#` are comments and do not appear on the site.
- If a value contains a colon followed by a space (`: `), wrap it in quotes, e.g.
  `title: "Physics works: Improved functional lung MR images"`.
- Entries appear on the page **in the same order as in the file**. Publications and presentations
  are also sorted by year, newest first.
- Special characters work as-is: `¹²⁹Xe`, `B₁`, `La₂O₃Fe₂Se₂`, `–`, `µ`.

If you make a mistake, the build fails and the live site **stays unchanged**. The Actions log
tells you which file and field caused the problem.

### Common tasks

**Add a new publication.** Copy an existing block in `publications.yaml`, paste it at the top
and edit the fields:

```yaml
- id: hussain-2027-mrm          # any unique name
  year: 2027
  authors: Hussain, R., Someone, A., and Cleveland, Z. I.
  title: My new paper
  journal: Magnetic Resonance in Medicine
  details: 97, 100–110          # volume, pages (optional)
  status: Accepted              # optional, remove once published
  doi: 10.1002/mrm.xxxxx        # just the DOI, without https://doi.org/
  topic: imaging                # imaging  OR  physics
  firstAuthor: true             # first-author imaging papers appear on the home page
```

Your name (`Hussain, R.`) is shown in bold automatically. An entry with no `doi`, `pmid` or `url`
gets a "Find article" link to a Google Scholar search instead.

**Replace the photo.** Upload a square photo (at least 600×600 px) to `public/images/`, e.g.
`public/images/riaz.jpg`. Then set `photo: /images/riaz.jpg` in `src/content/profile.md`.

**Replace a research image.** Upload the image to `public/images/research/`, then change the
`image:` (and `imageAlt:`) lines at the top of the research area's `.md` file. Landscape images
(16:9) work best. Delete the `imageCaption:` line or change its text.

**Add a research area.** Copy one of the files in `src/content/research/`, rename it, and set
`order:` to control its position.

**Add a project repository link.** In `projects.yaml`, set
`repo: https://github.com/rihus/your-repo`. While `repo` is empty (`""`), the card shows
"Repository private / coming soon".

**Update the CV.** Replace `public/Hussain_CV_simple.pdf` with the new PDF, keeping the same file
name, and update `cvUpdated:` in `profile.md`. If you use a different file name, also change
`cvFile:`.

**Add a job highlight.** In `experience.yaml`, replace `highlights: []` with a list:

```yaml
  highlights:
    - Developed ...
    - Led ...
```

### Things still to fill in

Search the repository for `TODO` to find every placeholder. In particular:

- DOIs for the publications where the CV doesn't list one (`publications.yaml`)
- Bullet points for each position (`experience.yaml`)
- Project descriptions and repository links (`projects.yaml`)
- Your photo and the research images
- An optional sentence about low-field work and career goals (`about.md`, `research/05-…md`)

---

## Social previews (LinkedIn etc.)

Each page has Open Graph and Twitter tags, a canonical URL and a sitemap. The home page also has
structured data (schema.org `Person`). The preview image is `public/og-image.png` (1200×630).
To regenerate it after changing your title, edit the text constants in
`scripts/make-og-image.mjs` and run it (this needs Playwright; instructions are at the top of
the script). Or just replace the PNG with your own 1200×630 image.

LinkedIn caches previews. After changing them, paste your URL into the
[LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) to refresh the cache.

---

## Running locally (optional)

You need [Node.js](https://nodejs.org) 22.23.4 or newer.

```bash
npm install
npm run dev        # live preview at http://localhost:4321
npm test           # type-check + build + check for broken internal links
npm run build      # production build into dist/
npm run preview    # serve the production build
```

## Deployment

`.github/workflows/deploy.yml` builds and tests the site on every pull request. On every push to
`main`, it also deploys the site.

**One-time setup:** in the repository on GitHub, go to **Settings → Pages → Build and deployment**
and set **Source** to **GitHub Actions**.

## Project structure

```text
src/content/         ← all editable text (Markdown + YAML)
src/content.config.ts  content schemas (field names and types)
src/pages/           one file per page (/, /about, /research, /publications, /projects, /skills, /cv)
src/layouts/         page shell: header, navigation, footer, light/dark toggle, SEO tags
src/components/      small reusable pieces (icons, publication entry, SEO)
src/styles/          global CSS and colour tokens (light + dark)
public/              files served as-is: CV PDF, images, favicon, og-image.png, robots.txt
scripts/             internal link checker, social-image generator
```
