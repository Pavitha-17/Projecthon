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
  Image as RNImage,
  ActivityIndicator,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import SideBar from '../components/SideBar';
import { Menu, MoreVertical, Image, Send, X } from 'lucide-react-native';

type Message = {
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  image?: string;      // base64
  mime_type?: string;
};

const API_URL = 'http://192.168.175.194:8000'; // ← YOUR PC IP

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [imagePress, setImagePress] = useState(false);
  const [sendPress, setSendPress] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>('default');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const scrollRef = useRef<ScrollView>(null);

  const scrollToBottom = () => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };
  useEffect(() => scrollToBottom(), [messages]);

  // ──────────────────────────────────────
  // Image picker
  // ──────────────────────────────────────
  const pickImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', includeBase64: true, quality: 0.8 },
      (response) => {
        if (response.didCancel || response.errorCode) return;
        const asset = response.assets?.[0];
        if (asset?.uri && asset.base64) {
          setSelectedImage({
            uri: asset.uri,
            base64: asset.base64,
            mimeType: asset.type || 'image/jpeg',
          });
        }
      }
    );
  };

  const removeImage = () => setSelectedImage(null);

  // ──────────────────────────────────────
  // Send (non‑streaming) → /chat/
  // ──────────────────────────────────────
  const handleSend = async () => {
    if (!inputText.trim() && !selectedImage) return;

    const userMsg: Message = {
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
      image: selectedImage?.base64,
      mime_type: selectedImage?.mimeType,
    };

    setMessages((p) => [...p, userMsg]);
    setInputText('');
    setSelectedImage(null);
    setIsTyping(true);

    const formData = new FormData();
    formData.append('message', userMsg.text);
    formData.append('session_id', currentChatId);

    if (selectedImage) {
      formData.append('image', {
        uri: selectedImage.uri,
        type: selectedImage.mimeType,
        name: 'photo.jpg',
      } as any);
    }

    try {
      const { data } = await axios.post(`${API_URL}/chat/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });

      const aiMsg: Message = {
        text: data.reply,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((p) => [...p, aiMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const msg =
        err.response?.status
          ? `Server error ${err.response.status}`
          : err.message || 'Network error';
      setMessages((p) => [...p, { text: msg, sender: 'ai', timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  // ──────────────────────────────────────
  // Sidebar helpers
  // ──────────────────────────────────────
  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(`chat_${Date.now()}`);
    setInputText('');
    setSelectedImage(null);
  };

  const handleSelectChat = (chat: any) => {
    setMessages(
      chat.messages.map((m: any) => ({
        text: m.text,
        sender: m.sender,
        timestamp: new Date(m.timestamp),
        image: m.image,
        mime_type: m.mime_type,
      }))
    );
    setCurrentChatId(chat.id);
  };

  const dismissKeyboard = () => Keyboard.dismiss();
  const keyboardVerticalOffset =
    Platform.OS === 'ios' ? 0 : (StatusBar.currentHeight || 0) + 20;

  // ──────────────────────────────────────
  // Render
  // ──────────────────────────────────────
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
            {messages.length === 0 && !isTyping ? (
              <Text style={styles.placeholder}>Start a conversation...</Text>
            ) : (
              <>
                {messages.map((msg, i) => (
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
                      {msg.image && (
                        <RNImage
                          source={{ uri: `data:${msg.mime_type};base64,${msg.image}` }}
                          style={styles.chatImage}
                          resizeMode="cover"
                        />
                      )}
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
                ))}

                {/* Typing indicator (no stream) */}
                {isTyping && (
                  <View style={[styles.messageWrapper, styles.aiMessage]}>
                    <View style={[styles.messageBubble, styles.aiBubble]}>
                      <ActivityIndicator size="small" color="#000" />
                    </View>
                  </View>
                )}
              </>
            )}
            <View style={{ height: 20 }} />
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Image preview */}
        {selectedImage && (
          <View style={styles.imagePreview}>
            <RNImage source={{ uri: selectedImage.uri }} style={styles.previewImg} />
            <Pressable onPress={removeImage} style={styles.removeBtn}>
              <X size={16} color="#fff" />
            </Pressable>
          </View>
        )}

        {/* Input bar */}
        <View style={styles.inputBar}>
          <Pressable
            onPressIn={() => setImagePress(true)}
            onPressOut={() => setImagePress(false)}
            onPress={pickImage}
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
              (!inputText.trim() && !selectedImage) && styles.sendButtonDisabled,
            ]}
            onPressIn={() => setSendPress(true)}
            onPressOut={() => setSendPress(false)}
            onPress={handleSend}
            disabled={!inputText.trim() && !selectedImage}
          >
            <Send
              size={20}
              color={
                sendPress || (!inputText.trim() && !selectedImage) ? '#aaa' : '#000'
              }
            />
          </Pressable>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

/* ──────────────────────────────────────
   YOUR ORIGINAL STYLES (unchanged)
   ────────────────────────────────────── */
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
  chatImage: { width: 200, height: 200, borderRadius: 12, marginBottom: 8 },
  imagePreview: { flexDirection: 'row', padding: 8, backgroundColor: '#f0f0f0', alignItems: 'center' },
  previewImg: { width: 60, height: 60, borderRadius: 8, marginRight: 8 },
  removeBtn: { backgroundColor: '#ff4444', padding: 4, borderRadius: 12 },
});