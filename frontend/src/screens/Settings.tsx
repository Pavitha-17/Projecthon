import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { ArrowLeft, Camera, Edit, Sun, Moon } from 'lucide-react-native';

export default function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [name, setName] = useState('fsv');
  const [profileImage, setProfileImage] = useState(null);

  const selectImage = () => {
    Alert.alert(
      'Change Photo',
      'Image picker functionality requires additional setup. For now, this is a demo.',
      [{ text: 'OK' }]
    );
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = {
    background: isDarkMode ? '#1a1a1a' : '#f5f5f5',
    cardBackground: isDarkMode ? '#2d2d2d' : '#fff',
    text: isDarkMode ? '#fff' : '#000',
    subText: isDarkMode ? '#ccc' : '#666',
    inputBackground: isDarkMode ? '#404040' : '#f8f8f8',
    border: isDarkMode ? '#404040' : '#e0e0e0',
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.cardBackground, borderBottomColor: theme.border }]}>
        <Pressable style={styles.backButton}>
          <ArrowLeft size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Profile</Text>
          
          <View style={styles.profileContainer}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                  <View style={styles.avatarPlaceholder} />
                )}
              </View>
              <Pressable style={styles.changePhotoButton} onPress={selectImage}>
                <Camera size={16} color={theme.subText} />
                <Text style={[styles.changePhotoText, { color: theme.subText }]}>Change Photo</Text>
              </Pressable>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Name</Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor={theme.subText}
                />
                <Edit size={16} color={theme.subText} />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Email</Text>
              <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}>
                <TextInput
                  style={[styles.input, { color: theme.subText }]}
                  value="pavitha@gmail.com"
                  editable={false}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.subText}
                />
              </View>
              <Text style={[styles.helperText, { color: theme.subText }]}>Email cannot be changed</Text>
            </View>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Preferences</Text>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceLeft}>
              <Text style={[styles.preferenceTitle, { color: theme.text }]}>Theme</Text>
              <Text style={[styles.preferenceSubtitle, { color: theme.subText }]}>Choose your preferred theme</Text>
            </View>
            <View style={styles.themeToggle}>
              <Pressable 
                style={[styles.themeOption, !isDarkMode && styles.themeOptionActive]} 
                onPress={() => setIsDarkMode(false)}
              >
                <Sun size={16} color={!isDarkMode ? "#fff" : theme.subText} />
              </Pressable>
              <Pressable 
                style={[styles.themeOption, isDarkMode && styles.themeOptionActive]} 
                onPress={() => setIsDarkMode(true)}
              >
                <Moon size={16} color={isDarkMode ? "#fff" : theme.subText} />
              </Pressable>
            </View>
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceLeft}>
              <Text style={[styles.preferenceTitle, { color: theme.text }]}>Notifications</Text>
              <Text style={[styles.preferenceSubtitle, { color: theme.subText }]}>Get notified of new messages</Text>
            </View>
            <View style={styles.notificationToggle}>
              <Text style={styles.toggleStatus}>Enabled</Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>About</Text>
          
          <View style={styles.aboutItem}>
            <Text style={[styles.aboutLabel, { color: theme.text }]}>Version</Text>
            <Text style={[styles.aboutValue, { color: theme.subText }]}>1.0.0</Text>
          </View>

          <View style={styles.aboutItem}>
            <Text style={[styles.aboutLabel, { color: theme.text }]}>AI Model</Text>
            <Text style={[styles.aboutValue, { color: theme.subText }]}>GPT-4</Text>
          </View>

          <View style={styles.aboutItem}>
            <Text style={[styles.aboutLabel, { color: theme.text }]}>Last Updated</Text>
            <Text style={[styles.aboutValue, { color: theme.subText }]}>Today</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  section: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  profileContainer: {
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  changePhotoText: {
    fontSize: 14,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  preferenceLeft: {
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  preferenceSubtitle: {
    fontSize: 14,
  },
  themeToggle: {
    flexDirection: 'row',
    gap: 8,
  },
  themeOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  themeOptionActive: {
    backgroundColor: '#7c3aed',
  },
  notificationToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#e8f4fd',
    borderRadius: 12,
  },
  toggleStatus: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '500',
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  aboutLabel: {
    fontSize: 16,
  },
  aboutValue: {
    fontSize: 16,
    fontWeight: '500',
  },
});