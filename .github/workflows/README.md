# GitHub Actions Workflows

## Release Workflow

Creates a GitHub release with the packaged extension.

### How to Use:

1. Go to your GitHub repository
2. Click **Actions** tab
3. Select **"Create Release"** workflow
4. Click **"Run workflow"** button
5. Enter version (e.g., `v1.0.0`)
6. Click **"Run workflow"**

### What It Does:

1. ✅ Validates version format (must be vX.Y.Z)
2. 📝 Updates `manifest.json` with new version
3. 📦 Creates ZIP package
4. 🚀 Creates GitHub release with:
   - Release notes
   - ZIP file attachment
   - Automatic tagging
5. 💾 Commits version bump back to repository

### Version Format:

Must be in format: `vX.Y.Z`

Examples:
- ✅ `v1.0.0`
- ✅ `v1.2.3`
- ✅ `v2.0.0`
- ❌ `1.0.0` (missing v prefix)
- ❌ `v1.0` (incomplete)

### After Release:

- Download ZIP from GitHub Releases
- Upload to Chrome Web Store
- Share release link with users
