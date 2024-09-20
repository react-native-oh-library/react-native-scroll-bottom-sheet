function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useCallback, useRef, forwardRef, useImperativeHandle, useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions, Text, FlatList, SectionList, ScrollView } from 'react-native';
import BottomSheet, { useBottomSheetTimingConfigs, useBottomSheetSpringConfigs } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Easing } from 'react-native-reanimated';
const SCREEN_HEIGHT = Dimensions.get('window').height;
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
  useImperativeHandle(ref, () => ({
    snapTo
  }));
  const snapPointsLen = props.snapPoints.length;
  const getCurrentIndex = i => {
    if (!i) {
      return snapPointsLen - 1;
    }
    return snapPointsLen - 1 - i;
  };
  const [currentIndex, setCurrentIndex] = useState(getCurrentIndex(props.initialSnapIndex));
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
  // ref
  const bottomSheetRef = useRef(null);
  const snapTo = index => {
    bottomSheetRef.current.snapToIndex(getCurrentIndex(index), animationConfigs);
  };
  const renderChildren = componentType => {
    switch (componentType) {
      case 'FlatList':
        return /*#__PURE__*/React.createElement(FlatList, _extends({
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
        return /*#__PURE__*/React.createElement(ScrollView, _extends({
          contentContainerStyle: {
            contentContainerStyle,
            ...containerStyle
          },
          ref: innerRef
        }, rest), props.children);
        break;
      case 'SectionList':
        return /*#__PURE__*/React.createElement(SectionList, _extends({
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
        return /*#__PURE__*/React.createElement(ScrollView, _extends({
          contentContainerStyle: {
            contentContainerStyle,
            ...containerStyle
          },
          ref: innerRef
        }, rest), /*#__PURE__*/React.createElement(Text, null, "Awesome \uD83D\uDD25"));
    }
  };

  // renders
  return /*#__PURE__*/React.createElement(GestureHandlerRootView, {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(BottomSheet, {
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