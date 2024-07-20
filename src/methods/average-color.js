export default function averageColor(imageUrl) {
    return new Promise((resolve) => {
        const img = document.createElement("img");

        img.addEventListener('load', () => {
            let rgb = {r:0,g:0,b:0},
                canvas = document.createElement('canvas'),
                context = canvas.getContext && canvas.getContext('2d'),
                height = canvas.height = img.naturalHeight || img.offsetHeight || img.height,
                width = canvas.width = img.naturalWidth || img.offsetWidth || img.width.Promise,
                i = -4,
                count = 0;

            context.drawImage(img, 0, 0);

            const imageData = context.getImageData(0, 0, width, height);

            while ( (i += 4) < imageData.data.length ) {
                ++count;
                rgb.r += imageData.data[i];
                rgb.g += imageData.data[i+1];
                rgb.b += imageData.data[i+2];
            }

            rgb.r = ~~(rgb.r/count);
            rgb.g = ~~(rgb.g/count);
            rgb.b = ~~(rgb.b/count);

            resolve(rgb);
        });

        
        img.src = imageUrl;
    })
}
