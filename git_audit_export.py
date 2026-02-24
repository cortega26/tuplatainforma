#!/usr/bin/env python3
"""
git_audit_export.py

Exporta un reporte Markdown con diffs y metadata de commits seleccionados
para auditoría de cambios (rutas/base/breadcrumbs/links).

Uso típico:
  python3 git_audit_export.py --repo . --out audit.md

Opcional:
  python3 git_audit_export.py --base 144f862 --include-range-diff --out audit.md
  python3 git_audit_export.py --commits c466441 21ceaff ... --out audit.md
"""

from __future__ import annotations

import argparse
import datetime as dt
import os
import re
import subprocess
import sys
from typing import List, Optional, Tuple


DEFAULT_SUSPECT_COMMITS = [
    "144f862",  # config: personalizar SITE para TuPlataInforma
    "c466441",  # Fixed path
    "21ceaff",  # Rutas corregidas
    "8a8e04f",  # Corrección en ruta
    "1a56b4c",  # Correción path
    "d555b77",  # Corregidos errores de paginación
    "e59431a",  # Correción de URL
    "c7e270c",  # Update astro.config.mjs
    "c1e4efb",  # Moved deploy to correct folder
]

# Archivos/directorios más relevantes para el problema (reduce ruido)
DEFAULT_PATH_FILTERS = [
    "astro.config.*",
    "src/config.ts",
    "src/pages",
    "src/components",
    "src/layouts",
    "src/utils",
    "package.json",
]

# Patrones que queremos detectar en patches para "banderas rojas"
RED_FLAG_PATTERNS: List[Tuple[str, re.Pattern]] = [
    ("base config", re.compile(r"\bbase\s*:\s*['\"]/[^'\"]+['\"]")),
    ("BASE_URL usage", re.compile(r"import\.meta\.env\.BASE_URL|BASE_URL")),
    ("Astro.site usage", re.compile(r"\bAstro\.site\b")),
    ("SITE.website usage", re.compile(r"SITE\.website")),
    ("hardcoded tuplatainforma", re.compile(r"tuplatainforma")),
    ("href concatenation", re.compile(r"href=\{?`?\$\{?[^}]*BASE[^}]*\}?`?\}?")),
    ("double-slash normalize", re.compile(r"replace\(/\\\/\+\$\/")),
]


def run_git(repo: str, args: List[str]) -> str:
    """Run git command in repo, return stdout, raise on error."""
    cmd = ["git"] + args
    try:
        proc = subprocess.run(
            cmd,
            cwd=repo,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True,
        )
        return proc.stdout
    except subprocess.CalledProcessError as e:
        raise RuntimeError(
            f"git command failed: {' '.join(cmd)}\n"
            f"cwd: {repo}\n"
            f"exit: {e.returncode}\n"
            f"stderr:\n{e.stderr}"
        ) from e


def ensure_repo(repo: str) -> None:
    if not os.path.isdir(repo):
        raise RuntimeError(f"Repo path does not exist: {repo}")
    _ = run_git(repo, ["rev-parse", "--show-toplevel"])  # validate git repo


def md_code_block(content: str, lang: str = "") -> str:
    fence = "```"
    return f"{fence}{lang}\n{content.rstrip()}\n{fence}\n"


def section(title: str, level: int = 2) -> str:
    return f"\n{'#' * level} {title}\n\n"


def filter_hint(paths: List[str]) -> str:
    return " ".join(paths)


def git_show_commit(
    repo: str,
    sha: str,
    path_filters: Optional[List[str]],
    include_patch: bool,
) -> str:
    out = []
    out.append(section(f"Commit {sha}", 2))

    out.append("**Resumen:**\n\n")
    out.append(md_code_block(run_git(repo, ["show", "--no-patch", "--oneline", sha]), "text"))

    out.append("**Archivos tocados:**\n\n")
    name_only_args = ["show", "--name-only", "--pretty=format:", sha]
    if path_filters:
        name_only_args += ["--"] + path_filters
    out.append(md_code_block(run_git(repo, name_only_args), "text"))

    out.append("**Diff stat:**\n\n")
    stat_args = ["show", "--stat", "--pretty=format:", sha]
    if path_filters:
        stat_args += ["--"] + path_filters
    out.append(md_code_block(run_git(repo, stat_args), "text"))

    if include_patch:
        out.append("**Patch:**\n\n")
        patch_args = ["show", sha]
        if path_filters:
            patch_args += ["--"] + path_filters
        patch = run_git(repo, patch_args)
        out.append(md_code_block(patch, "diff"))

        # Red flags
        flags = []
        for label, pat in RED_FLAG_PATTERNS:
            if pat.search(patch):
                flags.append(label)
        out.append("**Red flags detectadas (heurística):**\n\n")
        if flags:
            out.append("- " + "\n- ".join(flags) + "\n")
        else:
            out.append("_Ninguna detectada por patrones simples._\n")

    return "".join(out)


