import React from 'react';

class BrowserUpdate extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className='browser-update-tips'>
        <h4>您正在使用低版本的浏览器！</h4>
        <p>这可能会带来非常严重的安全隐患，并且不利于我们为您提供良好的用户体验。</p>
        <p>为了您的良好浏览体验，请安装以下浏览器：</p>
        <ul className='down-link'>
          <li>
            <a href='http://rj.baidu.com/soft/detail/14744.html?ald'>
              <i className='fa fa-chrome'></i>
              <p className='name'>Chrome浏览器</p>
            </a>
          </li>
          <li>
            <a href='http://www.firefox.com.cn/download/'>
              <i className='fa fa-firefox'></i>
              <p className='name'>Firefox浏览器</p>
            </a>
          </li>
          <li>
            <a href='http://www.opera.com/'>
              <i className='fa fa-opera'></i>
              <p className='name'>Opera浏览器</p>
            </a>
          </li>
        </ul>
      </div>
    );
  }
};

export default BrowserUpdate;
