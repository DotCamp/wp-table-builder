const fs = require("fs");
const AdmZip = require("adm-zip");
const path = require("path");

// Create a new AdmZip instance
const zip = new AdmZip();

const ignoreList = fs
    .readFileSync("zip_ignore.txt", "utf-8")
    .split("\n")
    .filter(Boolean)
    .map((ignorePath) => {
        return ignorePath.split('/').join(path.sep);
      })
    .map((ignorePath) => {
        return ignorePath.split('\\').join(path.sep);
      });

const wildcards = ignoreList
    .filter((item) => item.includes("*"))
    .map((item) => item.replaceAll(".", "\\.").replace("*", ".*"));

// Add files and folders to the zip, excluding the ones in the ignore list
const walk = function (folderPath, zipPath) {
    fs.readdirSync(folderPath).forEach((item) => {
        const itemPath = `${folderPath}/${item}`;
        const relativePath = path.join(zipPath, item);

        const matched = wildcards.reduce(
            (acc, pattern) => acc || !!relativePath.match(pattern),
            false
        );

        if (!ignoreList.includes(relativePath) && !matched) {
            if (fs.statSync(itemPath).isFile()) {
                // Read the contents of the file
                const data = fs.readFileSync(itemPath);
                // Add the file to the zip with a different entry name to avoid creating a folder with the same name
                // console.log(relativePath);
                zip.addFile(relativePath, data);
            } else {
                walk(itemPath, relativePath);
            }
        }
    });
};

console.log("Creating plugin zip...")
walk(".", ""); // Start walking from the current directory with an empty zipPath

zip.writeZip("wp-table-builder.zip");
console.log("Plugin zip wp-table-builder.zip created")
