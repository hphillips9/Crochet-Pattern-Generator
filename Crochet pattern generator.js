function rgbToHex(rgb) {
    return "#" + rgb.map(x => Math.round(x).toString(16).padStart(2, "0")).join("");
}
function getPixelData(image){
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    canvas.width = image.width
    canvas.height = image.height
    ctx.drawImage(image, 0, 0)

    const pixeldata = ctx.getImageData(0,0,image.width,image.height).data
    let pixels = []
    for (let i = 0; i < pixeldata.length; i+=4){
        pixels.push([pixeldata[i], pixeldata[i+1], pixeldata[i+2], pixeldata[i+3]])
    }
    return pixels
}

document.getElementById("imageInput").addEventListener("change", (event) => {
    const file = event.target.files[0];
    const img = new Image();

    img.onload = () => {
        const pixels = getPixelData(img);
        const numColors = parseInt(document.getElementById("numColors").value) || 5;
        const { centroids, assignments } = kMeans(pixels, numColors);

        const palette = centroids.map(rgbToHex);

        // Update color palette on the page
        document.getElementById("colorPalette").innerHTML = "Colors: " + palette.join(" ");

        // Generate the pattern using the clusters
        createPattern(img, assignments, centroids);
    };
    img.src = URL.createObjectURL(file);
});

function createPattern(image, assignments, centroids) {
    const canvas = document.getElementById("patternCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    let index = 0;
    for (let y = 0; y < image.height; y++) {
        for (let x = 0; x < image.width; x++) {
            const centroid = centroids[assignments[index]];
            ctx.fillStyle = rgbToHex(centroid);
            ctx.fillRect(x, y, 1, 1);
            index++;
        }
    }
}