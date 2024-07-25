import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { RootStackScreenProps } from '../navigation/Routenavigator';


export const SettingsScreen: React.FC<RootStackScreenProps<'SettingsScreen'>> = ({ navigation }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

    const toggleDarkMode = async () => {
        setIsDarkMode(!isDarkMode);
        await AsyncStorage.setItem('darkMode', JSON.stringify(!isDarkMode));
    // ここでアプリ全体のテーマを変更するロジックを実装
  };

  const toggleSound = async () => {
    setIsSoundEnabled(!isSoundEnabled);
    await AsyncStorage.setItem('soundEnabled', JSON.stringify(!isSoundEnabled));
  };

  const toggleNotifications = async () => {
    setIsNotificationsEnabled(!isNotificationsEnabled);
    await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(!isNotificationsEnabled));
  };

  const clearChatHistory = async () => {
    // チャット履歴をクリアするロジックを実装
    await AsyncStorage.removeItem('chatHistory');
    alert('チャット履歴がクリアされました');
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#007AFF" />
        <Text style={styles.backButtonText}>戻る</Text>
      </TouchableOpacity>

      <Text style={styles.title}>設定</Text>

      <View style={styles.settingItem}>
        <Text style={styles.settingText}>ダークモード</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleDarkMode}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingText}>サウンド</Text>
        <Switch
          value={isSoundEnabled}
          onValueChange={toggleSound}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingText}>通知</Text>
        <Switch
          value={isNotificationsEnabled}
          onValueChange={toggleNotifications}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={clearChatHistory}>
        <Text style={styles.buttonText}>チャット履歴をクリア</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>プライバシーポリシー</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>利用規約</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>バージョン 1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    padding: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
    marginTop: 30,
  },
  backButtonText: {
    fontSize: 18,
    color: '#007AFF',
    marginLeft: 5,

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  settingText: {
    fontSize: 18,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionText: {
    marginTop: 30,
    textAlign: 'center',
    color: '#888',
  },
});