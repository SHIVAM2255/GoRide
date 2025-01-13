const captainModel = require('../models/captain.model');

module.exports.getAddressCoordinate = async (address) => {
    // Return static coordinates
    return {
        ltd: 28.7041,
        lng: 77.1025
    };
}

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    // Return static distance and time
    return {
        distance: {
            text: "5 km",
            value: 5000 // meters
        },
        duration: {
            text: "15 mins",
            value: 900 // seconds
        }
    };
}

module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }

    // Return static suggestions
    return [
        "Location A, City",
        "Location B, City",
        "Location C, City"
    ];
}

module.exports.getCaptainsInTheRadius = async () => {
    // Get all available captains regardless of location
    const captains = await captainModel.find({
        status: 'active'
    });
    return captains;
};