import fs from "fs";
export const deleteFileIfPresent = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) console.log("File does not exist");
  });
};
