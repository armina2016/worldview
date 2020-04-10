import OverviewMap from 'ol/control/OverviewMap';
import OlView from 'ol/View';
import * as olProj from 'ol/proj';
import OlLineString from 'ol/geom/LineString';
import { getLine, getTextVectorLayer, getDatelineTextStyle } from './util';
import util from '../util/util';


function getDateLabelArray (date) {
  return [1, 2].map((x, i) => (i === 0 ? [util.toISOStringDate(util.dateAdd(date, 'day', 1)), util.toISOStringDate(date)] : [util.toISOStringDate(date), util.toISOStringDate(util.dateAdd(date, 'day', -1))]));
}
export function getOverviewControl(def, date, projCRS, createLayer) {
  const dateLayerArray = getDateLabelArray(date);
  const minimapLineLayer1 = getLine([[-180, 300], [-180, -300]], 4, 'white', 0, [2, 5]);
  const minimapLineLayer2 = getLine([[180, 300], [180, -300]], 4, 'white', 0, [2, 5]);
  const dateLayer1 = getTextVectorLayer([[-180, 300], [-180, -300]], dateLayerArray[1]);
  const dateLayer2 = getTextVectorLayer([[180, 300], [180, -300]], dateLayerArray[0]);

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
      dateLayer1,
      dateLayer2,
      backgroundLayer,
    ],
    view: new OlView({
      projection: olProj.get(projCRS),
      resolutions: [1],
    }),

    collapseLabel: '\u00BB',
    label: '\u00AB',
    collapsed: false,

  });
  map.updateDateExtents = (newExtent) => {
    const leftLabels = dateLayer1.getSource().getFeatures()[0];
    const rightLabels = dateLayer1.getSource().getFeatures()[0];
    leftLabels.setGeometry(new OlLineString([[newExtent[0], 300], [newExtent[0], -300]]));
    rightLabels.setGeometry(new OlLineString([[newExtent[1], 300], [newExtent[1], -300]]));
    console.log(leftLabels);
  };
  map.updateDate = (newDate) => {
    const newDateArray = getDateLabelArray(newDate);
    dateLayer1.setStyle([getDatelineTextStyle(newDateArray[1][0], true), getDatelineTextStyle(newDateArray[1][1], false)]);
    dateLayer2.setStyle([getDatelineTextStyle(newDateArray[0][0], true), getDatelineTextStyle(newDateArray[0][1], false)]);
  };
  return map;
}
