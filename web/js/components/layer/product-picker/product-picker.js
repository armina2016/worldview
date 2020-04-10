import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  WithSearch,
  SearchProvider,
} from '@elastic/react-search-ui';
import {
  ModalBody,
  ModalHeader,
} from 'reactstrap';

import ProductPickerHeader from './header';
import {
  onToggle as onToggleAction,
} from '../../../modules/modal/actions';
import BrowseLayers from './browse/browse-layers';
import SearchLayers from './search/search-layers';
import {
  initSearchState as initStateAction,
  saveSearchState as saveSearchStateAction,
} from '../../../modules/product-picker/actions';

/*
 * A scrollable list of layers
 * @class LayerList
 * @extends React.Component
 */
class ProductPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalElement: undefined,
    };
  }

  componentDidMount() {
    const { initState } = this.props;
    initState();
    const modalElement = document.getElementById('layer_picker_component');
    modalElement.classList.add('category-width');
    this.setState({ modalElement });
  }

  componentDidUpdate(prevProps) {
    const { modalElement } = this.state;
    const { mode } = this.props;
    if (prevProps.mode === mode) {
      return;
    }
    if (mode === 'category') {
      modalElement.classList.remove('browse-search-width');
      modalElement.classList.add('category-width');
    }
    if (mode === 'search' || mode === 'measurements') {
      modalElement.classList.remove('category-width');
      modalElement.classList.add('browse-search-width');
    }
  }

  /**
   * Either filter layers with search object or
   * revert to initial state
   * @function runSearch
   * @param e | onChange event object
   */
  // runSearch(searchTerm) {
  //   const {
  //     selectedLayer,
  //     updateProductPickerState,
  //   } = this.props;

  //   let newState;
  //   let newSelectedLayer;

  //   // Search cleared
  //   if (searchTerm.length === 0) {
  //     newState = {
  //       filteredRows: [],
  //       listType: 'category',
  //       inputValue: '',
  //       selectedLayer: null,
  //     };
  //   // Search with terms
  //   } else {
  //     const selectedLayerInResults = selectedLayer
  //       && !!filteredRows.find((layer) => layer.id === selectedLayer.id);

  //     if (filteredRows.length === 1) {
  //       [newSelectedLayer] = filteredRows;
  //     } else if (selectedLayerInResults) {
  //       newSelectedLayer = selectedLayer;
  //     }

  //     // newState = {
  //     //   filteredRows,
  //     //   searchResultRows,
  //     //   numRowsFilteredOut: searchResultRows.length - filteredRows.length,
  //     //   listType: 'search',
  //     //   inputValue: value,
  //     //   selectedLayer: newSelectedLayer,
  //     //   listScrollTop: 0,
  //     // };
  //   }
  //   updateProductPickerState(newState);
  // }

  // toggleFilterByAvailable() {
  // const { inputValue, filterByAvailable, updateProductPickerState } = this.props;
  // updateProductPickerState({ filterByAvailable: !filterByAvailable });
  // this.runSearch(inputValue);
  // }

  render() {
    const {
      closeModal,
      mode,
      searchConfig,
      width,
      browser,
      category,
    } = this.props;

    const { screenHeight } = browser;
    const dialogMargin = 12;
    const tabOffset = mode === 'category' || category === 'featured' ? 38 : 0;
    let headerHeight = mode === 'search' ? 70 : 48;
    let bodyHeight = screenHeight - headerHeight - tabOffset - 100 - dialogMargin;
    if (browser.lessThan.medium) {
      headerHeight = 48;
      bodyHeight = screenHeight - headerHeight - tabOffset;
    }

    console.log('screenHeight', screenHeight);
    console.log('headerHeight', headerHeight);
    console.log('bodyHeight', bodyHeight);
    console.log('------------', bodyHeight);

    return !searchConfig ? null : (
      <SearchProvider config={searchConfig}>
        <WithSearch mapContextToProps={({ filters, searchTerm }) => ({ filters, searchTerm })}>
          {({ filters, searchTerm }) => (
            <>
              <ModalHeader toggle={() => closeModal(filters, searchTerm)}>
                <ProductPickerHeader
                  width={width}
                  toggleFilterByAvailable={this.toggleFilterByAvailable}
                />
              </ModalHeader>
              <ModalBody>
                <div id="layer-modal-content" className="layer-modal-content">
                  {mode !== 'search'
                    ? (
                      <BrowseLayers bodyHeight={bodyHeight} width={width} />
                    )
                    : (
                      <SearchLayers bodyHeight={bodyHeight} width={width} />
                    )}
                </div>
              </ModalBody>
            </>
          )}
        </WithSearch>
      </SearchProvider>
    );
  }
}

ProductPicker.propTypes = {
  browser: PropTypes.object,
  category: PropTypes.object,
  closeModal: PropTypes.func,
  initState: PropTypes.func,
  mode: PropTypes.string,
  screenHeight: PropTypes.number,
  searchConfig: PropTypes.object,
  width: PropTypes.number,
};

const mapDispatchToProps = (dispatch) => ({
  closeModal: (filters, searchTerm) => {
    dispatch(saveSearchStateAction(filters, searchTerm));
    dispatch(onToggleAction());
  },
  initState: () => {
    dispatch(initStateAction());
  },
});

const mapStateToProps = (state) => {
  const {
    browser,
    productPicker,
  } = state;
  const { screenWidth } = browser;
  const width = getModalWidth(screenWidth);
  const {
    mode, category, searchConfig,
  } = productPicker;

  return {
    browser,
    category,
    mode,
    searchConfig,
    width,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductPicker);

const getModalWidth = function(width) {
  const availableWidth = width - width * 0.15;
  const gridItemWidth = 310;
  let sizeMultiplier = Math.floor(availableWidth / gridItemWidth);
  if (sizeMultiplier < 1) {
    sizeMultiplier = 1;
  }
  if (sizeMultiplier > 3) {
    sizeMultiplier = 3;
  }
  const gutterSpace = (sizeMultiplier - 1) * 10;
  const modalPadding = 26;
  return gridItemWidth * sizeMultiplier + gutterSpace + modalPadding;
};
