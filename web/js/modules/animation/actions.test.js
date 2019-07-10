import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as constants from './constants';
import util from '../../util/util';
import {
  onClose,
  play,
  stop,
  toggleLooping,
  toggleComponentGifActive,
  changeStartDate,
  changeEndDate,
  changeStartAndEndDate,
  changeFrameRate,
  onActivate
} from './actions';
import fixtures from '../../fixtures';
const middlewares = [thunk];
const state = fixtures.getState();

describe('Open, play, stop, close and toggle actions', () => {
  test(
    'onClose action returns ' + constants.EXIT_ANIMATION + ' action type',
    () => {
      const expectedAction = {
        type: constants.EXIT_ANIMATION
      };
      expect(onClose().type).toEqual(expectedAction.type);
    }
  );
  test(
    'play action returns ' + constants.PLAY_ANIMATION + ' action type',
    () => {
      const expectedAction = {
        type: constants.PLAY_ANIMATION
      };
      expect(play().type).toEqual(expectedAction.type);
    }
  );
  test(
    'stop action returns ' + constants.STOP_ANIMATION + ' action type',
    () => {
      const expectedAction = {
        type: constants.STOP_ANIMATION
      };
      expect(stop().type).toEqual(expectedAction.type);
    }
  );
  test(
    'toggleLooping action returns ' + constants.TOGGLE_LOOPING + ' action type',
    () => {
      const expectedAction = {
        type: constants.TOGGLE_LOOPING
      };
      expect(toggleLooping().type).toEqual(expectedAction.type);
    }
  );
  test(
    'toggleComponentGifActive action returns ' +
      constants.TOGGLE_GIF +
      ' action type',
    () => {
      const expectedAction = {
        type: constants.TOGGLE_GIF
      };
      expect(toggleComponentGifActive().type).toEqual(expectedAction.type);
    }
  );
});
describe('Animation Datechange actions', () => {
  const now = new Date();
  const then = util.dateAdd(now, 'day', -7);
  test(
    'changeStartDate action returns ' +
      constants.UPDATE_START_DATE +
      ' action type and current date as value',
    () => {
      const expectedAction = {
        type: constants.UPDATE_START_DATE,
        value: now
      };
      const response = changeStartDate(now);
      expect(response.type).toEqual(expectedAction.type);
      expect(response.value).toEqual(now);
    }
  );
  test(
    'changeEndDate action returns ' +
      constants.UPDATE_END_DATE +
      ' action type and current date as value',
    () => {
      const response = changeEndDate(now);
      expect(response.type).toEqual(constants.UPDATE_END_DATE);
      expect(response.value).toEqual(now);
    }
  );
  test(
    'changeStartAndEndDate action returns ' +
      constants.UPDATE_START_AND_END_DATE +
      ' action type and current date as value',
    () => {
      const response = changeStartAndEndDate(then, now);
      expect(response.type).toEqual(constants.UPDATE_START_AND_END_DATE);
      expect(response.startDate).toEqual(then);
      expect(response.endDate).toEqual(now);
    }
  );
});

test(
  'changeFrameRate action returns ' +
    constants.UPDATE_FRAME_RATE +
    ' action type and number value',
  () => {
    const response = changeFrameRate(2);
    expect(response.type).toEqual(constants.UPDATE_FRAME_RATE);
    expect(response.value).toEqual(2);
  }
);
test(
  'onActivate action returns ' +
    constants.OPEN_ANIMATION +
    ' action type and current dateValue',
  () => {
    const mockStore = configureMockStore(middlewares);
    const store = mockStore(state);
    store.dispatch(onActivate());
    const response = store.getActions()[0];
    expect(response.type).toEqual(constants.OPEN_ANIMATION);
    expect(response.date).toEqual(state.date.selected);
  }
);