/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */

const AdmZip = require("adm-zip"),
  fs = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    const zip = new AdmZip(pathIn);
    zip.extractAllToAsync(pathOut, true, (err) => {
      if (err) {
        reject("Zip Extract Failed: " + err);
      } else {
        resolve("Extraction operation complete");
      }
    });
  });
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, pictures) => {
      if (err) {
        reject("Pictures not found: " + err);
      }
      const pngList = [];

      pictures.forEach((item) => {
        if (path.extname(item) === ".png") {
          pngList.push(path.join(dir, item));
        }
      });
      resolve(pngList);
    });
  });
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    colourStream = fs.createReadStream(pathIn);
    colourStream.pipe(new PNG({})).on("parsed", function () {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          let idx = (this.width * y + x) << 2;
          //gray scale
          const gray =
            (this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3;

          this.data[idx] = gray;
          this.data[idx + 1] = gray;
          this.data[idx + 2] = gray;
          this.data[idx + 3] = this.data[idx + 3];
        }
      }
      const grayWrite = fs.createWriteStream(
        path.join(pathOut, path.basename(pathIn))
      );
      this.pack().pipe(grayWrite);
      grayWrite.on("finish", () => {
        resolve(path.basename(pathIn) + " has been gray scaled");
      });
      grayWrite.on("error", (err) => {
        reject("Gray scale write unsuccessful", err);
      });
    });

    colourStream.on("error", (err) => {
      reject("Colour image read unsuccessful: " + err);
    });
  });
};

module.exports = {
  unzip,
  readDir,
  grayScale,
};

// pathIn = "./myfile.zip";
// pathOut = "./extracted";
// readDir(pathOut)
//   .then((resolve) => console.log(resolve))
//   .catch((err) => console.log(err));

// grayScale(
//   "C:\\Users\\David\\Downloads\\ACIT2520\\week6\\starter 6 2\\extracted\\in.png",
//   "grayscaled\\in.png"
// );
