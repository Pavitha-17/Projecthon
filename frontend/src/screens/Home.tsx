// screens/Home.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  StatusBar,
} from 'react-native';
import SideBar from '../components/SideBar';
import { Menu, MoreVertical, Image, Send } from 'lucide-react-native';

type Message = { text: string; sender: 'user' | 'ai'; timestamp: Date };

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [imagePress, setImagePress] = useState(false);
  const [sendPress, setSendPress] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const scrollToBottom = () => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };
  useEffect(() => scrollToBottom(), [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const userMsg: Message = {
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((p) => [...p, userMsg]);
    setInputText('');

    // Auto‑name chat on first message
    if (messages.length === 0 && currentChatId) {
      // You'll call backend or update sidebar via ref later
    }

    setTimeout(() => {
      const aiMsg: Message = {
        text: `You said: "${userMsg.text}"`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((p) => [...p, aiMsg]);
    }, 800);
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setInputText('');
  };

  const handleSelectChat = (chat: any) => {
    setMessages(
      chat.messages.map((m: any) => ({
        text: m.text,
        sender: m.sender,
        timestamp: new Date(),
      }))
    );
    setCurrentChatId(chat.id);
  };

  const dismissKeyboard = () => Keyboard.dismiss();
  const keyboardVerticalOffset =
    Platform.OS === 'ios' ? 0 : (StatusBar.currentHeight || 0) + 20;

  return (
    <SafeAreaView style={styles.container}>
      <SideBar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        currentChatId={currentChatId}
      />

      <Pressable style={styles.mainWrapper} onPress={dismissKeyboard}>
        <View style={styles.header}>
          <Pressable
            onPress={() => setSidebarOpen(true)}
            hitSlop={10}
            onPressIn={(e) => e.stopPropagation()}
          >
            <Menu size={26} color="#000" />
          </Pressable>
          <Text style={styles.title}>New Chat</Text>
          <MoreVertical size={20} color="#000" />
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={keyboardVerticalOffset}
          enabled
        >
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.messagesContainer}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={true}
          >
            {messages.length === 0 ? (
              <Text style={styles.placeholder}>Start a conversation...</Text>
            ) : (
              messages.map((msg, i) => (
                <View
                  key={i}
                  style={[
                    styles.messageWrapper,
                    msg.sender === 'user' ? styles.userMessage : styles.aiMessage,
                  ]}
                >
                  <View
                    style={[
                      styles.messageBubble,
                      msg.sender === 'user' ? styles.userBubble : styles.aiBubble,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        msg.sender === 'user' ? styles.userText : styles.aiText,
                      ]}
                    >
                      {msg.text}
                    </Text>
                    <Text style={styles.timestamp}>
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                </View>
              ))
            )}
            <View style={{ height: 20 }} />
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.inputBar}>
          <Pressable
            onPressIn={() => setImagePress(true)}
            onPressOut={() => setImagePress(false)}
          >
            <Image size={25} color={imagePress ? '#aaa' : '#000'} />
          </Pressable>

          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor="#666"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />

          <Pressable
            style={[
              styles.sendButton,
              sendPress && styles.sendButtonPressed,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPressIn={() => setSendPress(true)}
            onPressOut={() => setSendPress(false)}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Send size={20} color={sendPress || !inputText.trim() ? '#aaa' : '#000'} />
          </Pressable>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  mainWrapper: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    zIndex: 10,
  },
  title: { fontSize: 18, fontWeight: '600', color: '#000', flex: 1, textAlign: 'center', marginLeft: -30 },
  messagesContainer: { padding: 16, paddingBottom: 8, flexGrow: 1 },
  placeholder: { fontSize: 16, color: '#888', textAlign: 'center', marginTop: 50 },
  messageWrapper: { marginVertical: 6, maxWidth: '80%' },
  userMessage: { alignSelf: 'flex-end' },
  aiMessage: { alignSelf: 'flex-start' },
  messageBubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18, maxWidth: '100%' },
  userBubble: { backgroundColor: '#007AFF', borderBottomRightRadius: 4 },
  aiBubble: { backgroundColor: '#E5E5EA', borderBottomLeftRadius: 4 },
  messageText: { fontSize: 16, lineHeight: 22 },
  userText: { color: '#fff' },
  aiText: { color: '#000' },
  timestamp: { fontSize: 11, opacity: 0.7, marginTop: 4, alignSelf: 'flex-end' },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    zIndex: 10,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  sendButton: { padding: 10, borderWidth: 1, borderColor: '#000', borderRadius: 10 },
  sendButtonPressed: { borderColor: '#aaa' },
  sendButtonDisabled: { borderColor: '#ddd' },
});