<!-- eslint-disable no-unused-vars -->
<!-- eslint-disable new-cap -->
<template>
  <div class="map-container" id="map-container">
    <div class="LatLng">
    </div>
  </div>

</template>

<script>
import L from 'leaflet'
import 'leaflet-draw'
import { pointA, lines } from '../utils/mapData.js'
// import Wkt from 'wicket'
export default {
  name: 'Home',
  data () {
    return {
      map: null,
      area: null,
      LatLng: {
        lat: 123,
        lng: 456
      },
      drawer: false
    }
  },
  methods: {
    initaMap () {
      // 解決 Icon 無法正確顯示的問題
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('@/assets/images/locate.svg'), // 'leaflet/dist/images/marker-icon.png'
        shadowUrl: require('leaflet/dist/images/marker-shadow.png')
      })

      // 初始化
      this.map = L.map('map-container', { zoomControl: false, drawControl: true }).setView([22.668195, 120.318532], 12)
      // 底圖
      L.tileLayer('https://wmts.nlsc.gov.tw/wmts/EMAP/default/EPSG:3857/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      }).addTo(this.map)
      // 可切換圖層
      const mapbox = L.tileLayer('https://wmts.nlsc.gov.tw/wmts/EMAP/default/EPSG:3857/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      })
      const topo = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      })

      const baseMaps = {
        臺灣通用電子地圖: mapbox,
        'OSM 開放街圖 map': topo
      }

      // line
      const lineStyle = {
        color: '#455852',
        useGradient: true,
        weight: 3
      }
      const lineArr = []

      lines.forEach(e => {
        const data = [e.coordinates[0], e.coordinates[1]]
        lineArr.push(L.polyline(data, lineStyle))
      })

      const linesALL = L.layerGroup(lineArr)

      // point
      const pointArr = []

      pointA.forEach(e => {
        const data = [e.WGS84_y, e.WGS84_x]
        pointArr.push(L.marker(data, {
          icon: L.icon({
            iconUrl: require('./../assets/images/sample.png'),
            iconSize: [12, 12],
            className: 'marker'
          })
        }))
      })

      const pointsA = L.layerGroup(pointArr)
      const overlayMaps = { 線: linesALL, pointA: pointsA }

      // control
      L.control.layers(baseMaps, overlayMaps).addTo(this.map)

      // 自定義 zoom 控件的提示文字
      L.control.zoom({ zoomInTitle: '放大', zoomOutTitle: '縮小' }).addTo(this.map)

      // 加入 Control
      var drawItem = new L.FeatureGroup()
      this.map.addLayer(drawItem)

      const options = {
        // position: 'topright',
        draw: {
          polyline: {
            shapeOptions: {
              color: '#f357a1',
              weight: 2
            }
          }
        },
        edit: {
          featureGroup: drawItem, // REQUIRED!!
          edit: true
        },
        collapsed: true,
        marker: {
          // icon: new MyCustomMarker()
        }
      }

      // 說明文字更改為中文
      // L.drawLocal 要放在 Leaflet.Draw 初始化之前！！！
      this.initDrawTooltip()

      var drawControl = new L.Control.Draw(options)
      this.map.addControl(drawControl)

      // 加入圖層
      this.map.on(L.Draw.Event.CREATED, function (e) {
        var layer = e.layer
        drawItem.addLayer(layer) // 必須將畫完的圖層加入
        // console.log(arguments)
      })
      this.getRadius(drawItem)
      this.getArea(drawItem)
      // 加入比例尺
      L.control.scale({ position: 'bottomright', imperial: false }).addTo(this.map)
      this.getMouseLatLng()
    },
    createIcon (options) {
      return L.icon(options)
    },

    // 改變繪制控件的按鈕文本及提示語
    initDrawTooltip () {
      L.drawLocal = {
        draw: {
          toolbar: {
            actions: {
              title: '取消',
              text: '取消',
              save: {
                title: '保存',
                text: '保存'
              },
              cancel: {
                title: '取消',
                text: '取消'
              },
              clearAll: {
                title: '清除全部',
                text: '清除全部'
              }
            },
            finish: {
              title: '完成繪制',
              text: '完成'
            },
            undo: {
              title: '刪除最後一個點',
              text: '刪除最後一個點'
            },
            buttons: {
              polyline: '線段量測',
              polygon: '繪制多邊形',
              rectangle: '繪制一個矩形',
              circle: '繪制一個圓形',
              marker: '繪制一個標記',
              circlemarker: '繪制一個圓形標記'
            }
          },
          handlers: {
            circle: {
              tooltip: {
                start: '點擊地圖開始繪制'
              },
              radius: '點擊地圖開始繪制'
            },
            circlemarker: {
              tooltip: {
                start: '點擊地圖開始繪制'
              }
            },
            marker: {
              tooltip: {
                start: '點擊地圖開始繪制'
              }
            },
            polygon: {
              tooltip: {
                start: '點擊地圖開始繪制',
                cont: '繼續選擇',
                end: '點擊第一個點以完成繪制'
              }
            },
            polyline: {
              error: '<strong>Error:</strong> shape edges cannot cross!',
              tooltip: {
                start: '點擊地圖開始繪制',
                cont: '繼續選擇',
                end: '點擊最後一個點以完成繪制'
              }
            },
            rectangle: {
              tooltip: {
                start: '點擊地圖開始繪制'
              }
            },
            simpleshape: {
              tooltip: {
                end: 'Release mouse to finish drawing.'
              }
            }
          }
        },
        edit: {
          toolbar: {
            actions: {
              save: {
                title: '保存',
                text: '保存'
              },
              cancel: {
                title: '取消',
                text: '取消'
              },
              clearAll: {
                title: '清除全部',
                text: '清除全部'
              }
            },
            buttons: {
              // edit: '編輯繪製的圖形',
              edit: '編輯線段',
              editDisabled: '暫無繪製的線段可編輯',
              // editDisabled: '暫無繪製的圖形可編輯',
              remove: '刪除線段',
              // remove: '刪除繪製的圖形',
              removeDisabled: '暫無繪製的線段可刪除'
            }
          },
          handlers: {
            edit: {
              tooltip: {
                text: '拖動標記以編輯圖形',
                subtext: '點擊取消以撤消更改'
              }
            },
            remove: {
              tooltip: {
                text: '選中一個繪製的圖形來刪除'
              }
            }
          }
        }
      }
    },

    // 取得半徑和圓心經緯度
    getRadius (drawItem) {
      this.map.on(L.Draw.Event.CREATED, function (e) {
        var layer = e.layer
        var type = e.layerType
        drawItem.addLayer(layer)

        if (type === 'circle') {
          var center = layer.getLatLng()
          var radius = layer.getRadius()
          console.log(`經度: ${center.lng}, 緯度: ${center.lat}`)
          console.log(`半徑: ${radius} (m)`)
        }
      })
    },
    getArea (drawItem) {
      this.map.on(L.Draw.Event.CREATED, function (e) {
        var layer = e.layer
        var type = e.layerType
        // drawItem.addLayer(layer)
        // console.log(type)

        if (type === 'circle') {
          var center = layer.getLatLng()
          var radius = layer.getRadius()
          this.LatLng = center
          console.log(`經度: ${center.lng}, 緯度: ${center.lat}`)
          console.log(`半徑: ${radius} (m)`)
          layer.bindPopup('LatLng: ' + layer.getLatLng()).openPopup()
        } else {
          this.area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0])
          layer.bindPopup(`
            <p class="popup_p">LatLng:${layer.getLatLngs()}</p>
            <p class="popup_p">面積：${L.GeometryUtil.geodesicArea(layer.getLatLngs()[0])}</p>
          `).openPopup()
          // L.popup()
          //   .setContent('面積：' + L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]))
          //   .openOn(this.map)
          console.log('seeArea', this.area)
        }
      })
    },
    // 取得滑鼠位置的座標
    getMouseLatLng () {
      const Position = L.Control.extend({
        _container: null,
        options: {
          position: 'bottomleft'
        },

        onAdd: function (map) {
          var latlng = L.DomUtil.create('div', 'mouseposition')
          this._latlng = latlng
          return latlng
        },

        updateHTML: function (lat, lng) {
          var latlng = lat + ' ' + lng
          // this._latlng.innerHTML = "Latitude: " + lat + "   Longitiude: " + lng;
          this._latlng.innerHTML = 'LatLng: ' + latlng
        }
      })
      this.position = new Position()
      this.map.addControl(this.position)

      this.map.addEventListener('mousemove', (event) => {
        const lat = Math.round(event.latlng.lat * 100000) / 100000
        const lng = Math.round(event.latlng.lng * 100000) / 100000
        this.position.updateHTML(lat, lng)
      }
      )
    },
    // TWD97座標轉換為WGS84座標
    TWD97ToWGS84 ($x, $y) {
      /* eslint-disable no-restricted-properties, no-param-reassign */

      const { pow } = Math
      const M_PI = Math.PI
      const { sin } = Math
      const { cos } = Math
      const { tan } = Math
      const $a = 6378137.0
      const $b = 6356752.314245

      const $lng0 = (121 * M_PI) / 180
      const $k0 = 0.9999
      const $dx = 250000
      const $dy = 0

      const $e = pow(1 - pow($b, 2) / pow($a, 2), 0.5)

      $x -= $dx
      $y -= $dy

      const $M = $y / $k0

      const $mu = $M / ($a * (1.0 - pow($e, 2) / 4.0 - (3 * pow($e, 4)) / 64.0 - (5 * pow($e, 6)) / 256.0))
      const $e1 = (1.0 - pow(1.0 - pow($e, 2), 0.5)) / (1.0 + pow(1.0 - pow($e, 2), 0.5))

      const $J1 = (3 * $e1) / 2 - (27 * pow($e1, 3)) / 32.0
      const $J2 = (21 * pow($e1, 2)) / 16 - (55 * pow($e1, 4)) / 32.0
      const $J3 = (151 * pow($e1, 3)) / 96.0
      const $J4 = (1097 * pow($e1, 4)) / 512.0

      const $fp = $mu + $J1 * sin(2 * $mu) + $J2 * sin(4 * $mu) + $J3 * sin(6 * $mu) + $J4 * sin(8 * $mu)

      const $e2 = pow(($e * $a) / $b, 2)
      const $C1 = pow($e2 * cos($fp), 2)
      const $T1 = pow(tan($fp), 2)
      const $R1 = ($a * (1 - pow($e, 2))) / pow(1 - pow($e, 2) * pow(sin($fp), 2), 3.0 / 2.0)
      const $N1 = $a / pow(1 - pow($e, 2) * pow(sin($fp), 2), 0.5)

      const $D = $x / ($N1 * $k0)

      const $Q1 = ($N1 * tan($fp)) / $R1
      const $Q2 = pow($D, 2) / 2.0
      const $Q3 = ((5 + 3 * $T1 + 10 * $C1 - 4 * pow($C1, 2) - 9 * $e2) * pow($D, 4)) / 24.0
      const $Q4 = ((61 + 90 * $T1 + 298 * $C1 + 45 * pow($T1, 2) - 3 * pow($C1, 2) - 252 * $e2) * pow($D, 6)) / 720.0
      let $lat = $fp - $Q1 * ($Q2 - $Q3 + $Q4)

      const $Q5 = $D
      const $Q6 = ((1 + 2 * $T1 + $C1) * pow($D, 3)) / 6
      const $Q7 = ((5 - 2 * $C1 + 28 * $T1 - 3 * pow($C1, 2) + 8 * $e2 + 24 * pow($T1, 2)) * pow($D, 5)) / 120.0
      let $lng = $lng0 + ($Q5 - $Q6 + $Q7) / cos($fp)

      $lat = ($lat * 180) / M_PI
      $lng = ($lng * 180) / M_PI

      // return {
      //   lat: $lat,
      //   lng: $lng,
      // };
      // console.log([$lat, $lng])
      return [$lat, $lng]

      /* eslint-enable no-restricted-properties, no-param-reassign */
    },
    changeFormat (origin) {
      const arr1 = []
      origin.features.forEach(e => {
        const data = this.TWD97ToWGS84(e.geometry.coordinates[0], e.geometry.coordinates[1])
        arr1.push({ type: 'Feature', geometry: { type: 'Point', coordinates: data } }
        )
      })

      // console.log(arr1)
    },
    filter (list) {
      const result = list.features.filter(e => e.properties.TOWNNAME === '新興區')
      // console.log(result)
      return result
    }
  },
  computed: {
    'LatLng.lat': function () {
      return this.lat + 5
    }
  },
  mounted () {
    this.initaMap()
  }
}
</script>
<style  lang="scss">

.map-container {
  // margin-top: 90px;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

// 解決 leaflet-draw control 顯示問題
.sr-only {
  display: none;
}

.leaflet-top.leaflet-left {
  // 解決出現兩組 Control 的問題（刪掉預設的第一組）
  .leaflet-draw.leaflet-control:nth-child(1) {
    display: none;
  }
}

.leaflet-draw-draw-circlemarker {
  background-image: url('../assets/images/circlemarker.png') !important;
  background-size: 14px !important;
}

.LatLng {
  font-weight: bold;
  font-size: 16px;
  position: absolute;
  bottom: 1%;
  left: 2%;
  z-index: 401;
}

.mouseposition {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 2px 5px;
}

.marker {
  background-color: rgba(255, 255, 255, 0.3);
}

.popup_p {
  font-size: 16px;
}

.leaflet-draw-toolbar {
    .leaflet-draw-edit-edit.leaflet-disabled {
    background-image: url('../assets/images/drawLines-g.svg') !important;
  }

  .leaflet-draw-edit-edit {
    background-image: url('../assets/images/drawLines.svg') !important;
    background-size: 17px !important;
    background-position: 7px 7px !important;

  }

}

.open_btn {
    position: absolute;
    z-index: 1000;
}

</style>
