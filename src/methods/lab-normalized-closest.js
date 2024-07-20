import {octree} from "d3-octree";
import Color from "colorjs.io";

export default function labNormalizedClosest(imgData, paletteArr) {
    const paletteOct = octree()
        .addAll(
            paletteArr
                .map(block => new Color("sRGB", [block.color.r / 255, block.color.g / 255, block.color.b / 255]).to('lch'))
                .map(c => normalizeLab(c.coords))
        );
    let outputData = [];

    const t0 = performance.now();
    for (let i = 0; i < imgData.length; i += 4) {
        const color = new Color('srgb', [imgData[i] / 255, imgData[i + 1] / 255, imgData[i + 2] / 255]).to('lab'),
            neighborColor = paletteOct.find(...normalizeLab(color.coords));
        outputData.push(new Color("lab", denormalizeLab(neighborColor)));
    }
    const t1 = performance.now();
    console.log("labClosest finished in " + (t1 - t0).toFixed(2) + " milliseconds.");
    return outputData;
}
function normalizeLab([l, a, b]) {
    return [l / 100, (a + 100) / 200, (b + 100) / 200]
}

function denormalizeLab([l, a, b]) {
    return [l * 100, a * 200 - 100, b * 200 - 100]
}
