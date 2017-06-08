/*
    desc:jQuery模拟签名
    author:hyf
    date:2012-11-08
*/
;$.fn.mySign = function (options) {
    var _s = $.extend({
        img: '',
        width:80,
        height:35,
        offset:8,           //边界值
        callBack: null
    }, options || {});

    var _parent = $(this).addClass('zsign');
    var range = {
        minX: _s.offset,
        minY: _s.offset,
        maxX: _parent.width() - _s.width - _s.offset - 18,      //扣去2个padding=8px以及2个边框1px
        maxY: _parent.height() - _s.height - _s.offset - 18
    };

  var _btnPanel = $("<div class='panel qm' style='margin-top:10px'><button class='btn add' >签名</button><button class='btn cancel'>关 闭</button></div>").appendTo($(".sc"));
    var _html = "<div class='sign' style='height:" + _s.height + "px;width:" + _s.width + "px;top:" + _s.offset + "px;left:" + _s.offset + "px'><img src='" + _s.img + "' draggable='false'/><button class='btn ok' >确定</button><button class='btn del' >删除</button></div>";


    var _add = $('.add', _btnPanel).click(function (e) {
        _add.attr('disabled', 'disabled');
        var sign = $(_html).appendTo(_parent);
        $('.ok', sign).click(function () {
            //确定签名
            sign.addClass('ok').off('mousedown').find('.btn').remove();
            _add.removeAttr('disabled');
            if (_s.callBack) {
                _s.callBack.call(this, { img: _s.img, top: parseInt(sign.css('top')), left: parseInt(sign.css('left')) });
            }
        });
        $('.del', sign).click(function () {
            //取消签名
            sign.remove();
            _add.removeAttr('disabled');
        });

        //绑定移动事件
        sign.on('mousedown', function (e) {
            sign.data('x', e.clientX);
            sign.data('y', e.clientY);
            var position = sign.position();
            $(document).on('mousemove', function (e1) {
                var x = e1.clientX - sign.data('x') + position.left;
                var y = e1.clientY - sign.data('y') + position.top;
                x = x < range.minX ? range.minX : x;
                x = x > range.maxX ? range.maxX : x;
                y = y < range.minY ? range.minY : y;
                y = y > range.maxY ? range.maxY : y;

                sign.css({ left: x, top: y });
            }).on('mouseup', function () {
                $(this).off('mousemove').off('mouseup');
            });
        });
    });

	$('.cancel', _btnPanel).click(function () {
        var r = true;
        if (_add.attr('disabled') == 'disabled') {
            if (!confirm("未确定的盖章将被取消，确定要关闭吗？")) {
                r = false;
            }
        }
        if (r) {
            //删除未确定位置的签名
            $('.sign:not(.ok)', _parent).remove();
            _btnPanel.remove();
        }
    });
};