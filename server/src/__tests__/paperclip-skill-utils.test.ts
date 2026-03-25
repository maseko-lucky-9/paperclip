import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  listPaperclipSkillEntries,
  removeMaintainerOnlySkillSymlinks,
  parseSkillFrontmatter,
  filterSkillsByTags,
} from "@paperclipai/adapter-utils/server-utils";

async function makeTempDir(prefix: string): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), prefix));
}

describe("paperclip skill utils", () => {
  const cleanupDirs = new Set<string>();

  afterEach(async () => {
    await Promise.all(Array.from(cleanupDirs).map((dir) => fs.rm(dir, { recursive: true, force: true })));
    cleanupDirs.clear();
  });

  it("lists runtime skills from ./skills without pulling in .agents/skills", async () => {
    const root = await makeTempDir("paperclip-skill-roots-");
    cleanupDirs.add(root);

    const moduleDir = path.join(root, "a", "b", "c", "d", "e");
    await fs.mkdir(moduleDir, { recursive: true });
    await fs.mkdir(path.join(root, "skills", "paperclip"), { recursive: true });
    await fs.mkdir(path.join(root, ".agents", "skills", "release"), { recursive: true });

    const entries = await listPaperclipSkillEntries(moduleDir);

    expect(entries.map((entry) => entry.name)).toEqual(["paperclip"]);
    expect(entries[0]?.source).toBe(path.join(root, "skills", "paperclip"));
  });

  it("removes stale maintainer-only symlinks from a shared skills home", async () => {
    const root = await makeTempDir("paperclip-skill-cleanup-");
    cleanupDirs.add(root);

    const skillsHome = path.join(root, "skills-home");
    const runtimeSkill = path.join(root, "skills", "paperclip");
    const customSkill = path.join(root, "custom", "release-notes");
    const staleMaintainerSkill = path.join(root, ".agents", "skills", "release");

    await fs.mkdir(skillsHome, { recursive: true });
    await fs.mkdir(runtimeSkill, { recursive: true });
    await fs.mkdir(customSkill, { recursive: true });

    await fs.symlink(runtimeSkill, path.join(skillsHome, "paperclip"));
    await fs.symlink(customSkill, path.join(skillsHome, "release-notes"));
    await fs.symlink(staleMaintainerSkill, path.join(skillsHome, "release"));

    const removed = await removeMaintainerOnlySkillSymlinks(skillsHome, ["paperclip"]);

    expect(removed).toEqual(["release"]);
    await expect(fs.lstat(path.join(skillsHome, "release"))).rejects.toThrow();
    expect((await fs.lstat(path.join(skillsHome, "paperclip"))).isSymbolicLink()).toBe(true);
    expect((await fs.lstat(path.join(skillsHome, "release-notes"))).isSymbolicLink()).toBe(true);
  });
});

describe("parseSkillFrontmatter", () => {
  const cleanupDirs = new Set<string>();

  afterEach(async () => {
    await Promise.all(Array.from(cleanupDirs).map((dir) => fs.rm(dir, { recursive: true, force: true })));
    cleanupDirs.clear();
  });

  it("parses inline tags: [a, b] format", async () => {
    const dir = await makeTempDir("skill-fm-inline-");
    cleanupDirs.add(dir);
    await fs.writeFile(
      path.join(dir, "SKILL.md"),
      "---\nname: test-skill\ndescription: A test skill\ntags: [core, marketing]\n---\n\n# Content",
    );

    const fm = await parseSkillFrontmatter(dir);
    expect(fm.name).toBe("test-skill");
    expect(fm.tags).toEqual(["core", "marketing"]);
  });

  it("parses list-style tags format", async () => {
    const dir = await makeTempDir("skill-fm-list-");
    cleanupDirs.add(dir);
    await fs.writeFile(
      path.join(dir, "SKILL.md"),
      "---\nname: test-skill\ntags:\n  - core\n  - platform\n---\n\n# Content",
    );

    const fm = await parseSkillFrontmatter(dir);
    expect(fm.tags).toEqual(["core", "platform"]);
  });

  it("returns empty tags when no tags field present", async () => {
    const dir = await makeTempDir("skill-fm-notags-");
    cleanupDirs.add(dir);
    await fs.writeFile(path.join(dir, "SKILL.md"), "---\nname: plain-skill\n---\n\n# Content");

    const fm = await parseSkillFrontmatter(dir);
    expect(fm.name).toBe("plain-skill");
    expect(fm.tags).toBeUndefined();
  });

  it("returns empty object when SKILL.md is missing", async () => {
    const dir = await makeTempDir("skill-fm-missing-");
    cleanupDirs.add(dir);

    const fm = await parseSkillFrontmatter(dir);
    expect(fm).toEqual({});
  });
});

describe("filterSkillsByTags", () => {
  const cleanupDirs = new Set<string>();

  afterEach(async () => {
    await Promise.all(Array.from(cleanupDirs).map((dir) => fs.rm(dir, { recursive: true, force: true })));
    cleanupDirs.clear();
  });

  async function createSkillDir(root: string, name: string, tags?: string[]): Promise<string> {
    const dir = path.join(root, name);
    await fs.mkdir(dir, { recursive: true });
    const tagsLine = tags ? `tags: [${tags.join(", ")}]\n` : "";
    await fs.writeFile(
      path.join(dir, "SKILL.md"),
      `---\nname: ${name}\n${tagsLine}---\n\n# ${name}`,
    );
    return dir;
  }

  it("returns all entries when allowTags is empty (backward compat)", async () => {
    const root = await makeTempDir("skill-filter-all-");
    cleanupDirs.add(root);

    await createSkillDir(root, "skill-a", ["core"]);
    await createSkillDir(root, "skill-b", ["marketing"]);

    const entries = [
      { name: "skill-a", source: path.join(root, "skill-a") },
      { name: "skill-b", source: path.join(root, "skill-b") },
    ];

    const result = await filterSkillsByTags(entries, []);
    expect(result).toHaveLength(2);
  });

  it("filters to matching tags only", async () => {
    const root = await makeTempDir("skill-filter-match-");
    cleanupDirs.add(root);

    await createSkillDir(root, "skill-core", ["core"]);
    await createSkillDir(root, "skill-marketing", ["marketing"]);
    await createSkillDir(root, "skill-platform", ["platform"]);

    const entries = [
      { name: "skill-core", source: path.join(root, "skill-core") },
      { name: "skill-marketing", source: path.join(root, "skill-marketing") },
      { name: "skill-platform", source: path.join(root, "skill-platform") },
    ];

    const result = await filterSkillsByTags(entries, ["core", "marketing"]);
    expect(result.map((e) => e.name)).toEqual(["skill-core", "skill-marketing"]);
  });

  it("includes untagged skills as pass-through", async () => {
    const root = await makeTempDir("skill-filter-untagged-");
    cleanupDirs.add(root);

    await createSkillDir(root, "tagged-skill", ["marketing"]);
    await createSkillDir(root, "untagged-skill"); // no tags

    const entries = [
      { name: "tagged-skill", source: path.join(root, "tagged-skill") },
      { name: "untagged-skill", source: path.join(root, "untagged-skill") },
    ];

    const result = await filterSkillsByTags(entries, ["core"]);
    // "core" doesn't match "marketing", but untagged passes through
    expect(result.map((e) => e.name)).toEqual(["untagged-skill"]);
  });
});
