import Jimp from "jimp";
import fs from "fs";

async function addWatermark(imagePath, outputPath, watermarkText) {
  try {
      // Ellenőrizd, hogy a bemeneti fájl létezik
      if (!fs.existsSync(imagePath)) {
          throw new Error(`Input image file not found at: ${imagePath}`);
      }

      console.log("Reading image:", imagePath);
      const image = await Jimp.read(imagePath);
      console.log("Image successfully loaded.");

      const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
      console.log("Font successfully loaded.");

      const imageWidth = image.bitmap.width;
      const imageHeight = image.bitmap.height;

      console.log(`Image dimensions: ${imageWidth}x${imageHeight}`);

      const watermarkSpacingX = 1000;
      const watermarkSpacingY = 500;

      // Új réteg létrehozása
      const watermarkLayer = new Jimp(imageWidth, imageHeight, 0x00000000);

      for (let y = 0; y < imageHeight; y += watermarkSpacingY) {
          for (
              let x = (y / watermarkSpacingY) % 2 === 0 ? 0 : watermarkSpacingX / 2;
              x < imageWidth;
              x += watermarkSpacingX
          ) {
              watermarkLayer.print(font, x, y, watermarkText);
          }
      }

      watermarkLayer.opacity(0.5);
      image.composite(watermarkLayer, 0, 0);

      console.log("Attempting to write the watermarked image to:", outputPath);
      await image.writeAsync(outputPath); // Az újabb verziókban használd a writeAsync metódust
      console.log("Watermarked image successfully saved!");
  } catch (error) {
      console.error("Error processing image:", error.message);
      throw error;
  }
}

export default addWatermark;