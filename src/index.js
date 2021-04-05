import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import paletteText from "./palette.txt";
import paints from "./paints";
import Color from "colorjs.io";
import {octree} from "d3-octree";

let paletteArr = [...paletteText
    .split("\n")
    .map(p =>
        p
            .trim()
            .replaceAll(/(\s+)/g, ",")
            .split(",")
            .map(b => parseInt(b))
    )];

// console.log(paletteArr.chunk(4));

let palette = paletteArr
    .map(p => p.map(b => b / 255))
    .map((rgb) => new Color("sRGB", rgb).to("lab"));
let paletteOct = octree()
    .addAll(
        palette.map(c => c.coords)
    );

const canvasInput = document.getElementById("canvas-input"),
    canvasOutput = document.getElementById("canvas-output"),
    upload = document.getElementById("upload");
const ctxOutput = canvasOutput.getContext("2d");

let imgData = [],
    progress = document.getElementById("progress");

canvasOutput.width = canvasInput.width = 32;
canvasOutput.height = canvasInput.height = 32;

upload.crossOrigin = "Anonymous";
upload.addEventListener("load", (e) => {
    const ctxInput = canvasInput.getContext("2d");
    ctxInput.drawImage(upload, 0, -2);

    imgData = [...ctxInput.getImageData(
        0,
        0,
        canvasInput.width,
        canvasInput.height
    ).data];
});

document.getElementById('convert').addEventListener("click", () => {
    const processedData = applyPalette(imgData);
    writeOutput(processedData);

    canvasOutput.addEventListener('click', colorPicker);
});

//https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
function colorPicker(event) {
    let scale = canvasOutput.width / canvasOutput.getBoundingClientRect().width;
    var x = Math.floor(event.layerX * scale);
    var y = Math.floor(event.layerY * scale);
    var pixel = ctxOutput.getImageData(x, y, 1, 1);
    var data = pixel.data;

    let found = paletteArr.findIndex(p => p.join() === [data[0], data[1], data[2]].join());
    console.log([x,y], paints[Math.floor(found / 4)], found % 4);
}

function writeOutput(pixels) {
    let outputData = Uint8ClampedArray.from(pixels.map(p => p.to('srgb'))
        .map(c => [...c.coords.map(v => Math.round(v * 255)), 255])
        .flat());
    let nextImageData = new ImageData(outputData, canvasOutput.width, canvasOutput.height);
    ctxOutput.putImageData(nextImageData, 0, 0);
}

function applyPalette(imgData) {
    let outputData = [];

    var t0 = performance.now();
    for (let i = 0; i < imgData.length; i += 4) {
        const color = new Color('srgb', [imgData[i] / 255, imgData[i + 1] / 255, imgData[i + 2] / 255]).to('lab'),
            neighborColor = new Color("lab", paletteOct.find(...color.coords));
        outputData.push(neighborColor);
    }
    var t1 = performance.now();
    console.log("applyPalette finished in " + (t1 - t0).toFixed(2) + " milliseconds.");
    return outputData;
}