import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

interface ListType {
  text: string;
  backgroundColor: string;
  component: string;
}

const list: ListType[] = [
  {text: 'Monitor Test', backgroundColor: '#a0d911', component: 'Monitor'},
  {text: 'Slider Test', backgroundColor: '#faad14', component: 'Slider'},
  {text: 'BB Test', backgroundColor: '#4096ff', component: 'BB'},
  {text: 'CC Test', backgroundColor: '#13c2c2', component: 'CC'},
];

const Home = () => {
  const navigation = useNavigation();

  const handleCardPress = (component: string) => {
    if (component === 'Monitor' || component === 'Slider') {
      navigation.navigate(component as never);
    }
    // navigation.navigate(component as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tools</Text>
      {list.map(({backgroundColor, component, text}) => (
        <TouchableOpacity
          style={[styles.item, {backgroundColor}]}
          key={component}
          onPress={() => handleCardPress(component)}>
          <Text style={styles.txt}>{text}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 20,
  },
  item: {
    height: 100,
    borderRadius: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  txt: {
    fontSize: 20,
  },
});

export default Home;
