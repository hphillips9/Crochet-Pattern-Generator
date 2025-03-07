function kMeans(pixels, k){
    let centroids = [];
    for (let i = 0; i < k; i++){
        centroids.push(pixels[Math.floor(Math.random() * pixels.length)])
    }
    let assignments = new Array(pixels.length);
    let prevAssignments = new Array(pixels.length);

    let changed = true;
    while (changed) {
        changed = false;

        // Assign each pixel to the nearest centroid
        for (let i = 0; i < pixels.length; i++) {
            let minDist = Infinity;
            let closestCentroid = -1;
            for (let j = 0; j < k; j++) {
                let dist = Math.sqrt(
                    Math.pow(pixels[i][0] - centroids[j][0], 2) +
                    Math.pow(pixels[i][1] - centroids[j][1], 2) +
                    Math.pow(pixels[i][2] - centroids[j][2], 2)
                );
                if (dist < minDist) {
                    minDist = dist;
                    closestCentroid = j;
                }
            }
            assignments[i] = closestCentroid;
        }

        // Update centroids
        let newCentroids = new Array(k).fill().map(() => [0, 0, 0]);
        let count = new Array(k).fill(0);

        for (let i = 0; i < pixels.length; i++) {
            let centroid = assignments[i];
            newCentroids[centroid][0] += pixels[i][0];
            newCentroids[centroid][1] += pixels[i][1];
            newCentroids[centroid][2] += pixels[i][2];
            count[centroid]++;
        }

        for (let j = 0; j < k; j++) {
            newCentroids[j][0] /= count[j];
            newCentroids[j][1] /= count[j];
            newCentroids[j][2] /= count[j];
        }

        // Check if centroids changed
        for (let i = 0; i < k; i++) {
            if (newCentroids[i][0] !== centroids[i][0] || 
                newCentroids[i][1] !== centroids[i][1] || 
                newCentroids[i][2] !== centroids[i][2]) {
                changed = true;
            }
        }

        centroids = newCentroids;
    }

    return { centroids, assignments };
}