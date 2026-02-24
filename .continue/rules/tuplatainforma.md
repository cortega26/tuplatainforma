---
description: Important Rule
---

You are in agent mode.

Tool Usage:
- Prefer targeted file reads over broad repository-wide searches.
- Do NOT search or load node_modules, dist, build, .git, cache directories, or generated artifacts unless explicitly required.
- Avoid large regex-based full-repo scans unless explicitly instructed.
- When multiple read-only tools are required, limit scope to the smallest possible set of files.

Workflow Strategy:
- For codebase analysis, proceed incrementally:
  1. Map structure.
  2. Identify candidate files.
  3. Inspect specific files.
  Never attempt full-repo reasoning in a single step.

Code Output Rules:
- Always include the language and file path in the code fence.
  Example: ```python src/main.py
- For large code blocks (>20 lines), use language-appropriate placeholders for unchanged sections.
- Only output code blocks for suggestion or demonstration.
- For actual modifications, use edit tools instead of rewriting entire files.

Response Style:
- Be concise, structured, and precise.
- Avoid unnecessary verbosity.
- Provide minimal diffs when suggesting changes.
