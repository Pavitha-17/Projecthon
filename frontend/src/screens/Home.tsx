import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import SideBar from '../components/SideBar';
import { MoreVertical, Image, Send } from 'lucide-react-native';

export default function Home() {
  const [imagePress, setImagePress] = useState(false);
  const [chatPress, setChatPress] = useState(false);
  const [sendPress, setSendPress] = useState(false);

  return (
    <View style={styles.content}>
      <View style={styles.bar}>
        <SideBar />
      </View>

      <View style={styles.main}>
        <View style={styles.homeHeader}>
          <Text style={styles.title}>New Chat</Text>
          <View>
            <MoreVertical size={20} color={'black'} />
          </View>
        </View>
        <View
          style={{
            position: 'absolute',
            marginTop: 15,
            width: 400,
            height: 1,
            backgroundColor: 'lightgrey',
            // marginLeft: isOpen ? 2 : 0,
            // left: 5,
            // right: 5,
            bottom: 85,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 4,
          }}
        >
          <Pressable
            onPressIn={() => setImagePress(true)}
            onPressOut={() => setImagePress(false)}
          >
            <Image
              size={25}
              strokeWidth={1}
              color={imagePress ? 'lightgrey' : 'black'}
            />
          </Pressable>
          <Pressable 
          onPressIn={() => setChatPress(true)}
          onPressOut={()=>setChatPress(false)}
          >
            <TextInput
              style={{
                borderWidth: 1,
                borderColor:chatPress?'#a129d3':'black',
                paddingVertical: 15,
                width: 250,
                borderRadius: 20,
              }}
              placeholderTextColor={'#616468ff'}
            />
          </Pressable>
          <Pressable
            style={{
              borderWidth: 1,
              borderColor: !sendPress ? 'black' : 'lightgrey',
              paddingVertical: 10,
              paddingHorizontal: 8,
              borderRadius: 10,
            }}
            onPressIn={() => setSendPress(true)}
            onPressOut={() => setSendPress(false)}
          >
            <Send size={20} strokeWidth={1} color={sendPress?'lightgrey':'black'}/>
          </Pressable>
        </View>
        <View style={styles.body}>
          <Text>Main content here...</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  bar: {
    width: 60,
    backgroundColor: '#eee',
  },
  main: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  homeHeader: {
    // height: , // ✅ fixed height
    marginTop: 42,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: 'lightgrey',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 90,
  },
  body: {
    flex: 1, // ✅ takes remaining height
    justifyContent: 'center',
    alignItems: 'center',
  },
});
