import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import Video from 'react-native-video';

const App = () => {
  const [paused, setPaused] = React.useState(false);

  const togglePause = () => {
    setPaused(!paused);
  };

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/videos/video.mp4')}
        style={styles.video}
        // controls={true}
        paused={paused}
        muted={false}
        repeat={true}
        resizeMode="contain"
        onError={error => {
          console.error('Video Error:', error);
        }}
      />
      <TouchableOpacity
        style={[styles.button, !paused ? styles.videoHidden : '']}
        onPress={togglePause}>
        <Text style={styles.text}>{paused ? '播放' : '暂停'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoHidden: {
    opacity: 0,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    backgroundColor: '#fff',
    transform: [{translateX: -40}, {translateY: -40}],
  },
  text: {
    fontSize: 18,
  },
});

export default App;