def git_range_diff(
    repo: str,
    base: str,
    head: str,
    path_filters: Optional[List[str]],
) -> str:
    out = []
    out.append(section(f"Diff acumulado {base}..{head}", 2))

    out.append("**Archivos cambiados (name-only):**\n\n")
    args = ["diff", "--name-only", f"{base}..{head}"]
    if path_filters:
        args += ["--"] + path_filters
    out.append(md_code_block(run_git(repo, args), "text"))

    out.append("**Diff stat:**\n\n")
    args = ["diff", "--stat", f"{base}..{head}"]
    if path_filters:
        args += ["--"] + path_filters
    out.append(md_code_block(run_git(repo, args), "text"))

    out.append("**Patch completo:**\n\n")
    args = ["diff", f"{base}..{head}"]
    if path_filters:
        args += ["--"] + path_filters
    patch = run_git(repo, args)
    out.append(md_code_block(patch, "diff"))

    # Red flags
    flags = []
    for label, pat in RED_FLAG_PATTERNS:
        if pat.search(patch):
            flags.append(label)
    out.append("**Red flags detectadas (heurística):**\n\n")
    if flags:
        out.append("- " + "\n- ".join(flags) + "\n")
    else:
        out.append("_Ninguna detectada por patrones simples._\n")

    return "".join(out)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo", default=".", help="Ruta al repo git (por defecto: .)")
    ap.add_argument("--out", default="audit.md", help="Archivo de salida (.md o .txt)")
    ap.add_argument(
        "--commits",
        nargs="*",
        default=None,
        help="Lista de SHAs a auditar (si no se provee, usa una lista sospechosa por defecto)",
    )
    ap.add_argument(
        "--base",
        default=None,
        help="SHA base para diff acumulado (ej: 144f862). Requiere --include-range-diff",
    )
    ap.add_argument(
        "--head",
        default="HEAD",
        help="Ref destino para diff acumulado (por defecto: HEAD)",
    )
    ap.add_argument(
        "--include-range-diff",
        action="store_true",
        help="Incluye diff acumulado base..head",
    )
    ap.add_argument(
        "--no-patch",
        action="store_true",
        help="No incluir patches completos por commit (solo resumen, archivos y stat)",
    )
    ap.add_argument(
        "--no-filters",
        action="store_true",
        help="No filtrar por rutas (incluye todo el commit/diff). Recomendado solo si el repo es pequeño.",
    )
    args = ap.parse_args()

    repo = os.path.abspath(args.repo)
    ensure_repo(repo)

    commits = args.commits if args.commits is not None and len(args.commits) > 0 else DEFAULT_SUSPECT_COMMITS
    include_patch = not args.no_patch
    path_filters = None if args.no_filters else DEFAULT_PATH_FILTERS

    now = dt.datetime.now().isoformat(timespec="seconds")
    toplevel = run_git(repo, ["rev-parse", "--show-toplevel"]).strip()
    head_sha = run_git(repo, ["rev-parse", args.head]).strip()
    branch = run_git(repo, ["rev-parse", "--abbrev-ref", "HEAD"]).strip()

    out = []
    out.append(f"# Repo audit export\n\n")
    out.append(f"- Generated: `{now}`\n")
    out.append(f"- Repo: `{toplevel}`\n")
    out.append(f"- Branch: `{branch}`\n")
    out.append(f"- HEAD: `{head_sha}`\n")
    if path_filters:
        out.append(f"- Path filters: `{filter_hint(path_filters)}`\n")
    else:
        out.append(f"- Path filters: `NONE (full repo diffs)`\n")

    out.append(section("Context snapshot", 2))
    out.append("**git status (short):**\n\n")
    out.append(md_code_block(run_git(repo, ["status", "--porcelain"]), "text"))

    out.append("**Recent history (top 30):**\n\n")
    out.append(md_code_block(run_git(repo, ["log", "--oneline", "-n", "30"]), "text"))

    if args.include_range_diff:
        if not args.base:
            raise RuntimeError("--include-range-diff requiere --base <SHA>")
        out.append(git_range_diff(repo, args.base, args.head, path_filters))

    out.append(section("Per-commit details", 2))
    for sha in commits:
        out.append(git_show_commit(repo, sha, path_filters, include_patch))

    # Write
    out_path = os.path.abspath(args.out)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("".join(out))

    print(f"Wrote audit report: {out_path}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        raise