import React, {useState} from 'react';
import {View, PanResponder, StyleSheet} from 'react-native';

const Slider = () => {
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragX, setDragX] = useState(0);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (event, gestureState) => {
      setDragging(true);
      setDragX(gestureState.x0);
    },
    onPanResponderMove: (event, gestureState) => {
      if (dragging) {
        const screenWidth = 300; // 假设进度条的宽度为 300
        const newX = gestureState.moveX;
        const value = Math.max(0, Math.min(1, newX / screenWidth));
        setProgress(value);
        setDragX(newX);
      }
    },
    onPanResponderRelease: (event, gestureState) => {
      setDragging(false);
      // 这里可以添加拖动结束后的逻辑
    },
  });

  return (
    <View style={styles.container}>
      <View style={[styles.progressBar, {width: `${progress * 100}%`}]} />
      <View style={styles.draggable} {...panResponder.panHandlers} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 20,
    backgroundColor: 'gray',
    borderRadius: 10,
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'blue',
    borderRadius: 10,
  },
  draggable: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'red',
  },
});

export default Slider;
