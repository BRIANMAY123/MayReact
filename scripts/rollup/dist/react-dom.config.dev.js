"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _utils = require("./utils");

var _rollupPluginGeneratePackageJson = _interopRequireDefault(require("rollup-plugin-generate-package-json"));

var _pluginAlias = _interopRequireDefault(require("@rollup/plugin-alias"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var _getPackageJson = (0, _utils.getPackageJson)('react-dom'),
    name = _getPackageJson.name,
    _module = _getPackageJson.module; // react-dom包的路径


var pkgPath = (0, _utils.resolvePkgPath)(name); // react-dom产物路径

var pkgDistPath = (0, _utils.resolvePkgPath)(name, true);
var _default = [// react-dom
{
  input: "".concat(pkgPath, "/").concat(_module),
  output: [{
    file: "".concat(pkgDistPath, "/index.js"),
    name: 'ReactDOM',
    format: 'umd'
  }, {
    file: "".concat(pkgDistPath, "/client.js"),
    name: 'client.js',
    format: 'umd'
  }],
  external: _toConsumableArray(Object.keys(peerDependencies)),
  plugins: [].concat(_toConsumableArray((0, _utils.getBaseRollupPlugins)()), [// webpack resolve alias
  (0, _pluginAlias["default"])({
    entries: {
      hostConfig: "".concat(pkgPath, "/src/hostConfig.ts")
    }
  }), (0, _rollupPluginGeneratePackageJson["default"])({
    inputFolder: pkgPath,
    outputFolder: pkgDistPath,
    baseContents: function baseContents(_ref) {
      var name = _ref.name,
          description = _ref.description,
          version = _ref.version;
      return {
        name: name,
        description: description,
        version: version,
        peerDependencies: {
          react: version
        },
        main: 'index.js'
      };
    }
  })])
}, // react-test-utils
{
  input: "".concat(pkgPath, "/test-utils.ts"),
  output: [{
    file: "".concat(pkgDistPath, "/test-utils.js"),
    name: 'testUtils',
    format: 'umd'
  }],
  external: ['react-dom', 'react'],
  plugins: (0, _utils.getBaseRollupPlugins)()
}];
exports["default"] = _default;