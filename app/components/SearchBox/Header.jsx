var React = require('react');
var dbg = require('debug')('topdmc:SearchBox/Components/Header');

var SEARCH_BUTTON_STATE = {
  ENABLE: window.lang.search,
  DISABLE: window.lang.al_swait,
  SEARCHING: window.lang.searching
}

/*
 * SearchHeader
 */
var Header = React.createClass({

  displayName: 'SearchBoxHeader',

  getInitialState: function(){
    // dbg('getInitialState');
    return {
      text: '',
      searchState: SEARCH_BUTTON_STATE.DISABLE
    };
  },

  getDefaultProps: function(){
    // dbg('getDefaultProps');
    return {
      type: 'Album',
      text: '',
      eventStreamBuilder: null,
      minimalKeywordCount: 1
    }
  },

  componentDidMount: function(){
    // dbg(this.getDOMNode());
    var searchTextInputStream = Kefir
      .fromEvents(document.getElementById('searchbox_input'), 'keyup')
      .map(function(e){ return e.target.value; })
      .skipDuplicates()
      .toProperty('');
    // searchTextInputStream.log('_searchTextInputStream');

    var searchButtonClickStream = Kefir
      .fromEvents(document.getElementById('searchbox_btn'), 'click')
      .map(function(e){ return 1; })
      .skipDuplicates()
      .toProperty('');
    // searchButtonClickStream.log('_searchButtonClickStream');

    var self = this;
    searchTextInputStream
      .filter(function(text){
        return text.length < self.props.minimalKeywordCount;
      })
      .onValue(function(p){
        // dbg('clearSearch', p);
        self.setState({ searchState: SEARCH_BUTTON_STATE.DISABLE });
      });

    this.props.eventStreamBuilder(searchTextInputStream, searchButtonClickStream);
  },

  componentWillReceiveProps: function(nextProps){
    // dbg('componentWillReceiveProps >> args', nextProps);
    var self = this;
    var _searchState = SEARCH_BUTTON_STATE.DISABLE;
    switch(nextProps.state){
      case "DONE":
        _searchState = this.state.text.length >= self.props.minimalKeywordCount ? SEARCH_BUTTON_STATE.ENABLE : SEARCH_BUTTON_STATE.DISABLE;
        break;
      case "SEARCHING":
        _searchState = SEARCH_BUTTON_STATE.SEARCHING;
        break;
      default:
        _searchState = SEARCH_BUTTON_STATE.DISABLE;
    }
    this.setState({ searchState: _searchState });
  },

  _startSearch: function(){
    // dbg('_startSearch', this.props.type + '|' + this.state.text);
    //SearchBoxActions.startSearch(this.state.text);
  },

  _handleSearchTextChange: function(evt){
    // dbg(evt.target.value);
    this.setState({ text: evt.target.value });
  },

  render: function(){
    return (
      <div id="search_box_header" className='search-box-header'>
        <h4 className='title'>{window.lang.al_stype}<b>{this.props.type}</b></h4>
        <div className='input-group'>
          <input
            id="searchbox_input"
            className="form-control"
            placeholder={window.lang.al_scontent}
            type="text"
            value={this.state.text}
            onChange={this._handleSearchTextChange} />
          <div className='input-group-btn'>
            <input
              id="searchbox_btn"
              className='btn btn-default'
              type="button"
              onClick={this._startSearch}
              value={this.state.searchState} />
          </div>
        </div>
      </div>
    );
  }
});

exports = module.exports = Header;
