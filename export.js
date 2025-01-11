/* eslint-disable */

const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const { minimatch } = require("minimatch");

const archive = archiver("zip", {
  zlib: { level: 9 },
});

const output = fs.createWriteStream(
  path.join(__dirname, "wp-table-builder.zip")
);

archive.pipe(output);

const ignoreList = fs
  .readFileSync("zip_ignore.txt", "utf-8")
  .split("\n")
  .map((pattern) => pattern.trim())
  .filter((pattern) => pattern && !pattern.startsWith("#"));

console.log("Creating plugin zip...");

function isIgnored(filePath) {
  let ignored = false;

  ignoreList.forEach((pattern) => {
    if (pattern.startsWith("!")) {
      const positivePattern = pattern.slice(1);
      if (minimatch(filePath, positivePattern, { dot: true })) {
        ignored = false;
      }
    } else {
      if (minimatch(filePath, pattern, { dot: true })) {
        ignored = true;
      }
    }
  });

  return ignored;
}

function addSymlinkToArchive(realPath, relativePath) {
  if (isIgnored(relativePath)) {
    return;
  }
  const stats = fs.lstatSync(realPath);

  if (stats.isDirectory()) {
    fs.readdirSync(realPath).forEach((child) => {
      const childPath = path.join(realPath, child);
      const childRelative = path.join(relativePath, child);
      addSymlinkToArchive(childPath, childRelative);
    });
  } else {
    archive.file(realPath, { name: relativePath });
  }
}

function addToArchive(baseDir, relativePath = "") {
  const fullPath = path.join(baseDir, relativePath);
  if (isIgnored(fullPath)) {
    return;
  }

  try {
    const stats = fs.lstatSync(fullPath);

    if (stats.isSymbolicLink()) {
      const realPath = fs.realpathSync(fullPath);
      const realStats = fs.statSync(realPath);

      if (realStats.isDirectory()) {
        addSymlinkToArchive(realPath, relativePath);
      } else {
        const childRelative = path.relative(baseDir, realPath);
        archive.file(realPath, { name: childRelative });
      }
    } else if (stats.isDirectory()) {
      fs.readdirSync(fullPath).forEach((child) => {
        const childRelative = path.relative(
          baseDir,
          path.join(fullPath, child)
        );
        addToArchive(baseDir, childRelative);
      });
    } else {
      archive.file(fullPath, { name: relativePath });
    }
  } catch (err) {
    console.error(`Error processing ${fullPath}:`, err);
  }
}

addToArchive(__dirname);

archive.finalize();

output.on("close", () => {
  console.log("Plugin zip wp-table-builder.zip created");
});

archive.on("error", (err) => {
  console.error("Error creating archive:", err);
});
