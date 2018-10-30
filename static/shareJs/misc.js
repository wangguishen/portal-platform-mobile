var offHeight = document.body.offsetHeight;//获取屏幕的高度

function FullToast(name){//更改全屏显示 加载符样式
	var ment = document.getElementsByClassName(name)
	var child1 = ment[0].firstChild;
	var child2 = ment[0].lastChild;
	//更改隐式背景样式
	child1.className += ' '+"full_toast_bg";
	// 更改定位
	child2.style.top = offHeight/2+'px';
	child2.className += ' '+"full_toast_fixed";
}
function isObjectUtil( x, y ) {//对象是否相等
    if ( x === y ) {
        return true;
    }
    if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) {
        return false;
    }
    if ( x.constructor !== y.constructor ) {
        return false;
    }
    for ( var p in x ) {
        if ( x.hasOwnProperty( p ) ) {
            if ( ! y.hasOwnProperty( p ) ) {
                return false;
            }
            if ( x[ p ] === y[ p ] ) {
                continue;
            }
            if ( typeof( x[ p ] ) !== "object" ) {
                return false;
            }
            if ( ! isObjectUtil( x[ p ],  y[ p ] ) ) {
                return false;
            }
        }
    }
    for ( p in y ) {
        if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) {
            return false;
        }
    }
    return true;
};