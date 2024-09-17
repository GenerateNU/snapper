export const missingFieldCasesDiveLog = [
    { field: 'user', value: undefined, message: 'User is required' },
    { field: 'location', value: undefined, message: 'Location is required' },
    { field: 'date', value: undefined, message: 'Date is required' },
];

export const invalidCasesDiveLog = [
    { field: 'user', value: 123, message: 'User is required' },
    { field: 'user', value: 'invalidUserId', message: 'Invalid user ID' },
    { field: 'location', value: 25, message: 'Location is required' },
    { field: 'location', value: { type: "Point", coordinates: [] }, message: 'Coordinates must be an array of two numbers' },
    { field: 'location', value: { type: "InvalidType", coordinates: [40.712776, -74.005974] }, message: 'Location type must be "Point"' },
    { field: 'date', value: 25, message: 'Date is required' },
    { field: 'date', value: 'invalidDate', message: 'Invalid date format' },
    { field: 'time', value: 5, message: 'Time must be a string' },
    { field: 'duration', value: 'stringInsteadOfNumber', message: 'Duration must be a number' },
    { field: 'depth', value: 'stringInsteadOfNumber', message: 'Depth must be a number' }, 
    { field: 'photos', value: [1], message: 'Each photo URL must be a string' },
    { field: 'description', value: 123, message: 'Description must be a string' }
];