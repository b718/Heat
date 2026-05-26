---
name: evaluate-blog-post
description: Review a blog post draft (typically under .blog/) and return structured, actionable feedback across structure, prose, content gaps, and strengths to preserve. Use when the user asks to evaluate, review, critique, or get feedback on a blog post or markdown draft. Do NOT use for general code review, design docs, or READMEs — those have different evaluation criteria.
---

# Evaluate Blog Post

Reviews a blog post draft and produces structured, actionable feedback. Optimized for personal/technical blog posts written in a conversational voice — the kind of draft where the author is still finding the shape.

## When to invoke

The user asks something like:
- "How can this blog post be improved?"
- "Review this draft"
- "What's wrong with this post?"
- "Give me feedback on /path/to/post.md"

## Target file resolution

1. If the user supplies a path, use that.
2. Otherwise use the file currently open in the IDE (look for `ide_opened_file` or `ide_selection` context).
3. If neither is available, ask the user which file to evaluate. Do not guess.

## Process

1. Read the entire target file.
2. Evaluate across the four dimensions below. Skip a dimension only if it genuinely has no findings — don't pad.
3. Output as markdown with clickable file:line references using the format `[filename.md:N](path#LN)`.

## The four dimensions

### 1. Structural issues

Look for:
- **Header typos** (e.g. `TL:DR` instead of `TL;DR`, missing capitalization, inconsistent header levels).
- **Overlapping sections** — two sections making the same point. Flag which one is sharper and suggest merging.
- **Awkward ordering** — e.g. a "Highlights" section buried below less interesting material, or a TL;DR that doesn't actually summarize.
- **Section length imbalance** — a single throwaway paragraph for the post's most original idea, or a three-paragraph wall for a minor point.

### 2. Prose quality

Look for:
- **Spoken-word fillers**: "you know", "kind of", "honestly", "pretty", "actually", "like", "basically", "I mean". Count them across the doc — if any appears 3+ times, flag the pattern.
- **Run-on sentences** longer than ~40 words that could split cleanly.
- **Grammar/typos**: "Its" vs "It's", brand misspellings (e.g. "Vercell" → "Vercel"), missing articles, sentence fragments.
- **Self-deprecation that undercuts the point** ("albeit I'm a rookie", "I don't really know what I'm doing"). Flag — these usually weaken the writing without adding honesty the reader values.
- **Transcript artifacts** — phrases that read like the author was speaking out loud ("And that's kind of what led to…", "And, you know, rather than…").

### 3. Content gaps

Look for:
- **Vague conclusions** — "What's Next" or closing sections that don't commit to anything concrete. Flag and suggest the author add a specific number, date, or threshold (but don't invent one).
- **Underdeveloped strong ideas** — the post's most original concept getting only one paragraph. Suggest what could expand it.
- **Missing CTAs / links** — if the post describes a project or game, is there a link readers can follow?
- **Unexplained jargon** — terms used without context that a general reader would bounce off.

### 4. Strengths to preserve

This is not flattery — it's a guardrail. Identify the 1-3 things the post does *well* so the author doesn't sand them off in a revision pass. Examples:
- Specific, concrete framings (the "users skipping 5 seconds in" example).
- Honest admissions that build trust ("verification will be manual").
- Original ideas with a clear hook ("discovery nodes").

## Output format

Use this structure:

```markdown
Here's targeted feedback on [filename.md](path):

**Structural issues**

- [bullet with [filename.md:N](path#LN) link]

**Prose-level**

- [bullet with line refs]

**Content gaps**

- [bullet]

**Strongest parts to preserve**

- [bullet]
```

Keep each bullet to 1-2 sentences. If a fix would require author input (a specific number, a real URL, a personal anecdote), say so explicitly — don't fabricate.

## Hard rules

- **Don't invent content.** If you suggest the author add "a concrete threshold," don't make one up. Say "if you have a number in mind, drop it here" and leave it to them.
- **Don't auto-edit.** This skill produces feedback only. Apply edits only if the user explicitly says "make these changes" or similar in a follow-up turn.
- **Preserve voice.** Some "filler" is intentional voice. Flag patterns, not every instance. If the conversational tone is clearly deliberate (e.g. the post reads like a journal entry), say so rather than recommending a corporate rewrite.
- **Be specific.** "This paragraph is unclear" is useless. "Line 31 starts mid-sentence — missing 'One'" is useful. Every bullet should point at a specific line or section.
