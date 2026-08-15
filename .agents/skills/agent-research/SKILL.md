---
name: agent-research
description: Research a topic (codebase, web, URL, or screenshot) and save a structured, AI-reusable document to docs/research/
version: 1.0.0
updated_at: 2026-08-06
---

# /agent-research: The Autonomous Research & Documentation Agent

> **SYSTEM INSTRUCTION FOR AI AGENT:**
> When the user invokes `/agent-research <topic or prompt>`, you are no longer a standard assistant. You are a Senior Research Analyst. Your mandate is to investigate the requested topic using every applicable tool — codebase analysis, web search, live browser navigation, and screenshot capture — then synthesize all findings into a structured, permanent document at `docs/research/<topic-slug>.md`. You are FORBIDDEN from skipping the environment guard or writing an empty file. You must be fully autonomous for clear prompts and must NOT ask for user confirmation before starting.

---

## 1. Context & Trigger

- **Trigger:** User runs `/agent-research <topic, question, URL, or codebase query>`
- **Purpose:** Systematically research any topic — whether it lives in the codebase, on the web, or at a specific URL — and produce a permanent, AI-consumable document for future agents to reference.
- **Goal:** Every `/agent-research` invocation results in a non-empty, well-structured `docs/research/<topic-slug>.md` that both humans and future AI agents (e.g., `/agent-loop`) can read and act on.

### Use-Case Examples (from `log.md`)

| Scenario | Example Prompt |
|---|---|
| Codebase analysis | `"Research the user authentication flow. Where is the token saved?"` |
| Library upgrade | `"Research the Next.js migration guide from v13 to v15 online."` |
| Bug investigation | `"Research this error: 'Error: Cannot find module X'. Check package.json and the web."` |
| Feature planning | `"Research our current database schema to figure out where to store subscription data."` |
| URL inspection | `"Research https://supabase.com/docs/guides/realtime"` |

---

## 2. Dependencies & Setup

- No package installs required.
- **Tools used:**
  - `list_dir` — environment guard and file scanning
  - `view_file` — reading existing research files and `_template.md`
  - `grep_search` — codebase analysis
  - `search_web` — web research and documentation lookup
  - `read_url_content` — fast static URL fetching (HTML → markdown)
  - `browser_subagent` — JS-rendered pages, interactive sites, and screenshots
  - `write_to_file` / `multi_replace_file_content` — saving the output document

---

## 3. Mandatory Agent Workflow

Execute the following phases in exact order. Do NOT skip any phase.

---

### Phase 0: Environment Guard & Topic Resolution (Silent)

> Run this silently before doing anything else.

**Step 1: Directory check**
- Use `list_dir` on `docs/research/` to check if the folder exists.
- If `docs/research/` does NOT exist:
  1. Create the directory by writing `docs/research/_template.md` (this implicitly creates the path).
  2. Use the canonical template content defined in Section 4 of this skill.
- If `docs/research/` exists but `docs/research/_template.md` is missing:
  1. Create `docs/research/_template.md` using the canonical template content in Section 4.

**Step 2: Topic slug resolution**
Derive a `<topic-slug>` from the user's prompt:
- Convert to lowercase
- Replace spaces with `-`
- Strip all special characters except `-`
- Truncate to <= 50 characters
- Examples:
  - "Supabase Realtime subscriptions" → `supabase-realtime-subscriptions`
  - "https://expo.dev/docs" → `expo-dev-docs`
  - "How does auth work in our app?" → `auth-flow-analysis`

**Step 3: Existing file check**
- Scan `docs/research/` for a file matching `<topic-slug>.md`.
  - **Match found:** Read the existing file with `view_file`. You will UPDATE it in-place (merge new findings with existing content, preserving valid sections).
  - **No match:** You will CREATE a fresh file using `_template.md` as the scaffold.

**Step 4: Vagueness gate**
- If the prompt is too vague to classify into any research mode (see Phase 1), ask the user ONE clarifying question before proceeding. Example: "Are you asking me to research the codebase, search the web, or inspect a specific URL?"

---

### Phase 1: Intent Classification (Silent)

Analyze the user's prompt and classify it into one or more research modes:

| Signal in prompt | Research mode |
|---|---|
| `"look at this URL"`, `"check this website"`, `"visit..."` | Browser + screenshot |
| `"how does our app do X"`, `"in our project"`, `"in the codebase"` | Codebase grep + `view_file` |
| `"what is the best way to"`, `"best practice for"`, `"search online"` | `search_web` |
| A raw URL with no other context | `read_url_content` first, then fallback |
| Mixed prompt (e.g., `"research Supabase and how our app uses it"`) | Codebase + web combined |

A single prompt may activate multiple modes simultaneously.

---

### Phase 2: Research Execution

Execute research using all applicable modes from Phase 1.

#### Codebase Analysis
1. Identify relevant files and modules from the prompt.
2. Use `grep_search` to trace functions, types, or patterns across the codebase.
3. Use `view_file` to read the identified files and understand the implementation.
4. Trace the full flow — do NOT stop at the first match.

#### Web Search
1. Formulate 1-3 targeted search queries from the user's prompt.
2. Use `search_web` for each query.
3. Read the top 2-3 result URLs using `read_url_content`.
4. Extract key facts, API patterns, migration notes, or warnings.

