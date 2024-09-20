"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _bottomSheet = _interopRequireWildcard(require("@gorhom/bottom-sheet"));
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNativeReanimated = require("react-native-reanimated");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SCREEN_HEIGHT = _reactNative.Dimensions.get('window').height;
const ScrollBottomSheet = /*#__PURE__*/(0, _react.forwardRef)((props, ref) => {
  const {
    componentType,
    renderHandle,
    onSettle,
    animationType,
    animationConfig,
    animatedPosition,
    topInset,
    innerRef,
    enableOverScroll,
    friction,
    contentContainerStyle,
    containerStyle,
    ...rest
  } = props;
  (0, _react.useImperativeHandle)(ref, () => ({
    snapTo
  }));
  const snapPointsLen = props.snapPoints.length;
  const getCurrentIndex = i => {
    if (!i) {
      return snapPointsLen - 1;
    }
    return snapPointsLen - 1 - i;
  };
  const [currentIndex, setCurrentIndex] = (0, _react.useState)(getCurrentIndex(props.initialSnapIndex));
  const reverseSnapPoints = props.snapPoints.map(item => {
    if (typeof item == 'string') {
      let number = parseFloat(item, 10) * SCREEN_HEIGHT / 100;
      let parseItem = parseInt(SCREEN_HEIGHT - number + (typeof topInset == 'number' ? topInset : 0));
      let newItem = parseItem > 0 ? parseItem : 0.01;
      return newItem;
    }
    let parseItem = parseInt(SCREEN_HEIGHT - item);
    let newItem = parseItem > 0 ? parseItem : 0.01;
    return newItem;
  }).reverse();
  const animationTimingConfigs = (0, _bottomSheet.useBottomSheetTimingConfigs)({
    duration: 250,
    ...animationConfig
  });
  const animationSpringConfigs = (0, _bottomSheet.useBottomSheetSpringConfigs)({
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
    ...animationConfig
  });
  const animationConfigs = animationType && animationType == 'spring' ? animationSpringConfigs : animationTimingConfigs;
  // ref
  const bottomSheetRef = (0, _react.useRef)(null);
  const snapTo = index => {
    bottomSheetRef.current.snapToIndex(getCurrentIndex(index), animationConfigs);
  };
  const renderChildren = componentType => {
    switch (componentType) {
      case 'FlatList':
        return /*#__PURE__*/_react.default.createElement(_reactNative.FlatList, _extends({
          contentContainerStyle: {
            contentContainerStyle,
            ...containerStyle
          },
          ref: innerRef,
          data: rest.data,
          keyExtractor: i => i,
          renderItem: rest.renderItem
        }, rest));
        break;
      case 'ScrollView':
        return /*#__PURE__*/_react.default.createElement(_reactNative.ScrollView, _extends({
          contentContainerStyle: {
            contentContainerStyle,
            ...containerStyle
          },
          ref: innerRef
        }, rest), props.children);
        break;
      case 'SectionList':
        return /*#__PURE__*/_react.default.createElement(_reactNative.SectionList, _extends({
          contentContainerStyle: {
            contentContainerStyle,
            ...containerStyle
          },
          ref: innerRef,
          sections: rest.sections,
          keyExtractor: i => i,
          renderSectionHeader: rest.renderSectionHeader,
          renderItem: rest.renderItem
        }, rest));
        break;
      default:
        return /*#__PURE__*/_react.default.createElement(_reactNative.ScrollView, _extends({
          contentContainerStyle: {
            contentContainerStyle,
            ...containerStyle
          },
          ref: innerRef
        }, rest), /*#__PURE__*/_react.default.createElement(_reactNative.Text, null, "Awesome \uD83D\uDD25"));
    }
  };

  // renders
  return /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureHandlerRootView, {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/_react.default.createElement(_bottomSheet.default, {
    ref: bottomSheetRef,
    backgroundStyle: containerStyle,
    snapPoints: reverseSnapPoints,
    index: currentIndex,
    handleComponent: renderHandle,
    onChange: onSettle,
    animationConfigs: animationConfigs,
    animatedPosition: animatedPosition,
    enableOverDrag: enableOverScroll ? true : false,
    overDragResistanceFactor: friction && friction < 1 ? friction * 10 : 2.5,
    enablePanDownToClose: reverseSnapPoints.includes(0.01),
    enableHandlePanningGesture: true
  }, renderChildren(componentType)));
});
const styles = _reactNative.StyleSheet.create({
  contentContainer: {},
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: '#eee'
  }
});
var _default = exports.default = ScrollBottomSheet;
//# sourceMappingURL=index.js.map