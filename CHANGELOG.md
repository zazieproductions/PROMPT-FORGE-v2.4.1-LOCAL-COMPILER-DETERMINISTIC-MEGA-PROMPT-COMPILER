# Changelog

This changelog records the implementation baseline and repository-level changes. The repository does not currently include Git release tags, a package manifest, or a formal release process. The UI label `v2.5-ASCENSION` and JSON export value `2.5.0` are application metadata, not independently verified release tags.

## [Unreleased]

### Documentation

- Replaced the feature-note README with a repository overview, accurate setup path, project boundaries, and documentation index.
- Added architecture, internal API, user workflow, quality, performance, accessibility, privacy, and static deployment references.
- Added contributor guidance, a non-binding roadmap, and this changelog.
- Corrected overbroad claims around network access, token counts, seed profiling, JSON/JSONL export scope, and unverified test coverage.

## Existing implementation baseline

The checked-in application includes the following behavior, summarized from the source rather than associated with a published release:

- Static, single-file React interface with two prompt composition engines.
- Classical role/domain/Prompt DNA/force-ban compiler and Ascension compiler with 15 archetype packs and five intensity profiles.
- Rule-based intent extraction, structural seed profiling, eight Ascension output modules, and configurable Classical output sections.
- Browser-local presets and seeds using IndexedDB with localStorage fallback.
- Prompt, configuration-snapshot, and seed JSONL downloads, plus clipboard copy.
- Node.js self-test that extracts and validates the Ascension Engine source block.
