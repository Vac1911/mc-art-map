import {octree} from "d3-octree";
import Color from "colorjs.io";

export default function rgbClosest(imgData, paletteArr) {
    const paletteOct = octree()
        .addAll(
            paletteArr
                .map(block => new Color("sRGB", [block.color.r / 255, block.color.g / 255, block.color.b / 255]))
                .map(c => c.coords)
        );
    let outputData = [];

    const t0 = performance.now();
    for (let i = 0; i < imgData.length; i += 4) {
        const color = new Color('srgb', [imgData[i] / 255, imgData[i + 1] / 255, imgData[i + 2] / 255]),
            neighborColor = new Color("srgb", paletteOct.find(...color.coords));
        outputData.push(neighborColor);
    }
    const t1 = performance.now();
    console.log("rgbClosest finished in " + (t1 - t0).toFixed(2) + " milliseconds.");
    return outputData;
}
