import React from 'react';
import {StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import Video from 'react-native-video';

const App = () => {
  const [paused, setPaused] = React.useState(false);

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/videos/1.mp4')}
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
      <TouchableOpacity style={styles.mask} onPress={() => setPaused(!paused)}>
        {paused && (
          <Image
            style={styles.button}
            source={require('../assets/imgs/play.png')}
          />
        )}
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
  mask: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  button: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -40}, {translateY: -40}],
    opacity: 0.35,
  },
});

export default App;
