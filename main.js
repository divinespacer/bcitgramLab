const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author:
 *
 */

const { unzip, readDir, grayScale } = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");

unzip(zipFilePath, pathUnzipped)
  .then((unzipped) => {
    console.log(unzipped);
    return readDir(pathUnzipped);
  })
  .then((pngList) => {
    return Promise.all(
      pngList.map((pngList) => grayScale(pngList, pathProcessed))
    );
  })
  .then((grayscaleComplete) => console.log("All images gray scaled"))
  .catch((reject) => console.log(reject));

// readDir(pathUnzipped)
//   .then((resolve) => console.log(resolve))
//   .catch((reject) => console.log(reject));
