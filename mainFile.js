const fs = require('fs');

// Function to parse and extract data from the provided JSON file
function parseInput(filePath) {
    const rawData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const { n, k } = rawData.keys;

    if (n < k) {
        console.error('Error: Insufficient data points to determine the coefficients.');
        return null;
    }

    const dataPoints = [];

    // Convert and gather (x, y) pairs from the input JSON
    for (const [x, { value, base }] of Object.entries(rawData)) {
        if (!isNaN(x)) { // Skip keys that aren't numerical
            const decodedValue = convertYValue(value, parseInt(base));
            dataPoints.push({ x: parseInt(x), y: decodedValue });
        }
    }

    return dataPoints;
}

// Function to convert y-values from a specific base to an integer
function convertYValue(encodedValue, base) {
    return parseInt(encodedValue, base);
}

// Function to apply Lagrange interpolation and calculate the constant term
function computeConstantTerm(dataPoints) {
    let constant = 0;

    // Loop through each data point (xi, yi) to build the constant term
    for (let i = 0; i < dataPoints.length; i++) {
        const { x: xi, y: yi } = dataPoints[i];
        let term = yi;

        // Form the Lagrange basis polynomial for the selected point
        for (let j = 0; j < dataPoints.length; j++) {
            if (i !== j) {
                const { x: xj } = dataPoints[j];
                term *= -xj / (xi - xj); // Construct individual term of the interpolation
            }
        }

        // Accumulate the result to get the final constant
        constant += term;
    }

    return constant;
}

// Main function to decode input values and compute the constant
function calculateConstant(filePath) {
    const dataPoints = parseInput(filePath);

    if (!dataPoints) return;

    // Use Lagrange interpolation to determine the constant term
    const constant = computeConstantTerm(dataPoints);
    console.log('The calculated constant term is:', constant);
}

// Example: Execute the function with a sample JSON file
calculateConstant('data1.json');
calculateConstant('data.json');
