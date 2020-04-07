import OverviewMap from 'ol/control/OverviewMap';
import OlView from 'ol/View';
import * as olProj from 'ol/proj';
import { getLine, getTextVectorLayer } from './util';
import util from '../util/util';

function getDateLabelArray (date) {
  return [-180, 180].map((x, i) => {
    const dateArray = i === 0 ? [util.toISOStringDate(util.dateAdd(date, 'day', 1)), util.toISOStringDate(date)] : [util.toISOStringDate(date), util.toISOStringDate(util.dateAdd(date, 'day', -1))];
    return { coordinate: [x, 0], dateArray };
  });
}
export function getOverviewControl(def, date, projCRS, createLayer) {
  const minimapLineLayer1 = getLine([[-180, 300], [-180, -300]], 4, 'red', 0, [2, 5]);
  const minimapLineLayer2 = getLine([[180, 300], [180, -300]], 4, 'red', 0, [2, 5]);
  const dateLayerArray = getDateLabelArray(date);

  const dateLayer = getTextVectorLayer(dateLayerArray);
  console.log(dateLayer);
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
      dateLayer,
    ],
    view: new OlView({
      projection: olProj.get(projCRS),
      resolutions: [1],
    }),

    collapseLabel: '\u00BB',
    label: '\u00AB',
    collapsed: false,
  });
  return map;
}
