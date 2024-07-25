import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, StyleSheet, Text, SafeAreaView, Animated, KeyboardAvoidingView, Platform, Linking, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_KEY, API_BASE_URL } from '@env';
import { RootStackScreenProps } from '../navigation/Routenavigator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Markdown from 'react-native-markdown-display';
import { SettingsScreen } from './SettingsScreen';

type MessageType = { id: string; text: string; sender: 'user' | 'bot' };
// markdownStyles の型を定義
const markdownStyles: Record<string, any> = StyleSheet.create({
  body: {
    color: '#333',
  },
  heading1: {
    fontSize: 24,
    fontWeight: '700', // 'bold' の代わりに '700' を使用
    color: '#333',
  },
  heading2: {
    fontSize: 20,
    fontWeight: '600', // 'bold' の代わりに '600' を使用
    color: '#333',
  },
  link: {
    color: '#007AFF',
  },
  listItem: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
  },
  listItemNumber: {
    fontWeight: '700', // 'bold' の代わりに '700' を使用
    marginRight: 5,
  },
  listItemBullet: {
    fontWeight: '700', // 'bold' の代わりに '700' を使用
    marginRight: 5,
  },
});
// ChatBubble コンポーネント内の Markdown コンポーネントを修正
const ChatBubble = ({ message }: { message: MessageType }) => {
  const [references, setReferences] = useState<string[]>([]);

  useEffect(() => {
    if (message.sender === 'bot') {
      const urlRegex = /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g;
      let match;
      const refs: string[] = [];
      let count = 1;
      let modifiedText = message.text;

      while ((match = urlRegex.exec(message.text)) !== null) {
        const fullMatch = match[0];
        const url = match[2];
        refs.push(url);
        modifiedText = modifiedText.replace(fullMatch, `${fullMatch}`);
        count++;
      }

      setReferences(refs);
      message.text = modifiedText;
    }
  }, [message]);
  

  return (
    <View style={[styles.bubble, message.sender === 'user' ? styles.userBubble : styles.botBubble]}>
      {message.sender === 'user' ? (
        <Text style={[styles.messageText, styles.userMessageText]}>{message.text}</Text>
      ) : (
        <>
          <Markdown
            style={markdownStyles}
            onLinkPress={(url: string) => {
              Linking.openURL(url);
              return false;
            }}
          >
            {message.text}
          </Markdown>
          {references.length > 0 && (
            <View style={styles.referencesContainer}>
              {references.map((url) => (
                <Text key={url} style={styles.referenceText}>
                  <Text style={styles.referenceLink} onPress={() => Linking.openURL(url)}>{url}</Text>
                </Text>
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );
};
export const ChatScreen: React.FC<RootStackScreenProps<'ChatScreen'>> = ({ navigation }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    return () => {
    };
  }, []);


  const toggleMenu = () => {
    const toValue = menuVisible ? -300 : 0;
    Animated.timing(slideAnim, {
      toValue: toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setMenuVisible(!menuVisible);
  };

  const MenuItem = ({ icon, title, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={24} color="#333" style={styles.menuItemIcon} />
      <Text style={styles.menuItemText}>{title}</Text>
    </TouchableOpacity>
  );
  const clearHistory = () => {
    setMessages([]);
  };

  const sendMessage = async (text: string) => {
    if (text.trim()) {
      const newMessage = { id: Math.random().toString(), text, sender: 'user' as const };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInput('');
      setIsLoading(true);

      try {
        const response = await axios.post(
          `${API_BASE_URL}/v1/chat-messages`,
          {
            inputs: {},
            query: text,
            response_mode: "blocking",
            conversation_id: conversationId,
            user: "user"
          },
          {
            headers: {
              'Authorization': `Bearer ${API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.conversation_id && !conversationId) {
          setConversationId(response.data.conversation_id);
        }

        if (response.data.answer) {
          const botMessage = { id: Math.random().toString(), text: response.data.answer, sender: 'bot' as const };
          setMessages((prevMessages) => [...prevMessages, botMessage]);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error sending message:', error);
        const errorMessage = { id: Math.random().toString(), text: "エラーが発生しました。もう一度お試しください。", sender: 'bot' as const };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
        setIsLoading(false);
      }
    }
  };


  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
          <Ionicons name="menu" size={32} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={clearHistory} style={styles.clearButton}>
          <Ionicons name="trash-bin" size={32} color="black" />
        </TouchableOpacity>
      </View>

      {menuVisible && (
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={toggleMenu}
        />
      )}

      <Animated.View style={[
        styles.menu,
        {
          transform: [{ translateX: slideAnim }],
        },
      ]}>
        <TouchableOpacity style={styles.closeButton} onPress={toggleMenu}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <MenuItem icon="settings-outline" title="全体設定" onPress={() => { }} />
        <MenuItem icon="person-outline" title="管理者設定" onPress={() => { }} />
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>機能一覧</Text>
        <MenuItem 
          icon="arrow-back-outline" 
          title="機材選択" 
          onPress={() => {
            toggleMenu(); // メニューを閉じる
            navigation.navigate('MachineSelection'); // MachineSelectionScreenに遷移
          }}
        />
        <MenuItem icon="hardware-chip-outline" title="エリア・設備紹介" onPress={() => Linking.openURL('https://kaishi-pu.ac.jp/kaishi-lab/area/')} />
        <MenuItem icon="document-text-outline" title="利用手順"           
        onPress={() => {
            toggleMenu(); // メニューを閉じる
            navigation.navigate('UsageProcedureScreen'); // MachineSelectionScreenに遷移
          }}
        />
        <MenuItem icon="calendar-outline" title="利用予約" onPress={() => Linking.openURL('https://kaishi-pu.ac.jp/kaishi-lab/reservation/')} />
      </Animated.View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item} />}
        contentContainerStyle={styles.chatContainer}
      />
  {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
      
      {!isLoading && (
        <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="メッセージを入力..."
            placeholderTextColor="#A0A0A0"
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage(input)}>
            <Ionicons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
          </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  // 全体のコンテナ
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },

  // ヘッダー
  header: {
    height: 60,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0', // 灰色の下線を追加
    flexDirection: 'row',
    alignItems: 'center', // ヘッダー内のアイコンを縦方向に中央揃え
    paddingTop: 10,
  },
  menuButton: {
    padding: 10,
    alignSelf: 'flex-start',
  },
  clearButton: {
    padding: 10,
  },


  // チャット関連
  chatContainer: {
    padding: 15,
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  botMessageText: {
    color: '#333',
  },

  // 入力エリア
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 10,
    minHeight: 50, // 最小高さを設定
    maxHeight: 100, // 最大高さを設定（必要に応じて調整）
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // メニュー関連
  menu: {
    position: 'absolute',
    top: 50,
    left: 0,
    width: 300,
    height: '100%',
    backgroundColor: 'white',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    padding: 20,
    paddingTop: 40,
    zIndex: 2,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },

  closeButton: {
    position: 'absolute',
    top: 15,
    right: 20,
    padding: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    top: 10,
  },
  menuItemIcon: {
    marginRight: 10,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
    top: 10,

  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  
  referencesContainer: {
    marginTop: 10,
  },
  referenceText: {
    fontSize: 12,
    color: '#666',
  },
  referenceLink: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});
