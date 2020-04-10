import OverviewMap from 'ol/control/OverviewMap';
import OlView from 'ol/View';
import * as olProj from 'ol/proj';
import OlLineString from 'ol/geom/LineString';
import Cache from 'cachai';
import OlFeature from 'ol/Feature';
import OlVectorLayer from 'ol/layer/Vector';
import OlVectorSource from 'ol/source/Vector';
import OlFill from 'ol/style/Fill';
import OlText from 'ol/style/Text';
import OlStyle from 'ol/style/Style';
import { getLine, getTextVectorLayer } from './util';
import util from '../util/util';

const font = '13px Open Sans Bold Arial, Unicode MS Bold';

const getStyle = (text, isLeft) => new OlStyle({
  text: new OlText({
    textAlign: isLeft ? 'right' : 'left',
    font,
    text, // dateStr,
    fill: new OlFill({ color: 'white' }),
    // offsetY: 10,
    // baseline: 'middle',
    offsetX: isLeft ? -10 : 10,
  }),
});

export function getDatelineTextStyle(feature) {
  const leftText = feature.get('leftText');
  const rightText = feature.get('rightText');
  return [getStyle(leftText, true), getStyle(rightText, false)];
}

function createTextVectorLayer(source) {
  return new OlVectorLayer({
    source,
    zIndex: Infinity,
    wrapX: false,
    opacity: 1,
    style: getDatelineTextStyle,
  });
}
function createFeatureForText(date, x) {
  return new OlFeature({
    geometry: new OlLineString([[x, 300], [x, -300]]),
    leftText: util.toISOStringDate(util.dateAdd(date, 'day', 1)),
    rightText: util.toISOStringDate(date),
  });
}

function createTextLayers(date, x1, x2) {
  const dateLayerleft = getTextVectorLayer(
    [[x1, 300], [x1, -300]],
    [
      util.toISOStringDate(util.dateAdd(date, 'day', 1)),
      util.toISOStringDate(date),
    ],
  );
  const dateLayerRight = getTextVectorLayer(
    [[x2, 300], [x2, -300]],
    [
      util.toISOStringDate(date),
      util.toISOStringDate(date, 'day', -1),
    ],
  );
  return [dateLayerleft, dateLayerRight];
}

export function getOverviewControl(def, date, projCRS, createLayer) {
  const minimapLineLayer1 = getLine([[-180, 300], [-180, -300]], 4, 'white', 0, [2, 5]);
  const minimapLineLayer2 = getLine([[180, 300], [180, -300]], 4, 'white', 0, [2, 5]);
  const dateLayers = createTextLayers(date, -180, 180);
  const textLayerSource = new OlVectorSource({
    features: [
      createFeatureForText(date, -180),
      createFeatureForText(util.dateAdd(date, 'day', -1), 180),
    ],
    wrapX: false,
  });
  const textLayer = createTextVectorLayer(textLayerSource);
  // const dateLayerLeft1 = getTextVectorLayer([[-540, 300], [-540, -300]], dateLayerArray[0]);
  // const dateLayerRight1 = getTextVectorLayer([[540, 300], [540, -300]], dateLayerArray[1]);

  const backgroundLayer = createLayer(def, {
    matrixIds: [2, 3, 4, 5, 6, 7, 8],
    resolutions: [0.140625, 0.0703125, 0.03515625, 0.017578125, 0.0087890625, 0.00439453125, 0.002197265625],
    date,
    matrixLimit: '500m',
    extent: [-180, -90, 180, 90],
    isOverview: true,
  });
  backgroundLayer.setVisible(true);
  const map = new OverviewMap({
  // see in overviewmap-custom.html to see the custom CSS used
    className: 'ol-overviewmap ol-custom-overviewmap',
    layers: [
      minimapLineLayer1,
      minimapLineLayer2,
      backgroundLayer,
      textLayer,
    ],
    view: new OlView({
      projection: olProj.get(projCRS),
      resolutions: [1],
    }),

    collapseLabel: '\u00BB',
    label: '\u00AB',
    collapsed: false,

  });
  map.cache = new Cache();
  map.cache.setItem(`${util.toISOStringDate(date)}_-180_180`, dateLayers);
  // map.updateDateExtents = (newExtent) => {
  //   createTextLayers(date, x1, x2);
  //   this.addLayer();
  // };
  // map.updateDate = (newDate, newExtent) => {
  //   dateLayerLeft.setStyle([getDatelineTextStyle(util.toISOStringDate(util.dateAdd(date, 'day', 1)), true), getDatelineTextStyle(util.toISOStringDate(date), false)]);
  //   dateLayerLeft1.setStyle([getDatelineTextStyle(util.toISOStringDate(util.dateAdd(date, 'day', 2)), true), getDatelineTextStyle(util.dateAdd(date, 'day', 1, false))]);

  //   dateLayerRight.setStyle([getDatelineTextStyle(util.toISOStringDate(date), true), getDatelineTextStyle(util.toISOStringDate(util.dateAdd(date, 'day', -1)), false)]);
  //   dateLayerRight1.setStyle([getDatelineTextStyle(util.toISOStringDate(util.dateAdd(date, 'day', -1)), true), getDatelineTextStyle(util.dateAdd(date, 'day', -2, false))]);
  // };
  return map;
}
