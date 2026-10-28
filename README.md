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
4. **Check my documentation** scores your record against the scenario's key facts, grouped by **Who, What, When, Where, Why, How (5W1H)**, and against documentation standards: required fields, timeline in time order, no passwords. **Show example documentation** shows a model answer.
5. **Save record.** It gets an ID such as `INC-2026-0001` and appears in the *Records* tab.

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
| Auto-saved draft | Not losing work in progress |
| *How to document* guide | 5W1H, rules for good documentation, template guide |

## Scenarios

| Scenario | Template | Level |
|---|---|---|
| Shared drive is down | Incident Report | Easy |
| Accounts for a new employee | Service Request | Easy |
| Phishing email: account hacked | Security Incident Report | Medium |
| Server room is overheating | Incident Report | Medium |
| Company laptop stolen | Security Incident Report | Medium |
| Nightly backup failed | Maintenance Log | Easy |

The *Document a real event* section starts a blank record from any template.

## Running it

The whole system is one file, `index.html`. It needs no server or installation.

- **On your computer:** open `index.html` in a browser.
- **GitHub Pages:** in the repository go to **Settings → Pages**, choose **Deploy from a branch**, pick this branch and `/ (root)`, and save. The site appears at `https://zaizkuu.github.io/Simple-Documentation-Demo/`.

### Where records are saved

- **Opened from a file or GitHub Pages:** in that browser's local storage, on that device only. Use **Download all (JSON)** to keep a copy.
- **Opened from the Claude artifact link:** in your own private storage on your Claude account.

## Suggested demo (about 5 minutes)

1. Show the *Scenarios* tab and the live clock.
2. Start **Shared drive is down**. Reveal the first update and document it live: title, date and time, reporter, contact, the error message, a timeline entry.
3. Reveal the remaining updates, adding a timeline entry for each.
4. Click **Check my documentation**: walk through the 5W1H score and the missed facts, then open the example answer.
5. Save the record. Show the record view, edit it with a reason, and point out the revision history.
6. Finish on the *How to document* tab.

## Changing the scenarios

Scenarios are defined in the `SCENARIOS` list inside `index.html`. Each has its updates (`events`), the key facts the check looks for (`facts`), and an example answer (`model`). Dates are written as `{date}`, `{date-1}` or `{nextMonday}` and filled in with real dates when a scenario starts.

All people, systems and addresses in the scenarios are fictional.
