export const reverseGeocode = async (latitude: number, longitude: number) => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`,
      { method: 'GET' },
    );

    const data = await response.json();
    const formattedAddress = data.results[0]?.formatted_address;
    return formattedAddress;
  } catch (error) {
    console.error('Error with reverse geocoding:', error);
  }
};
