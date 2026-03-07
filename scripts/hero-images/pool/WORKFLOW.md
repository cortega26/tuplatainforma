# Hero Image Pool Workflow

This folder contains the semi-automatic hero image pipeline.

The browser automation path through `chatgpt.com/images` is no longer treated as reliable enough for unattended production because of Cloudflare and human-rate-limit gates.

This workflow keeps the deterministic pool, assignment, staging, and apply steps, but replaces the brittle browser step with a manual batch-generation loop.

## Folder Layout

- `manifest.json`: canonical pool definition
- `run-state.json`: current progress/state of imported/generated assets
- `worklist.json`: remaining items in machine-readable form
- `worklist.txt`: remaining items in human-readable form
- `inbox/`: place manually generated images here before import
- `assets/`: canonical imported/generated pool assets

## Core Rule

Do not rename pool IDs or invent filenames.

When generating manually, always save the file using the exact target filename shown in `worklist.txt` or `worklist.json`.

Example:

- `a--afp-pension--0284c7--v1.avif`
- `a--deuda-credito--d97706--v1.avif`

## End-to-End Loop

### 1. Export the remaining queue

Run:

```bash
node scripts/hero-images/export-pool-worklist.mjs
```

This reads `manifest.json`, checks the current files in `assets/`, reconciles them against `run-state.json`, and writes:

- `scripts/hero-images/pool/worklist.json`
- `scripts/hero-images/pool/worklist.txt`

### 2. Generate images manually

Open `scripts/hero-images/pool/worklist.txt`.

For each item:

1. Copy the prompt.
2. Generate the image manually in your preferred tool.
3. Save/download the result using the exact `Save as:` filename shown in the worklist.
4. Put the file into:

```text
scripts/hero-images/pool/inbox/
```

You do not need to process the whole queue at once. Small batches are expected.

### 3. Import the finished files into the pool

Run:

```bash
node scripts/hero-images/import-pool-images.mjs --delete-source
```

What this does:

- reads files from `scripts/hero-images/pool/inbox/`
- validates the `poolId` and variant number against `manifest.json`
- converts each file to `.avif`
- writes the canonical asset into `scripts/hero-images/pool/assets/<poolId>/`
- updates `scripts/hero-images/pool/run-state.json`
- deletes the source file from `inbox/` if `--delete-source` is passed

If you want to keep the original downloaded files in `inbox/`, omit `--delete-source`.

### 4. Refresh the queue

After importing a batch, rerun:

```bash
node scripts/hero-images/export-pool-worklist.mjs
```

This removes completed items from the remaining queue and rewrites the worklist files.

### 5. Stage pool images to article-linked files

When you want to map pool assets back to article slugs:

```bash
node scripts/hero-images/stage-pool-images.mjs
```

This copies selected files into:

```text
scripts/hero-images/downloads/
```

### 6. Postprocess and apply

Once a staged batch is ready:

```bash
node scripts/hero-images/postprocess-images.mjs
node scripts/hero-images/apply-images.mjs --enforce-public-path
```

This updates the published hero images under `public/images/hero/` and article frontmatter references.

## Typical Batch Session

Use this loop:

```bash
node scripts/hero-images/export-pool-worklist.mjs
```

Generate 10 to 20 images manually.

Save them into `scripts/hero-images/pool/inbox/`.

Then run:

```bash
node scripts/hero-images/import-pool-images.mjs --delete-source
node scripts/hero-images/export-pool-worklist.mjs
```

Repeat as needed.

When enough pool coverage exists:

```bash
node scripts/hero-images/stage-pool-images.mjs
node scripts/hero-images/postprocess-images.mjs
node scripts/hero-images/apply-images.mjs --enforce-public-path
```

## Important Behavior

### Existing files are skipped

The exporter only includes missing work. If an asset already exists in `assets/`, it will not be requeued.

If you delete a bad asset from `assets/`, that missing item will reappear in the next exported worklist.

### Run state is persistent

`run-state.json` records imported/completed items. The work exporter also checks whether the referenced file still exists on disk.

### Import is manifest-backed

`import-pool-images.mjs` does not blindly accept arbitrary filenames. The imported `poolId` must exist in `manifest.json`, and the variant must not exceed the configured variant count.

### AVIF is the canonical output

Imported files are normalized to `.avif` before being placed in `assets/`.

## Useful Commands

### Export only the next 20 remaining items

```bash
node scripts/hero-images/export-pool-worklist.mjs --limit 20
```

### Skip ahead in the queue

```bash
node scripts/hero-images/export-pool-worklist.mjs --start-at 20 --limit 20
```

### Import from a different source folder

```bash
node scripts/hero-images/import-pool-images.mjs --source-dir /path/to/folder --delete-source
```

## Current Recommended Operating Mode

Use the browser only for manual image generation, not as the production automation engine.

Treat the deterministic parts of the system as authoritative:

- `manifest.json`
- `run-state.json`
- `worklist.json`
- `worklist.txt`
- `assets/`
- `stage-pool-images.mjs`
- `apply-images.mjs`

## If Something Goes Wrong

### A generated image is wrong

Delete the corresponding file from `assets/<poolId>/`, then rerun:

```bash
node scripts/hero-images/export-pool-worklist.mjs
```

The missing item will reappear in the worklist.

### The file was saved with the wrong name

Rename it to the exact `Save as:` filename from the worklist before importing.

### You want to keep original downloads

Run the importer without `--delete-source`:

```bash
node scripts/hero-images/import-pool-images.mjs
```

### You want to stage only one slug

```bash
node scripts/hero-images/stage-pool-images.mjs --slug your-article-slug
```
