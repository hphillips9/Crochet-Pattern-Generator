function kMeansClustering(pixels, numColors, maxIterations = 10) {
    let centroids = initializeCentroids(pixels, numColors);
    let labels = new Array(pixels.length);

    for (let iter = 0; iter < maxIterations; iter++) {
        // Assign each pixel to the nearest centroid
        for (let i = 0; i < pixels.length; i++) {
            labels[i] = findClosestCentroid(pixels[i], centroids);
        }

        // Update centroids
        let newCentroids = Array(numColors).fill(null).map(() => ({ r: 0, g: 0, b: 0, count: 0 }));

        for (let i = 0; i < pixels.length; i++) {
            let cluster = labels[i];
            newCentroids[cluster].r += pixels[i].r;
            newCentroids[cluster].g += pixels[i].g;
            newCentroids[cluster].b += pixels[i].b;
            newCentroids[cluster].count++;
        }

        for (let i = 0; i < numColors; i++) {
            if (newCentroids[i].count > 0) {
                centroids[i] = {
                    r: Math.round(newCentroids[i].r / newCentroids[i].count),
                    g: Math.round(newCentroids[i].g / newCentroids[i].count),
                    b: Math.round(newCentroids[i].b / newCentroids[i].count)
                };
            }
        }
    }

    return { centroids, labels };
}

function initializeCentroids(pixels, numColors) {
    let centroids = [];
    for (let i = 0; i < numColors; i++) {
        centroids.push(pixels[Math.floor(Math.random() * pixels.length)]);
    }
    return centroids;
}

function findClosestCentroid(pixel, centroids) {
    let minDist = Infinity, bestIndex = 0;
    for (let i = 0; i < centroids.length; i++) {
        let d = distance(pixel, centroids[i]);
        if (d < minDist) {
            minDist = d;
            bestIndex = i;
        }
    }
    return bestIndex;
}

function distance(p1, p2) {
    return Math.sqrt((p1.r - p2.r) ** 2 + (p1.g - p2.g) ** 2 + (p1.b - p2.b) ** 2);
}
