"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _bottomSheet = _interopRequireWildcard(require("@gorhom/bottom-sheet"));
var _reactNativeGestureHandler = require("react-native-gesture-handler");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); } /*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */
const SCREEN_HEIGHT = _reactNative.Dimensions.get('window').height;
const IS_HARMONY = _reactNative.Platform.OS === 'harmony';
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
  const snapPointsLen = props.snapPoints.length;
  const getCurrentIndex = i => {
    if (!i) {
      return snapPointsLen - 1;
    }
    return snapPointsLen - 1 - i;
  };
  const getUserSnapIndex = gorhomIndex => {
    if (gorhomIndex < 0) {
      return gorhomIndex;
    }
    return snapPointsLen - 1 - gorhomIndex;
  };
  const [currentIndex, setCurrentIndex] = (0, _react.useState)(() => getCurrentIndex(props.initialSnapIndex));
  const onSettleRef = (0, _react.useRef)(onSettle);
  const prevSettleIndexRef = (0, _react.useRef)(props.initialSnapIndex);
  onSettleRef.current = onSettle;
  const snapPointsSignature = props.snapPoints.map(point => String(point)).join('|');
  const reverseSnapPoints = (0, _react.useMemo)(() => props.snapPoints.map(item => {
    if (typeof item == 'string') {
      const number = parseFloat(item, 10) * SCREEN_HEIGHT / 100;
      const parseItem = parseInt(SCREEN_HEIGHT - number + (typeof topInset == 'number' ? topInset : 0));
      return parseItem > 0 ? parseItem : 0.01;
    }
    const parseItem = parseInt(SCREEN_HEIGHT - item);
    return parseItem > 0 ? parseItem : 0.01;
  }).reverse(), [snapPointsSignature, topInset]);
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
  const bottomSheetRef = (0, _react.useRef)(null);
  const snapTo = index => {
    bottomSheetRef.current.snapToIndex(getCurrentIndex(index), animationConfigs);
  };
  (0, _react.useImperativeHandle)(ref, () => ({
    snapTo
  }));
  const emitOnSettle = userIndex => {
    if (onSettleRef.current && userIndex !== prevSettleIndexRef.current) {
      prevSettleIndexRef.current = userIndex;
      onSettleRef.current(userIndex);
    }
  };
  const handleSheetChange = (0, _react.useCallback)(index => {
    if (index < 0) {
      return;
    }
    setCurrentIndex(index);
    emitOnSettle(getUserSnapIndex(index));
  }, []);
  const handleAnimateForSettle = (0, _react.useCallback)((fromIndex, toIndex) => {
    if (!IS_HARMONY || toIndex < 0 || fromIndex === toIndex) {
      return;
    }
    emitOnSettle(getUserSnapIndex(toIndex));
  }, []);
  const mergedContentContainerStyle = {
    ...contentContainerStyle,
    ...containerStyle
  };
  const renderChildren = componentType => {
    switch (componentType) {
      case 'FlatList':
        return /*#__PURE__*/_react.default.createElement(_reactNative.FlatList, _extends({
          contentContainerStyle: mergedContentContainerStyle,
          ref: innerRef
        }, rest));
      case 'ScrollView':
        return /*#__PURE__*/_react.default.createElement(_reactNative.ScrollView, _extends({
          contentContainerStyle: mergedContentContainerStyle,
          ref: innerRef
        }, rest), props.children);
      case 'SectionList':
        return /*#__PURE__*/_react.default.createElement(_reactNative.SectionList, _extends({
          contentContainerStyle: mergedContentContainerStyle,
          ref: innerRef
        }, rest));
      default:
        return /*#__PURE__*/_react.default.createElement(_reactNative.ScrollView, _extends({
          contentContainerStyle: mergedContentContainerStyle,
          ref: innerRef
        }, rest), /*#__PURE__*/_react.default.createElement(_reactNative.Text, null, "Awesome \uD83D\uDD25"));
    }
  };
  return /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureHandlerRootView, {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/_react.default.createElement(_bottomSheet.default, {
    ref: bottomSheetRef,
    enableDynamicSizing: false,
    backgroundStyle: containerStyle,
    snapPoints: reverseSnapPoints,
    index: currentIndex,
    handleComponent: renderHandle,
    onChange: handleSheetChange,
    onAnimate: IS_HARMONY ? handleAnimateForSettle : undefined,
    animationConfigs: animationConfigs,
    animatedPosition: animatedPosition,
    enableOverDrag: enableOverScroll ? true : false,
    overDragResistanceFactor: friction && friction < 1 ? friction * 10 : 2.5,
    enablePanDownToClose: reverseSnapPoints.includes(0.01),
    enableHandlePanningGesture: true,
    enableContentPanningGesture: true
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