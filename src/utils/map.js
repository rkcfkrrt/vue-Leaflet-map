import 'leaflet/dist/leaflet.css'
import $L from 'leaflet'

// 解决 leaflet 默认 maker 无法显示的问题
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
const DefaultIcon = $L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow
})
$L.Marker.prototype.options.icon = DefaultIcon

const createIcon = options => {
  return $L.icon(options)
}

/**
 * 通过 [x, y] 坐标添加 Maker
 *
 * @param {Object} map
 * @param {Object} latLng
 * @param {Object} options
 */

const createMakerByXY = (map, coordinate, options = {}) => {
  const marker = $L.marker($L.latLng(coordinate[0], coordinate[1]), options)
  marker.addTo(map)
  return marker
}

const createMakerByLatlng = (latlng, options) => {
  return $L.marker(latlng, options)
}

/**
 * 创建线要素
 *
 * @param {Object} map
 * @param {Array} linePath
 * @param {Object} lineOpts
 */

const createPolyline = (map, linePath, lineOpts) => {
  const polyline = $L.polyline(linePath, lineOpts)
  polyline.addTo(map)
  console.log(linePath, lineOpts)
  return polyline
}

/**
 * 创建面要素
 * @param {Object} map
 * @param {Array} areaPath
 * @param {Object} areaOpts
 */

const createPolygon = (map, areaPath, areaOpts) => {
  const polygon = $L.polyline(areaPath, areaOpts)
  polygon.addTo(map)
  return polygon
}

export default {
  createMakerByLatlng,
  createIcon,
  createMakerByXY,
  createPolyline,
  createPolygon
}
