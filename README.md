# SysAdmin Docs: Professional Practices and Documentation

A simple documentation website made by **Albao Group** for the *System Administration and Maintenance* course. It covers our report topic, **Professional Practices and Documentation**:

1. Documentation standards
2. IT policies and compliance
3. Ethical issues in system administration

The site is both the report and a working demonstration. Every page uses the documentation practices it describes: document control, versioning, templates, search, cross-references and revision history.

## Running the site

No installation or internet connection is needed.

- **Easiest:** open `index.html` in any modern browser (double-click it).
- **Local web server** (optional):

  ```bash
  python3 -m http.server 8000
  # then open http://localhost:8000
  ```

### Publishing with GitHub Pages

1. On GitHub, open the repository's **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select the branch that holds the site and the `/ (root)` folder, then click **Save**.
4. After a minute the site is live at `https://zaizkuu.github.io/Simple-Documentation-Demo/`.

## What's inside

| Section | Pages |
|---|---|
| Report topics | Documentation Standards · IT Policies & Compliance · Ethics in System Administration |
| Sample documents | SOP (new user account) · Runbook (backup & restore) · Incident report · Change request · Network & asset inventory |
| Resources | Templates (downloadable Markdown) · Glossary · About & References |

### Documentation features demonstrated

| Feature | Where to see it |
|---|---|
| Sidebar navigation, breadcrumbs, previous/next links | Every page |
| Full-text search (<kbd>Ctrl</kbd>+<kbd>K</kbd> or <kbd>/</kbd>) | Top bar |
| “On this page” table of contents with scroll tracking | Right side (wide screens) |
| Document control block, status badges, version numbers | Sample documents |
| Revision history | End of every sample document |
| Callouts (note, tip, warning, danger) | All pages |
| Code blocks with copy button | SOP, runbook, change request |
| Tabs (Linux / Windows) that stay in sync and are remembered | SOP |
| Diagrams (lifecycle, policy pyramid, network, backup flow) | Standards, Policies, Network, Runbook |
| Interactive checklists (progress saved in the browser) | Policies, SOP, change request |
| Scenario quizzes | Ethics |
| Templates with copy and download | Templates |
| Searchable glossary and hover definitions | Glossary, `abbr` terms |
| Section deep links (hover a heading, click `#`) | All pages |
| Print / Save as PDF layout | Printer icon under each page title |
| Dark mode | Sun/moon icon in the top bar |
| “Was this page helpful?” feedback | End of every page |

## Presenter's demo script (about 7 minutes)

1. **Home page:** introduce the three topics and point out that the site follows its own rules.
2. **Documentation Standards:** scroll through and show the *On this page* panel highlighting the current section. Show the seven Cs table, the poor vs. good step example and the lifecycle diagram.
3. **Search:** press <kbd>Ctrl</kbd>+<kbd>K</kbd>, type `backup`, and open a result. It jumps straight to the section.
4. **SOP sample:** show the document control block, then switch the **Linux / Windows** tabs. The verification and rollback tabs switch too. Click **Copy** on a command and tick a checklist item.
5. **IT Policies & Compliance:** show the policy pyramid, open a few policy accordions, and tick items in the compliance checklist. Mention the Data Privacy Act and the 72-hour breach notification.
6. **Incident report:** walk through the timeline, the 5 Whys and the corrective actions. Point out that the root cause was an *undocumented* change.
7. **Ethics:** let the class vote on Scenario 1, then click an answer to reveal the discussion.
8. **Finish:** toggle dark mode, click the printer icon to show the PDF layout, and open the **Templates** page to download a template.

## Project structure

```
index.html                       Home page
pages/                           Report topics and resources
pages/samples/                   Sample documents
assets/css/style.css             Design, dark mode and print layout
assets/js/site.js                Navigation (NAV list), search, interactive features
assets/js/search-index.js        Generated search index (do not edit by hand)
scripts/build-search-index.mjs   Rebuilds the search index
```

## Editing the site

- **Group members:** edit the table in `pages/about.html` (look for `[Member name]`).
- **Add a page:** copy an existing page, change its `<title>`, `data-page` and content, add it to the `NAV` list at the top of `assets/js/site.js`, then rebuild the search index:

  ```bash
  node scripts/build-search-index.mjs
  ```

- **After any content change:** update the page's `data-updated` date (and `data-version` if needed) and rebuild the search index.

## Notes

Example Corp and all names, servers, IP addresses and records in the sample documents are fictional. Summaries of laws and standards are simplified for teaching and are not legal advice.
