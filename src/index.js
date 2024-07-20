import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import paletteText from "./palette.txt";
import paints from "./paints";
import labClosest from "./methods/lab-closest";
import {hueSensitiveClosest, hueInsensitiveClosest} from "./methods/hue-weighted";
import labNormalizedClosest from "./methods/lab-normalized-closest";
import rgbClosest from "./methods/rgb-closest";
import blockData from "./blockData.json"

let paletteArr = [...paletteText
    .split("\n")
    .map(p =>
        p
            .trim()
            .replaceAll(/(\s+)/g, ",")
            .split(",")
            .map(b => parseInt(b))
    )];

const canvasInput = document.getElementById("canvas-input"),
    upload = document.getElementById("upload");
let imgData = [];


Array.from(document.querySelectorAll('canvas')).forEach( c => {
    c.width = 192;
    c.height = 128;
})

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
    canvasOutput('lab-output', labClosest)
    canvasOutput('lab-normalized-output', labNormalizedClosest)
    canvasOutput('rgb-output', rgbClosest)
    canvasOutput('hue-sensitive-output', hueSensitiveClosest)
    canvasOutput('hue-insensitive-output', hueInsensitiveClosest)
})

function canvasOutput(canvasId, method) {
    const canvas = document.getElementById(canvasId),
        ctx = canvas.getContext("2d");

    
    const processedData = method(imgData, blockData);
    writeOutput(processedData, canvas, ctx);

    
    let findBlock = (color) =>  {
        var hex = color.to('srgb').toString({format: "hex"});
        return blockData.find(block => block.hex == hex);
    }
    var output = processedData.map(color => findBlock(color)?.javaId).join('\n');
    console.log(output)
}

//https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
function colorPicker(event, canvas, ctx) {
    let scale = canvas.width / canvas.getBoundingClientRect().width;
    var x = Math.floor(event.layerX * scale);
    var y = Math.floor(event.layerY * scale);
    var pixel = ctx.getImageData(x, y, 1, 1);
    var data = pixel.data;

    let found = paletteArr.findIndex(p => p.join() === [data[0], data[1], data[2]].join());
    console.log([x,y], paints[Math.floor(found / 4)], found % 4);
}

function writeOutput(data, canvas, ctx) {
    let outputData = Uint8ClampedArray.from(
        data.map(p => p.to('srgb'))
        .map(c => [...c.coords.map(v => Math.round(v * 255)), 255])
        .flat()
    );
    let nextImageData = new ImageData(outputData, canvas.width, canvas.height);
    ctx.putImageData(nextImageData, 0, 0);
}
