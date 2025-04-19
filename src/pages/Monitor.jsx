import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  FlatList,
  Alert,
  Image,
} from 'react-native';
import {Client, Message} from 'react-native-paho-mqtt';

const MQTT_CONFIG = {
  uri: 'ws://124.220.233.66:8083/mqtt', // EMQX公共MQTT服务器（WebSocket）
  clientId: `rn_client_${Math.random().toString(16).substr(2, 8)}`,
};

// 创建一个虚拟的storage对象
const mockStorage = {
  setItem: () => Promise.resolve(),
  getItem: () => Promise.resolve(null),
  removeItem: () => Promise.resolve(),
  clear: () => Promise.resolve(),
};

// 全局变量用于重组图片
let imageBuffer = null;
let expectedSize = 0;
let receivedBytes = 0;

// 工具函数：Uint8Array转Base64
const bufferToBase64 = buffer => {
  return btoa(String.fromCharCode(...buffer));
};

const App = () => {
  const [messages, setMessages] = useState('');
  const [client, setClient] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  // 初始化MQTT客户端
  useEffect(() => {
    const initializeClient = () => {
      const newClient = new Client({
        uri: MQTT_CONFIG.uri,
        clientId: MQTT_CONFIG.clientId,
        storage: mockStorage,
      });

      // 事件监听
      newClient.on('connectionLost', err => {
        if (err.errorCode !== 0) {
          Alert.alert('连接断开', err.errorMessage);
          setIsConnected(false);
        }
      });

      newClient.on('messageReceived', message => {
        console.log('message', message);
        // 处理元数据
        if (message.payloadBytes[0] === 0x53) {
          // ASCII 'S' 检测元数据包
          const meta = String.fromCharCode(...message.payloadBytes);
          expectedSize = parseInt(meta.split(':')[1]);
          imageBuffer = new Uint8Array(expectedSize);
          receivedBytes = 0;
          return;
        }
        // 处理图片数据;
        if (imageBuffer && message.payloadBytes.length) {
          const chunk = new Uint8Array(message.payloadBytes);
          imageBuffer.set(chunk.slice(4), receivedBytes); // 跳过前4字节大小头
          receivedBytes += chunk.length - 4;

          if (receivedBytes >= expectedSize) {
            const base64 = bufferToBase64(imageBuffer);
            setMessages(`data:image/jpeg;base64,${base64}`);
            imageBuffer = null;
          }
        }
      });

      return newClient;
    };

    const mqttClient = initializeClient();
    setClient(mqttClient);

    return () => {
      if (mqttClient && mqttClient.isConnected()) {
        mqttClient.disconnect();
      }
    };
  }, []);

  // 连接服务器
  const connect = async () => {
    try {
      await client.connect();
      setIsConnected(true);
      await client.subscribe('esp32cam/hello', 0); // 订阅主题
      Alert.alert('连接成功');
    } catch (err) {
      Alert.alert('连接失败', err.errorMessage);
    }
  };

  // 发布消息
  const publishMessage = () => {
    if (client && isConnected && inputMessage.trim()) {
      const message = new Message(inputMessage);
      message.destinationName = 'testTopic';
      client.send(message);
      setInputMessage('');
    }
  };

  return (
    <View style={{padding: 20, flex: 1}}>
      {/* 连接状态显示 */}
      <Text style={{color: isConnected ? 'green' : 'red', marginBottom: 20}}>
        {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </Text>

      {/* 连接控制按钮 */}
      {!isConnected ? (
        <Button title="连接服务器" onPress={connect} />
      ) : (
        <Button
          title="断开连接"
          onPress={() => {
            client.disconnect();
            setIsConnected(false);
          }}
          color="red"
        />
      )}

      {/* 消息输入与发送 */}
      {isConnected && (
        <View style={{marginVertical: 20}}>
          <TextInput
            placeholder="输入消息"
            value={inputMessage}
            onChangeText={setInputMessage}
            style={{borderWidth: 1, padding: 10, marginBottom: 10}}
          />
          <Button title="发送消息" onPress={publishMessage} />
        </View>
      )}

      {/* 消息列表 */}
      {/* <FlatList
        data={messages}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View
            style={{padding: 10, backgroundColor: '#f0f0f0', marginBottom: 5}}>
            <Text>{item.text}</Text>
          </View>
        )}
        inverted
      /> */}
      <Image
        style={{
          width: '100%',
          height: 200,
          marginTop: 20,
          backgroundColor: '#ccc',
        }}
        source={{uri: messages}}
        resizeMode="cover"
        fadeDuration={0} // 禁用渐变动画
        key={Date.now()} // 强制重新渲染
      />
    </View>
  );
};

export default App;
