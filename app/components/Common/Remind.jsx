var React = require('react');
var Remind=React.createClass({

    render:function(){
      return (
        <div className='remind'>
          <div className='p1'>温馨提示：请使用Chrome浏览器</div>
          <a href='http://rj.baidu.com/soft/detail/14744.html?ald'><div className='p2'>window系统点击此处下载</div></a>
          <a href='http://rj.baidu.com/soft/detail/25718.html'><div className='p2'>mac系统点击此处下载</div></a>
        </div>
      )
    }
});

module.exports=Remind;
