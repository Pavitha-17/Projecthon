// components/SideBar.tsx
import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  Dimensions,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import LinearGradient from 'react-native-linear-gradient';
import {
  Home,
  Plus,
  Search,
  LogOut,
  Settings,
  Clock,
  X,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;
export const SIDEBAR_EXPANDED = SIDEBAR_WIDTH;
export const SIDEBAR_COLLAPSED = 60;

type Chat = {
  id: string;
  title: string;
  recentMessage: string;
  messages: { text: string; sender: 'user' | 'ai' }[];
  timestamp: Date;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectChat: (chat: Chat) => void;
  currentChatId: string | null;
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
export default function SideBar({
  isOpen,
  onClose,
  onNewChat,
  onSelectChat,
  currentChatId,
}: Props) {
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation<NavigationProp>();

  const [isPressed, setIsPressed] = useState(false);
  const [isAddPressed, setIsAddPressed] = useState(false);
  
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      title: 'About me',
      recentMessage: 'You are a great coder...',
      messages: [
        { text: 'You are a great coder...', sender: 'user' },
        { text: 'Thanks!', sender: 'ai' },
      ],
      timestamp: new Date(),
    },
    {
      id: '2',
      title: 'Projecthon',
      recentMessage: 'It was an amazing event...',
      messages: [
        { text: 'It was an amazing event...', sender: 'user' },
        { text: 'Tell me more!', sender: 'ai' },
      ],
      timestamp: new Date(),
    },
  ]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : -SIDEBAR_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  // Filter chats
  const filteredChats = useMemo(() => {
    if (!searchText.trim()) return chats;
    return chats.filter(
      (c) =>
        c.title.toLowerCase().includes(searchText.toLowerCase()) ||
        c.recentMessage.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [chats, searchText]);

  // Create new chat
  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      recentMessage: '',
      messages: [],
      timestamp: new Date(),
    };
    setChats((prev) => [newChat, ...prev]);
    onNewChat();
    onSelectChat(newChat);
    onClose();
  };

  // Update chat title after first message
  const updateChatTitle = (chatId: string, firstMessage: string) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              title: firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : ''),
              recentMessage: firstMessage,
            }
          : c
      )
    );
  };

  // Expose to parent
  React.useImperativeHandle(null, () => ({
    updateChatTitle,
  }));

  return (
    <>
      {/* DARK OVERLAY */}
      {isOpen && (
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose}>
          <Animated.View
            style={[
              styles.overlay,
              {
                opacity: slideAnim.interpolate({
                  inputRange: [-SIDEBAR_WIDTH, 0],
                  outputRange: [0, 0.5],
                }),
              },
            ]}
          />
        </Pressable>
      )}

      {/* SLIDING SIDEBAR */}
      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateX: slideAnim }], width: SIDEBAR_WIDTH },
        ]}
        pointerEvents={isOpen ? 'auto' : 'none'}
      >
        <View style={styles.sidebar}>
          {/* HEADER */}
          <Pressable onPress={onClose} style={styles.header}>
            <LinearGradient
              colors={['#b145f4', '#288df8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.logo}
            >
              <Text style={styles.logoText}>AI</Text>
            </LinearGradient>
            <Text style={styles.title}>AI Assistant</Text>
          </Pressable>

          <View style={styles.divider} />

          {/* MENU */}
          <View style={styles.menu}>
            <Pressable style={styles.newChatBtn} onPress={handleNewChat}>
              <LinearGradient
                colors={['#a129d3', '#136be3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.newChatGradient}
              >
                <Plus size={20} color="#fff" />
                <Text style={styles.newChatText}>New Chat</Text>
              </LinearGradient>
            </Pressable>

            <View style={styles.searchContainer}>
              <Search size={18} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search chats..."
                placeholderTextColor="#999"
                value={searchText}
                onChangeText={setSearchText}
              />
              {searchText ? (
                <Pressable onPress={() => setSearchText('')}>
                  <X size={18} color="#666" />
                </Pressable>
              ) : null}
            </View>
          </View>

          <View style={styles.divider} />

          {/* RECENT CHATS (Scrollable) */}
          <ScrollView style={styles.chatList} showsVerticalScrollIndicator={false}>
            {filteredChats.length === 0 ? (
              <Text style={styles.noResults}>No chats found</Text>
            ) : (
              filteredChats.map((chat) => (
                <Pressable
                  key={chat.id}
                  style={[
                    styles.chatItem,
                    currentChatId === chat.id && styles.activeChat,
                  ]}
                  onPress={() => {
                    onSelectChat(chat);
                    onClose();
                  }}
                >
                  <View style={styles.chatContent}>
                    <Text style={styles.chatTitle} numberOfLines={1}>
                      {chat.title}
                    </Text>
                    <Text style={styles.chatPreview} numberOfLines={1}>
                      {chat.recentMessage || 'No messages yet'}
                    </Text>
                  </View>
                  <Text style={styles.chatTime}>
                    {chat.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </Pressable>
              ))
            )}
          </ScrollView>

          <View style={styles.divider} />

          {/* BOTTOM */}
          <View style={styles.bottom}>
            <Pressable style={styles.bottomItem}>
              <View style={styles.avatar} />
              <Text style={styles.bottomText}>Profile</Text>
            </Pressable>
            <Pressable style={styles.bottomItem} onPress={() => navigation.navigate('Settings')}>
              <Settings size={20} color="#666" />
              <Text style={styles.bottomText}>Settings</Text>
            </Pressable>
            <Pressable style={styles.bottomItem} >
              <LogOut size={20} color="#FF0000" />
              <Text style={[styles.bottomText, { color: '#FF0000' }]}>Logout</Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#fff',
    elevation: 20,
    zIndex: 1000,
  },
  overlay: { backgroundColor: '#000' },
  sidebar: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  title: { fontSize: 18, fontWeight: '600', color: '#000' },
  divider: { height: 1, backgroundColor: '#e0e0e0', marginVertical: 16 },
  menu: { gap: 12 },
  newChatBtn: { marginVertical: 4 },
  newChatGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 12,
  },
  newChatText: { color: '#fff', fontWeight: '600' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: '#000' },
  chatList: { flex: 1 },
  chatItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeChat: { backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#000' },
  chatContent: { flex: 1, marginRight: 8 },
  chatTitle: { fontSize: 16, fontWeight: '600', color: '#000' },
  chatPreview: { fontSize: 14, color: '#666', marginTop: 2 },
  chatTime: { fontSize: 12, color: '#999' },
  noResults: { textAlign: 'center', color: '#999', marginTop: 20 },
  bottom: { gap: 16, paddingTop: 8 },
  bottomItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ddd',
    borderWidth: 1,
    borderColor: '#000',
  },
  bottomText: { fontSize: 16, color: '#666' },
});