document.getElementById("imageUpload").addEventListener("change", handleImageUpload);
document.getElementById("downloadBtn").addEventListener("click", downloadPattern);

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result;
        img.onload = function () {
            processImage(img);
        };
    };
    reader.readAsDataURL(file);
}

function processImage(img) {
    const canvas = document.getElementById("patternCanvas");
    const ctx = canvas.getContext("2d");

    // Resize to 200x200 for a manageable pattern size
    canvas.width = 200;
    canvas.height = 200;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = [];

    for (let i = 0; i < imageData.data.length; i += 4) {
        pixels.push({
            r: imageData.data[i],
            g: imageData.data[i + 1],
            b: imageData.data[i + 2]
        });
    }

    // Apply K-Means Clustering
    let numColors = 6; // Limit to 6 colors for crochet simplicity
    let { centroids, labels } = kMeansClustering(pixels, numColors);

    // Apply clustered colors back to image
    for (let i = 0; i < pixels.length; i++) {
        let cluster = labels[i];
        imageData.data[i * 4] = centroids[cluster].r;
        imageData.data[i * 4 + 1] = centroids[cluster].g;
        imageData.data[i * 4 + 2] = centroids[cluster].b;
    }

    ctx.putImageData(imageData, 0, 0);
}

function downloadPattern() {
    const canvas = document.getElementById("patternCanvas");
    const link = document.createElement("a");
    link.download = "crochet_pattern.png";
    link.href = canvas.toDataURL();
    link.click();
}
