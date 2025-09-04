import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Home,
  Plus,
  Search,
  LogOut,
  Settings,
  Clock,
} from 'lucide-react-native';
import ChatHistory from '../components/ChatHistory';

const { width } = Dimensions.get('window');

const SIDEBAR_EXPANDED = width * 0.7;
const SIDEBAR_COLLAPSED = 60;

function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(SIDEBAR_COLLAPSED)).current;
  const [active, setActive] = useState(0);

  const toggleSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setIsOpen(!isOpen));
  };
  const [isPressed, setIsPressed] = useState(false);
  const [isAddpressed, setIsAddPressed] = useState(false);
  const dummyData = [{chat:'About me',recentMessage:'Your are Great and Amazing coder....'}
    ,{chat:'About Projecthon',recentMessage:'Projecthon was an amazing event....'}
  ]
  return (
    <Animated.View style={[styles.container, { width: slideAnim }]}>
      <View
        style={[
          styles.sidebar,
          { alignItems: isOpen ? 'flex-start' : 'center' },
        ]}
      >
        {/* Sidebar Content */}
        <View style={{ alignItems: 'center', flexDirection: 'row', gap: 20 }}>
          <Pressable
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            style={styles.buttonContainer}
            onPress={() => {
              setIsPressed(true);
              toggleSidebar();
            }}
          >
            <LinearGradient
              colors={
                isPressed ? ['#a129d3', '#136be3'] : ['#b145f4', '#288df8']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientIcon}
            >
              <Text style={styles.text}>AI</Text>
            </LinearGradient>
          </Pressable>
          {isOpen && <Text style={{ color: 'black' }}>AI Assistant</Text>}
        </View>

        <View
          style={{
            marginTop: 10,
            width: isOpen ? SIDEBAR_EXPANDED - 20 : 50,
            height: 1,
            backgroundColor: 'lightgrey',
            marginLeft: isOpen ? 2 : 0,
          }}
        />

        <View style={{ gap: 20, alignItems: 'center' }}>
          <Pressable
            style={[
              styles.homeIcon,
              {
                width: isOpen ? SIDEBAR_EXPANDED - 15 : SIDEBAR_COLLAPSED - 15,
              },
            ]}
            onPress={()=>setActive(0)}
          >
            <View
              style={[
                styles.HomeIcon,
                {
                  borderWidth: 1,
                  borderColor: active === 0 ? 'black' : 'lightgrey',
                  paddingVertical: 10,
                  borderRadius: 15,
                },
              ]}
            >
              <Home color={'black'} size={20} strokeWidth={2} />
              {isOpen && <Text style={{ color: 'black' }}>Home</Text>}
            </View>
          </Pressable>

          <Pressable
            style={[
              styles.addIcon,
              {
                width: isOpen ? SIDEBAR_EXPANDED - 15 : SIDEBAR_COLLAPSED - 15,
              },
            ]}
            onPress={() => setIsAddPressed(true)}
          >
            <LinearGradient
              colors={
                isAddpressed ? ['#a129d3', '#136be3'] : ['#b145f4', '#288df8']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientAddIcon}
            >
              <Plus color={'#fff'} size={20} />
              {isOpen && <Text style={{ color: '#fff' }}>New Chat</Text>}
            </LinearGradient>
          </Pressable>
          <Pressable
            style={[
              styles.addIcon,
              {
                width: isOpen ? SIDEBAR_EXPANDED - 15 : SIDEBAR_COLLAPSED - 15,
              },
            ]}
            onPress={()=>setActive(1)}
          >
            <View
              style={[
                styles.HomeIcon,
                {
                  borderWidth: 1,
                  borderColor: active === 1?'black':'lightgrey',
                  paddingVertical: 10,
                  borderRadius:15,
                },
              ]}
            >
              <Search color={'black'} size={20} strokeWidth={1} />
              {isOpen && (
                <Text style={{ color: 'black' }}>Search Chats...</Text>
              )}
            </View>
          </Pressable>
        </View>

        <View
          style={{
            marginTop: 15,
            width: isOpen ? SIDEBAR_EXPANDED - 20 : 50,
            height: 1,
            backgroundColor: 'lightgrey',
            marginLeft: isOpen ? 2 : 0,
          }}
        />
        <View style={{ alignItems: 'center', gap: 10, paddingTop: 10 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              width: isOpen ? SIDEBAR_EXPANDED - 15 : SIDEBAR_COLLAPSED - 15,
              paddingLeft: 10,
            }}
          >
            <Clock size={20} strokeWidth={1} color={'grey'} />
            {isOpen && <Text>Recent Chats</Text>}
          </View>
          {dummyData.map((obj,index)=>{
            return (<ChatHistory
            isOpen={isOpen}
            SIDEBAR_COLLAPSED={SIDEBAR_COLLAPSED}
            SIDEBAR_EXPANDED={SIDEBAR_EXPANDED}
            chat={obj.chat}
            recentMessage={obj.recentMessage}
            isClicked={active}
            setIsClicked={setActive}
            index={index}
          />)
          })}
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          marginTop: 15,
          width: isOpen ? SIDEBAR_EXPANDED - 20 : 50,
          height: 1,
          backgroundColor: 'lightgrey',
          marginLeft: isOpen ? 2 : 0,
          left: 5,
          right: 5,
          bottom: 180,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: 5,
          right: 5,
          bottom: 50,
          gap: 20,
          // alignItems:'center',
        }}
      >
        <Pressable>
          <View
            style={[
              styles.HomeIcon,
              {
                width: isOpen ? SIDEBAR_EXPANDED - 15 : SIDEBAR_COLLAPSED - 15,
              },
            ]}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 40,
                borderColor: 'black',
                borderWidth: 1,
              }}
            ></View>
            {isOpen && <Text style={{ color: 'black' }}>Profile</Text>}
          </View>
        </Pressable>
        <View
          style={{
            position: 'absolute',
            marginTop: 15,
            width: isOpen ? SIDEBAR_EXPANDED - 20 : 50,
            height: 1,
            backgroundColor: 'lightgrey',
            marginLeft: isOpen ? 2 : 0,
            // left: 5,
            // right: 4,
            bottom: 70,
          }}
        />
        <View style={{ gap: 20 }}>
          <Pressable
            style={{
              width: isOpen ? SIDEBAR_EXPANDED - 15 : SIDEBAR_COLLAPSED - 15,
            }}
          >
            <View style={styles.HomeIcon}>
              <Settings color={'black'} size={20} strokeWidth={2} />
              {isOpen && <Text style={{ color: 'black' }}>LogOut</Text>}
            </View>
          </Pressable>
          <Pressable
            style={{
              width: isOpen ? SIDEBAR_EXPANDED - 15 : SIDEBAR_COLLAPSED - 15,
            }}
          >
            <View style={styles.HomeIcon}>
              <LogOut color={'red'} size={20} strokeWidth={2} />
              {isOpen && <Text style={{ color: '#FF0000' }}>LogOut</Text>}
            </View>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

export default SideBar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    elevation: 10,
    paddingTop: 35,
  },
  sidebar: {
    padding: 10,
    flex: 1,
    backgroundColor: '#fff',
  },
  menuBtn: {
    marginBottom: 30,
  },
  menuIcon: {
    fontSize: 28,
    color: '#fff',
  },
  menuItems: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 22,
    color: '#fff',
    width: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 10,
  },
  buttonContainer: {
    // borderRadius: 12,
    overflow: 'hidden',
    width: 40,
  },
  gradientIcon: {
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 9,
  },
  homeIcon: {
    marginTop: 35,
  },
  addIcon: {
    overflow: 'hidden',
  },
  gradientAddIcon: {
    paddingVertical: 14,
    borderRadius: 15,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    gap: 20,
  },
  HomeIcon: {
    borderRadius: 15,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    gap: 20,
  },
});
