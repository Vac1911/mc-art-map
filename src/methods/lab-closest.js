import {octree} from "d3-octree";
import Color from "colorjs.io";

export default function labClosest(imgData, paletteArr) {
    const paletteOct = octree()
        .addAll(
            paletteArr.map(p => p.map(b => b / 255))
                .map(rgb => new Color("sRGB", rgb).to("lab"))
                .map(c => c.coords)
        );
    let outputData = [];

    const t0 = performance.now();
    for (let i = 0; i < imgData.length; i += 4) {
        const color = new Color('srgb', [imgData[i] / 255, imgData[i + 1] / 255, imgData[i + 2] / 255]).to('lab'),
            neighborColor = new Color("lab", paletteOct.find(...color.coords));
        outputData.push(neighborColor);
    }
    const t1 = performance.now();
    console.log("labClosest finished in " + (t1 - t0).toFixed(2) + " milliseconds.");
    return outputData;
}