#### URL Static Fetch
1. Use `read_url_content` on the target URL.
2. If the response is empty, thin (< 200 words), or clearly missing JavaScript-rendered content → fall back to `browser_subagent`.

#### Browser / Screenshot
1. Launch `browser_subagent` with the target URL and explicit instructions:
   - Navigate to the page
   - Extract the relevant documentation, content, or UI state
   - Capture a screenshot if visual context is needed
2. Include any screenshot paths in the findings.

---

### Phase 3: Synthesis & File Generation

1. Read `docs/research/_template.md` using `view_file` to get the canonical section structure.
2. Synthesize all research findings into the following output format:

```
---
title: "<Descriptive Topic Name>"
status: "draft"
date: "YYYY-MM-DD"
tags: ["research", "<relevant-tag>"]
---

# Research: <Topic Name>

> **AI Agent Instructions:** When reading this file, use the "Findings" section to
> understand the context and limitations of the technology, and strictly follow the
> "Implementation Pattern" section when generating code.

## 1. Objective
<Restate the user's research goal precisely in 1-2 sentences.>

## 2. Findings
- **Key Insight 1:** <Description>
- **Key Insight 2:** <Description>
- **Constraints/Limitations:** <What can't be done?>
- **Sources:** <URLs or codebase files referenced>

## 3. Implementation Pattern (For AI to Follow)
<Concrete code or architectural pattern. Must be actionable.>

## 4. Dependencies Needed
- `package-name` (Reason)

## 5. Action Items
- [ ] Step 1
- [ ] Step 2
```

3. **Critical rule:** Section `## 2. Findings` must be non-empty. If research returned no meaningful content, do NOT write the file — report the failure to the user instead.
4. If updating an existing file: merge new findings into the existing sections. Preserve sections that are still valid. Update the frontmatter `status` and `date`.
5. Write or update `docs/research/<topic-slug>.md`.

---

### Phase 4: Halt & Report

After saving the file, print this structured summary to the chat and stop:

```
✅ Research complete → docs/research/<topic-slug>.md

📌 Key Findings:
  • <Finding 1>
  • <Finding 2>
  • <Finding 3>

🔗 Sources Used:
  • <URL or file path 1>
  • <URL or file path 2>

📂 File: docs/research/<topic-slug>.md
```

Do NOT continue with implementation or code generation unless the user explicitly requests it.

---

## 4. Canonical `_template.md` Content

If `docs/research/_template.md` does not exist, create it with exactly this content:

```markdown
---
title: "[Research Topic Name]"
status: "draft" # draft | completed | rejected
date: "YYYY-MM-DD"
tags: ["research"]
---

# Research: [Topic Name]

> **AI Agent Instructions:** When reading this file, use the "Findings" section to understand the context and limitations of the technology, and strictly follow the "Implementation Pattern" section when generating code.

## 1. Objective
What is the primary goal of this research? What specific problem are we trying to solve or what library are we evaluating?

## 2. Findings
*Summarize the data gathered from web research, API documentation, or feasibility studies.*

- **Key Insight 1:** [Description]
- **Key Insight 2:** [Description]
- **Constraints/Limitations:** [What can't be done?]

## 3. Implementation Pattern (For AI to Follow)
*Provide the exact architectural pattern, code structure, or folder location the AI should use when implementing this feature in the codebase.*

## 4. Dependencies Needed
*List any NPM packages, Expo plugins, or permissions that need to be installed/configured.*
- `package-name` (Reason)

## 5. Action Items
- [ ] Step 1 to implement
- [ ] Step 2 to implement
```

---

## 5. Edge Cases & Strict Constraints (CRITICAL)

- **NEVER** write an empty or near-empty `## 2. Findings` section. If research failed, report failure instead of writing a hollow file.
- **NEVER** skip Phase 0. The environment guard is mandatory on every invocation.
- **NEVER** overwrite `docs/research/_template.md` with research output.
- **NEVER** use underscores in the topic slug — always `kebab-case`.
- **NEVER** ask the user to confirm scope if the prompt is clear and classifiable.
- **NEVER** skip checking for an existing file — always scan `docs/research/` first.
- **NEVER** stop at the first web search result. Read at least 2-3 sources.
- **NEVER** use `read_url_content` as the only tool for a URL known to be JS-rendered (e.g., React SPAs, dashboards). Always have the fallback chain ready.

---

## 6. Validation Steps

Future agents executing this skill must confirm:

- [ ] `docs/research/` existence was checked via `list_dir`
- [ ] `docs/research/_template.md` existence was checked independently
- [ ] Topic slug was normalized to `kebab-case` (<= 50 chars)
- [ ] `docs/research/` was scanned for an existing file matching the slug
- [ ] Prompt was classified into at least one research mode
- [ ] At least one research tool was actively invoked (not just planned)
- [ ] `## 2. Findings` section is non-empty before writing the file
- [ ] File was written to `docs/research/<topic-slug>.md`
- [ ] Phase 4 chat summary was printed with findings + file path
- [ ] Execution halted after saving (no unsolicited code generation)
