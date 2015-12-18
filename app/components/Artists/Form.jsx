'use strict';
var React = require('react');
var UpAvatar = require('../Common/UpAvatar.jsx');
var TextareaAutosize = require('../Common/TextareaAutosize.jsx');

var Form = React.createClass({

  /**
   * 状态值初始化
   * @returns {{}}
   */
  getInitialState: function () {
    return this.props.data;
  },

  /**
   * 处理变化事件
   * @param evt
   */
  handleChange: function (evt) {
    this.state[evt.target.name] = evt.target.value;
    this.setState(this.state);
  },

  /**
   * 处理图片上传后设置State中得Photo
   */
  handlePhotoUpload: function () {
    var photo = this.refs.photo.getValue();
    this.state['photo'] = photo.src;
    this.state['resource_id'] = photo.resource_id;
    this.setState(this.state);
  },

  /**
   * 获取表单的值
   * @returns {*}
   */
  getValue: function () {
    return this.state;
  },

  /**
   * 接收属性进行state赋值
   * @param props
   */
  componentWillReceiveProps: function (props) {
    this.setState(props.data);
  },

  /**
   * 显示界面
   * @returns {XML}
   */
  render: function () {
    var data = this.state;
    return (
      <div className='show-wrap'>
        <div className='edit-wrap'>
          <div className='edit-form card clearfix'>
            <div className='edit-left'>
              <UpAvatar ref="photo" src={data['photo']} type="artist_photo" uploadComplete={this.handlePhotoUpload}/>
            </div>
            <div className='edit-right'>
              <div className='form-group'>
                <p className='form-control-static'>{window.lang.ar_name}</p>
                <input className='form-control' name='name' onChange={this.handleChange} placeholder={window.lang.ar_editname} type='text' value={data.name}/>
              </div>
              <div className='form-group'>
                <p className='form-control-static'>{window.lang.ar_gender}</p>
                <span className='radio'>
                  <label>
                    <input checked={data.gender == '1'} name={'gender'} onChange={this.handleChange} type='radio' value={'1'}/>{window.lang.ar_male}</label>
                </span>
                <span className='radio'>
                  <label>
                    <input checked={data.gender == '2'} name='gender' onChange={this.handleChange} type='radio' value={'2'}/>{window.lang.ar_female}</label>
                </span>
              </div>
              <div className='form-group'>
                <p className='form-control-static'>{window.lang.ar_country}</p>
                <input className='form-control' name="country" onChange={this.handleChange} placeholder={window.lang.ar_editcountry} type='text' value={data.country}/>
              </div>
              <div className='form-group'>
                <p className='form-control-static'>{window.lang.ar_intro}</p>
                <TextareaAutosize className='form-control' name="desc" onChange={this.handleChange} placeholder={window.lang.ar_editintro} type='text' value={(data.desc || '').split(/\\n|\\r/).join('\n')}></TextareaAutosize>
              </div>
              <div className='text-right'>
                {this.props.children}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Form;
