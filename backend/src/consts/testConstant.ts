export const missingFieldCasesDiveLog = [
  { field: 'user', value: undefined, message: 'User is required' },
  { field: 'location', value: undefined, message: 'Location is required' },
  { field: 'date', value: undefined, message: 'Date is required' },
];

export const invalidCasesDiveLog = [
  { field: 'user', value: 123, message: 'Invalid user ID' },
  { field: 'user', value: 'invalidUserId', message: 'Invalid user ID' },
  {
    field: 'location',
    value: { type: 'Point', coordinates: [] },
    message: 'Coordinates must be an array of two numbers',
  },
  {
    field: 'location',
    value: { type: 'InvalidType', coordinates: [40.712776, -74.005974] },
    message: 'Location type must be "Point"',
  },
  { field: 'date', value: 25, message: 'Invalid date format' },
  { field: 'time', value: 5, message: 'Time must be a string' },
  {
    field: 'duration',
    value: 'stringInsteadOfNumber',
    message: 'Duration must be a number',
  },
  {
    field: 'depth',
    value: 'stringInsteadOfNumber',
    message: 'Depth must be a number',
  },
  { field: 'photos', value: [1], message: 'Each photo URL must be a string' },
  { field: 'description', value: 123, message: 'Description must be a string' },
];

export const validSingleFieldUpdate = [
  {
    field: 'location',
    value: { type: 'Point', coordinates: [41.123456, -72.123456] },
  },
  { field: 'date', value: '2024-10-01T12:00:00Z' },
  { field: 'time', value: '12:45' },
  { field: 'duration', value: 90 },
  { field: 'depth', value: 40 },
  { field: 'photos', value: ['https://example.com/shark.jpg'] },
  { field: 'description', value: 'Updated dive log' },
];

export const invalidUpdateCasesDiveLog = [
  {
    field: 'location',
    value: { type: 'Point', coordinates: [] },
    message: 'Coordinates must be an array of two numbers',
  },
  {
    field: 'location',
    value: { type: 'InvalidType', coordinates: [40.712776, -74.005974] },
    message: 'Location type must be "Point"',
  },
  { field: 'date', value: 25, message: 'Invalid date format' },
  { field: 'time', value: 5, message: 'Time must be a string' },
  {
    field: 'duration',
    value: 'stringInsteadOfNumber',
    message: 'Duration must be a number',
  },
  {
    field: 'depth',
    value: 'stringInsteadOfNumber',
    message: 'Depth must be a number',
  },
  { field: 'photos', value: [1], message: 'Each photo URL must be a string' },
  { field: 'description', value: 123, message: 'Description must be a string' },
];
