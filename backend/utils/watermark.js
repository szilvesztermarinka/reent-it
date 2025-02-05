

async function addWatermark(imagePath, outputPath, watermarkText) {
    try {
        const image = await Jimp.read(imagePath);
        await image.writeAsync(outputPath).then(() => console.log("Watermark added successfully"));
        const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);

        const imageWidth = image.bitmap.width;
        const imageHeight = image.bitmap.height;
        const watermarkSpacingX = 1000; // Távolság a vízjelek között vízszintesen
        const watermarkSpacingY = 500; // Távolság a vízjelek között függőlegesen

        const watermarkLayer = new Jimp(imageWidth, imageHeight, 0x00000000); // Transparent background

        for (let y = 0; y < imageHeight; y += watermarkSpacingY) {
            for (let x = (y / watermarkSpacingY) % 2 === 0 ? 0 : watermarkSpacingX / 2; x < imageWidth; x += watermarkSpacingX) {
                watermarkLayer.print(font, x, y, watermarkText);
            }
        }

        // A vízjel áttetszősége
        watermarkLayer.opacity(0.5);

        image.composite(watermarkLayer, 0, 0);

    } catch (error) {
        console.error("Error processing image:", error);
    }
}

export default addWatermark;
