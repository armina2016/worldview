import OlStyle from 'ol/style/Style';
import OlStroke from 'ol/style/Stroke';
import OlVectorLayer from 'ol/layer/Vector';
import OlVectorSource from 'ol/source/Vector';
import OlFeature from 'ol/Feature';
import OlLineString from 'ol/geom/LineString';
import OlPoint from 'ol/geom/Point';
import OlFill from 'ol/style/Fill';
import OlText from 'ol/style/Text';

const ZOOM_DURATION = 250;

/*
 * Setting a zoom action
 *
 * @function self.zoomAction
 * @static
 *
 * @param {Object} map - OpenLayers Map Object
 * @param {number} amount - Direction and
 *  amount to zoom
 * @param {number} duation - length of animation
 * @param {array} center - point to center zoom
 *
 * @returns {void}
 */
export function mapUtilZoomAction(map, amount, duration, center) {
  const zoomDuration = duration || ZOOM_DURATION;
  const centerPoint = center || undefined;
  const view = map.getView();
  const zoom = view.getZoom();
  view.animate({
    zoom: zoom + amount,
    duration: zoomDuration,
    center: centerPoint,
  });
}
export function getActiveLayerGroup(map, layerGroupString) {
  let group = null;
  const array = map.getLayers().getArray();
  for (let i = 0, len = array.length; i < len; i++) {
    const layerGroup = array[i];
    if (layerGroup.get('group') === layerGroupString) {
      group = layerGroup;
      break;
    }
  }
  return group;
}
export function clearLayers(map) {
  const layersArray = map.getLayers().getArray();
  layersArray.forEach((layer) => {
    map.removeLayer(layer);
  });
  return map;
}
function getLineStyle(color, width, lineDash) {
  return new OlStyle({
    stroke: new OlStroke({
      color,
      width,
      lineDash: lineDash || undefined,
    }),
  });
}
export function getLine(coordinateArray, width, color, opacity, lineDash) {
  return new OlVectorLayer({
    source: new OlVectorSource({
      features: [new OlFeature({
        geometry: new OlLineString(coordinateArray),
      })],
    }),
    zIndex: Infinity,
    opacity: opacity || 1,
    wrapX: true,
    style: [getLineStyle('black', width, lineDash), getLineStyle(color, width / 2, lineDash)],
  });
}
function getDatelineTextStyle(feature) {
  const dateArray = feature.get('dateArray');
  const font = '13px Open Sans Bold Arial, Unicode MS Bold';

  return dateArray.map((dateStr, index) => {
    // const util.getTextWidth
    const isLeft = index === 0;
    return new OlStyle({
      text: new OlText({
        textAlign: isLeft ? 'left' : 'right',
        font,
        text: dateStr,
        fill: new OlFill({ color: '#fff' }),
        stroke: new OlStroke({ color: '#000', width: '1px' }),
        offsetX: isLeft ? -10 : 10,
      }),
    });
  });
}
export function getTextVectorLayer(labelArray) {
  return new OlVectorLayer({
    source: new OlVectorSource({
      features: labelArray.map(({ dateArray, coordinate }) => new OlFeature({
        geometry: new OlPoint({ coordinates: [coordinate] }),
        dateArray,
        coordinate,
      })),
    }),
    zIndex: Infinity,
    wrapX: false,
    style: getDatelineTextStyle,
  });
}

/**
 *
 * @param {String} className String of overlay element classNames
 * @param {Array} coordinate Point on map where element should be appended
 * @param {String} text Desired text
 */
// export function getTextOverlay(className, coordinate, text) {
//   const lineCase = document.createElement('div');
//   lineCase.className = className;
//   lineCase.appendChild(document.createTextNode(text));
//   const overlay = new OlOverlay({
//     element: lineCase,
//     stopEvent: false,
//   });
//   overlay.setPosition(coordinate);
//   return overlay;
// }
