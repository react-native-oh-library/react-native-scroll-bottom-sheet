/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */
import React, {
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useMemo,
  useEffect,
} from 'react';
import {View, StyleSheet, Animated, Dimensions, Text,FlatList,SectionList,ScrollView} from 'react-native';
import BottomSheet, {
  useBottomSheetTimingConfigs,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Easing} from 'react-native-reanimated';
const SCREEN_HEIGHT = Dimensions.get('window').height;
type TimingConfig = {
  duration: number;
  easing: typeof Easing.exp | typeof Easing.inOut;
};
type SpringConfig = {
  damping: number;
  overshootClamping: boolean;
  restDisplacementThreshold: number;
  restSpeedThreshold: number;
  stiffness: number;
};
type PropTypes = {
  componentType: 'FlatList' | 'ScrollView' | 'SectionList';
  snapPoints: Array<string | number>;
  initialSnapIndex: number;
  renderHandle: () => React.ReactNode;
  animationType?: 'timing(default)' | 'spring';
  animationConfig?: TimingConfig | SpringConfig | {};
  animatedPosition?: any;
  topInset?: number;
  innerRef?: React.MutableRefObject<T>;
  friction?: number;
  enableOverScroll?: boolean;
  containerStyle?: any;
};

const ScrollBottomSheet=forwardRef((props: PropTypes,ref)=>{
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
    snapTo,
  }));
  const snapPointsLen = props.snapPoints.length;
  const getCurrentIndex = i => {
    if (!i) {
      return snapPointsLen - 1;
    }
    return snapPointsLen - 1 - i;
  };
  const [currentIndex, setCurrentIndex] = useState(getCurrentIndex(props.initialSnapIndex));
  const reverseSnapPoints = props.snapPoints
    .map(item => {
      if (typeof item == 'string') {
        let number = (parseFloat(item, 10) * SCREEN_HEIGHT) / 100;
        let parseItem=parseInt(
          SCREEN_HEIGHT - number + (typeof topInset == 'number' ? topInset : 0),
        );
        let newItem=parseItem>0?parseItem:0.01;
        return newItem;
      }
      let parseItem=parseInt(SCREEN_HEIGHT - item);
      let newItem=parseItem>0?parseItem:0.01;
      return newItem;
    })
    .reverse();
  const animationTimingConfigs = useBottomSheetTimingConfigs({
    duration: 250,
    ...animationConfig,
  });

  const animationSpringConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
    ...animationConfig,
  });
  const animationConfigs=animationType && animationType == 'spring'? animationSpringConfigs: animationTimingConfigs;
  // ref
  const bottomSheetRef = useRef(null);
  const snapTo = index => {
    bottomSheetRef.current.snapToIndex(
      getCurrentIndex(index),
      animationConfigs,
    );
  };

  const renderChildren = componentType => {
    switch (componentType) {
      case 'FlatList':
        return (
          <FlatList
           contentContainerStyle={{contentContainerStyle,...containerStyle}}
            ref={innerRef}
            data={rest.data}
            keyExtractor={i => i}
            renderItem={rest.renderItem}
            {...rest}
          />
        );
        break;
      case 'ScrollView':
        return (
          <ScrollView contentContainerStyle={{contentContainerStyle,...containerStyle}} ref={innerRef} {...rest}>
            {props.children}
          </ScrollView>
        );
        break;
      case 'SectionList':
        return (
          <SectionList
            contentContainerStyle={{contentContainerStyle,...containerStyle}}
            ref={innerRef}
            sections={rest.sections}
            keyExtractor={(i) => i}
            renderSectionHeader={rest.renderSectionHeader}
            renderItem={rest.renderItem}
            {...rest}
          />
        );
        break;
      default:
        return (
          <ScrollView contentContainerStyle={{contentContainerStyle,...containerStyle}} ref={innerRef} {...rest}>
            <Text>Awesome 🔥</Text>
          </ScrollView>
        );
    }
  };

  // renders
  return (
    <GestureHandlerRootView style={{flex:1}}>
        <BottomSheet
            ref={bottomSheetRef}
            backgroundStyle={containerStyle}
            snapPoints={reverseSnapPoints}
            index={currentIndex}
            handleComponent={renderHandle}
            onChange={onSettle}
            animationConfigs={animationConfigs}
            animatedPosition={animatedPosition}
            enableOverDrag={enableOverScroll ? true : false}
            overDragResistanceFactor={
              friction && friction < 1 ? friction * 10 : 2.5
            }
            enablePanDownToClose={reverseSnapPoints.includes(0.01)}
            enableHandlePanningGesture={true}>
            {renderChildren(componentType)}
        </BottomSheet>
    </GestureHandlerRootView>
  );
});
const styles = StyleSheet.create({
  contentContainer: {},
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: '#eee',
  },
});
export default ScrollBottomSheet;