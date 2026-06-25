function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */
import React, { useRef, forwardRef, useImperativeHandle, useState, useMemo, useCallback } from 'react';
import { StyleSheet, Dimensions, Text, FlatList, ScrollView, SectionList, Platform } from 'react-native';
import BottomSheet, { useBottomSheetTimingConfigs, useBottomSheetSpringConfigs } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
const SCREEN_HEIGHT = Dimensions.get('window').height;
const IS_HARMONY = Platform.OS === 'harmony';
const ScrollBottomSheet = /*#__PURE__*/forwardRef((props, ref) => {
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
  const [currentIndex, setCurrentIndex] = useState(() => getCurrentIndex(props.initialSnapIndex));
  const onSettleRef = useRef(onSettle);
  const prevSettleIndexRef = useRef(props.initialSnapIndex);
  onSettleRef.current = onSettle;
  const snapPointsSignature = props.snapPoints.map(point => String(point)).join('|');
  const reverseSnapPoints = useMemo(() => props.snapPoints.map(item => {
    if (typeof item == 'string') {
      const number = parseFloat(item, 10) * SCREEN_HEIGHT / 100;
      const parseItem = parseInt(SCREEN_HEIGHT - number + (typeof topInset == 'number' ? topInset : 0));
      return parseItem > 0 ? parseItem : 0.01;
    }
    const parseItem = parseInt(SCREEN_HEIGHT - item);
    return parseItem > 0 ? parseItem : 0.01;
  }).reverse(), [snapPointsSignature, topInset]);
  const animationTimingConfigs = useBottomSheetTimingConfigs({
    duration: 250,
    ...animationConfig
  });
  const animationSpringConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
    ...animationConfig
  });
  const animationConfigs = animationType && animationType == 'spring' ? animationSpringConfigs : animationTimingConfigs;
  const bottomSheetRef = useRef(null);
  const snapTo = index => {
    bottomSheetRef.current.snapToIndex(getCurrentIndex(index), animationConfigs);
  };
  useImperativeHandle(ref, () => ({
    snapTo
  }));
  const emitOnSettle = userIndex => {
    if (onSettleRef.current && userIndex !== prevSettleIndexRef.current) {
      prevSettleIndexRef.current = userIndex;
      onSettleRef.current(userIndex);
    }
  };
  const handleSheetChange = useCallback(index => {
    if (index < 0) {
      return;
    }
    setCurrentIndex(index);
    emitOnSettle(getUserSnapIndex(index));
  }, []);
  const handleAnimateForSettle = useCallback((fromIndex, toIndex) => {
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
        return /*#__PURE__*/React.createElement(FlatList, _extends({
          contentContainerStyle: mergedContentContainerStyle,
          ref: innerRef
        }, rest));
      case 'ScrollView':
        return /*#__PURE__*/React.createElement(ScrollView, _extends({
          contentContainerStyle: mergedContentContainerStyle,
          ref: innerRef
        }, rest), props.children);
      case 'SectionList':
        return /*#__PURE__*/React.createElement(SectionList, _extends({
          contentContainerStyle: mergedContentContainerStyle,
          ref: innerRef
        }, rest));
      default:
        return /*#__PURE__*/React.createElement(ScrollView, _extends({
          contentContainerStyle: mergedContentContainerStyle,
          ref: innerRef
        }, rest), /*#__PURE__*/React.createElement(Text, null, "Awesome \uD83D\uDD25"));
    }
  };
  return /*#__PURE__*/React.createElement(GestureHandlerRootView, {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(BottomSheet, {
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
const styles = StyleSheet.create({
  contentContainer: {},
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: '#eee'
  }
});
export default ScrollBottomSheet;
//# sourceMappingURL=index.js.map