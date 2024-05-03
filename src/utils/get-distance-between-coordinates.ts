export interface Coordinate {
  latitude: number
  longitude: number
}

export function getDistanceBetweenCoordinates(
  from: Coordinate,
  to: Coordinate,
) {
  if (from.latitude === to.latitude && from.longitude === to.longitude) {
    return 0
  }

  const fromRadian = (Math.PI * from.latitude) / 180
  const toRadian = (Math.PI * to.latitude) / 180

  const theta = from.longitude - to.longitude
  const radTheta = (Math.PI * theta) / 180

  let distanceInkilometers =
    Math.sin(fromRadian) * Math.sin(toRadian) +
    Math.cos(fromRadian) * Math.cos(toRadian) * Math.cos(radTheta)

  if (distanceInkilometers > 1) {
    distanceInkilometers = 1
  }

  distanceInkilometers = Math.acos(distanceInkilometers)
  distanceInkilometers = (distanceInkilometers * 180) / Math.PI
  distanceInkilometers = distanceInkilometers * 60 * 1.1515
  distanceInkilometers = distanceInkilometers * 1.609344

  return distanceInkilometers
}
