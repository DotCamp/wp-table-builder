const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

const archive = archiver("zip", {
    zlib: { level: 9 },
});

const output = fs.createWriteStream(
    path.join(__dirname, "wp-table-builder.zip")
);

archive.pipe(output);

const ignoreList = fs.readFileSync("zip_ignore.txt", "utf-8").split("\n");

console.log("Creating plugin zip...");

archive.glob("**/!(*.css.map|*.js.map)", {
    ignore: ignoreList,
});

archive.finalize();

output.on("close", () => {
    console.log("Plugin zip wp-table-builder.zip created");
});

archive.on("error", (err) => {
    console.error("Error creating archive:", err);
});
