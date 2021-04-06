import {octree} from "d3-octree";
import Color from "colorjs.io";

const _color = new Color('srgb', [0.1333, 0.1333, 0.1333]).to('lch').coords

function hueWeighted(imgData, paletteArr, hueWeight) {
    function weightedLch(coords) {
        let [l, c, h] = coords.map(v => isNaN(v) ? 0 : v)
        return [ l / 100, c / 150, h / 360 * hueWeight]
    }

    function unweightedLch(coords) {
        let [l, c, h] = coords.map(v => isNaN(v) ? 0 : v)
        return [ l * 100, c * 150, h / hueWeight * 360]
    }

    const paletteOct = octree()
        .addAll(
            paletteArr.map(p => p.map(b => b / 255))
                .map(rgb => new Color("sRGB", rgb).to('lch'))
                .map(c => weightedLch(c.coords))
        );
    let outputData = [];

    const t0 = performance.now();
    for (let i = 0; i < imgData.length; i += 4) {
        const color = new Color('srgb', [imgData[i] / 255, imgData[i + 1] / 255, imgData[i + 2] / 255]).to('lch'),
            neighborColor = paletteOct.find(...weightedLch(color.coords));
        if(neighborColor === undefined || neighborColor.some(v => v === undefined))
            console.log(i / 4, color.coords, [imgData[i] / 255, imgData[i + 1] / 255, imgData[i + 2] / 255].map( v => v.toFixed(4)));
        outputData.push(new Color('lch', unweightedLch(neighborColor)));
    }
    const t1 = performance.now();
    console.log("hueWeightedClosest finished in " + (t1 - t0).toFixed(2) + " milliseconds.");
    return outputData;
}

export function hueSensitiveClosest(imgData, paletteArr) {
    return hueWeighted(imgData, paletteArr, 2);
}

export function hueInsensitiveClosest(imgData, paletteArr) {
    return hueWeighted(imgData, paletteArr, 0.5);
}
