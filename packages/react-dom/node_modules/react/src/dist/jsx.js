'use strict';
exports.__esModule = true;
exports.Fragment =
	exports.isValidElement =
	exports.jsxDEV =
	exports.jsx =
		void 0;
var ReactSymbols_1 = require('shared/ReactSymbols');
var ReactElement = function (type, key, ref, props) {
	var element = {
		$$typeof: ReactSymbols_1.REACT_ELEMENT_TYPE,
		type: type,
		key: key,
		ref: ref,
		props: props,
		__mark: 'may'
	};
	return element;
};
exports.jsx = function (type, config) {
	var children = [];
	for (var _i = 2; _i < arguments.length; _i++) {
		children[_i - 2] = arguments[_i];
	}
	var key = null;
	var props = {};
	var ref = null;
	for (var prop in config) {
		var val = config[prop];
		if (prop === 'key') {
			if (val !== undefined) {
				key = val + ''; //变成字符串
			}
			continue;
		}
		if (prop === 'ref') {
			if (val !== undefined) {
				ref = val;
			}
			continue;
		}
		//判断剩下的props是否是config上的，而不是原型上的
		if ({}.hasOwnProperty.call(config, prop)) {
			props[prop] = val;
		}
	}
	var childrenLength = children.length;
	if (childrenLength) {
		//有一个或多个child
		if (childrenLength === 1) {
			props.children = children[0];
		} else {
			props.children = children;
		}
	}
	return ReactElement(type, key, ref, props); //为什么不用new？
};
exports.jsxDEV = function (type, config) {
	var key = null;
	var props = {};
	var ref = null;
	for (var prop in config) {
		var val = config[prop];
		if (prop === 'key') {
			if (val !== undefined) {
				key = val + '';
			}
			continue;
		}
		if (prop === 'ref') {
			if (val !== undefined) {
				ref = val;
			}
			continue;
		}
		//判断剩下的props是否是config上的，而不是原型上的
		if ({}.hasOwnProperty.call(config, prop)) {
			props[prop] = val;
		}
	}
	return ReactElement(type, key, ref, props);
};
function isValidElement(object) {
	return (
		typeof object === 'object' &&
		object !== null &&
		object.$$typeof === ReactSymbols_1.REACT_ELEMENT_TYPE
	);
}
exports.isValidElement = isValidElement;
exports.Fragment = ReactSymbols_1.REACT_FRAGMENT_TYPE;
