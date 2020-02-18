import { GeoPoint } from 'src/app/@shared/app-helper';

// http://gis.stackexchange.com/questions/25877/how-to-generate-random-locations-nearby-my-location

export function getRandomLatLngNearby(original_lat: number, original_lng: number): GeoPoint {
  const radius = 0.08985; // = 5 km
  const double = 2;

  const y0 = original_lat;
  const x0 = original_lng;
  const u = Math.random();
  const v = Math.random();
  const w = radius * Math.sqrt(u);
  const t = double * Math.PI * v;
  const x = w * Math.cos(t);
  const y1 = w * Math.sin(t);
  const x1 = x / Math.cos(y0);

  return { lat: y0 + y1, lng: x0 + x1 };
}
