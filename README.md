# SysAdmin Documentation Lab

A web-based documentation practice system for the *System Administration and Maintenance* course, made by **Albao Group** for the report **Professional Practices and Documentation**.

You pick a realistic scenario. Updates arrive one at a time, each with its own time. You document the situation the way a system administrator should, check your record against the facts that matter, and save it to a documentation log.

## How it works

1. **Pick a scenario** on the *Scenarios* tab.
2. **Read the updates** in the left panel. Click **Show next update** to reveal each event: phone calls, emails, alerts and your own actions, each time-stamped.
3. **Document it** in the form on the right:
   - Date and time (`YYYY-MM-DD HH:MM`, 24-hour; entries like `9:42` or `2:05 pm` are corrected automatically)
   - Who reported it, contact details, department and location
   - Affected system, severity, impact and exact error messages
   - A **timeline** with one time-stamped entry per action
   - Cause, resolution, status and follow-up actions
4. **Check my documentation** scores your record against the scenario's key facts, grouped by **Who, What, When, Where, Why, How (5W1H)**, and against documentation standards: required fields, timeline in time order, no passwords.
5. **Save record** (or **Submit to class**, see below). It gets an ID such as `INC-2026-0001` and appears in the *Records* tab, where **Compare with example answer** shows a model answer.

## Features

| Feature | What it demonstrates |
|---|---|
| Live clock and **Now** buttons | Recording the current date and time |
| Templates: Incident Report, Service Request, Security Incident Report, Maintenance Log | Choosing the right document type |
| Required fields (marked `*`) that block saving | Mandatory information |
| Automatic record IDs (`INC-`, `REQ-`, `SEC-`, `MNT-` + year + number) | Naming and numbering conventions |
| Time-stamped action timeline | Chronological record keeping |
| Documentation check with 5W1H breakdown and example answer | What "complete" documentation means |
| Edit with **reason for change** and revision history (version 1, 2, 3…) | Document control and audit trail |
| Records log with search and filters | Finding past documentation |
| Copy as Markdown, download `.md`, download all as JSON | Exporting and sharing records |
| Auto-saved draft, **Start over** and **Reset all** | Not losing work in progress; starting fresh |
| **Submit to class** and the *Class review* tab | Collecting and reviewing everyone's documentation |
| *How to document* guide | 5W1H, rules for good documentation, template guide |

## Scenarios

**Practice scenarios**, for demos and self-study:

| Scenario | Template | Level |
|---|---|---|
| Shared drive is down | Incident Report | Easy |
| Accounts for a new employee | Service Request | Easy |
| Phishing email: account hacked | Security Incident Report | Medium |
| Server room is overheating | Incident Report | Medium |
| Company laptop stolen | Security Incident Report | Medium |
| Nightly backup failed | Maintenance Log | Easy |

**Class activity scenarios**, kept separate so classmates haven't seen the answers:

| Scenario | Template | Level |
|---|---|---|
| Office internet is down | Incident Report | Easy |
| Website shows a security warning | Incident Report | Medium |
| Folder access for an auditor | Service Request | Easy |
| Files locked by ransomware | Security Incident Report | Medium |
| Server disk is failing | Maintenance Log | Easy |
| Employee resigned: remove access | Service Request | Medium |

The class link opens a **Class activity** page that lists only the class scenarios (`#class`). It can also open one class scenario (`#start-<id>`), or give **each person a random one** (`#start-random`), so people sitting together get different scenarios.

The *Document a real event* section starts a blank record from any template.

## Running it

The whole site is one file, `index.html`. It needs no build step.

- **On your computer:** open `index.html` in a browser.
- **Vercel (recommended):**
  1. Sign in at [vercel.com](https://vercel.com) with GitHub.
  2. **Add New… → Project**, then **Import** `zaizkuu/Simple-Documentation-Demo`.
  3. Change **Project Name** if you want a different address (for example `sysadmin-doclab` gives `sysadmin-doclab.vercel.app`).
  4. Leave **Framework Preset** as *Other* with no build command, and click **Deploy**.

  Every push to the repository redeploys automatically.
- **GitHub Pages:** in the repository go to **Settings → Pages**, choose **Deploy from a branch**, pick the branch and `/ (root)`, and save.

### Where records are saved

- **Personal records** (the *Records* tab) stay in each person's browser, on that device. Use **Download all (JSON)** to keep a copy.
- **Class submissions** go to the Supabase database, once it's connected.
- **On the Claude artifact link,** records are saved privately to your Claude account. Class submissions don't work there.

## Class submissions (Supabase)

Classmates open the site, do a scenario, type their name in **Documented by** and click **Submit to class**. No account is needed. The presenter opens **Class review**, enters the review code, and can:

- show a **QR code and link** that opens the class activity page, one scenario, or a random class scenario for each person
- see every submission with its key-fact score and how often the person used the check
- sort and filter, turn on auto-refresh, and step through submissions with **Previous / Next** (or the ← → keys)
- **compare** each submission with the example answer
- delete single submissions or **delete all** after a practice run

Visitors can only **add** submissions. Reading or deleting them needs the review code, which is stored as a bcrypt hash in the database.

### Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**. Paste `supabase/schema.sql`, change `CHANGE-THIS-CODE` at the bottom to your review code, and click **Run**. Don't commit your real code.
3. In **Project Settings → API**, copy the **Project URL** and the **anon / publishable key**.
4. Put them in `SUPABASE_URL` and `SUPABASE_KEY` near the top of the script in `index.html`, then commit and push. Vercel redeploys automatically.

To change the review code later, run the last statement of `schema.sql` again with a new code.

## Suggested demo (about 5 minutes)

1. Show the *Scenarios* tab and the live clock.
2. Start **Shared drive is down**. Reveal the first update and document it live: title, date and time, reporter, contact, the error message, a timeline entry.
3. Reveal the remaining updates, adding a timeline entry for each.
4. Click **Check my documentation** and walk through the 5W1H score and the missed facts.
5. Save the record. Open **Compare with example answer**, then edit the record with a reason and point out the revision history.
6. **Class activity:** show the QR code on *Class review*, let classmates submit, then review their work together.
7. Finish on the *How to document* tab.

## Changing the scenarios

Scenarios are defined in the `SCENARIOS` list inside `index.html`. Each has its updates (`events`), the key facts the check looks for (`facts`), and an example answer (`model`). Dates are written as `{date}`, `{date-1}` or `{nextMonday}` and filled in with real dates when a scenario starts.

All people, systems and addresses in the scenarios are fictional.
