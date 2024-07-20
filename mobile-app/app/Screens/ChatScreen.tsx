import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, StyleSheet, Text, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_KEY, API_BASE_URL } from '@env';

type MessageType = { id: string; text: string; sender: 'user' | 'bot' };

const ChatBubble = ({ message }: { message: MessageType }) => (
    <View style={[styles.bubble, message.sender === 'user' ? styles.userBubble : styles.botBubble]}>
      <Text style={[
        styles.messageText,
        message.sender === 'user' ? styles.userMessageText : styles.botMessageText
      ]}>
        {message.text}
      </Text>
    </View>
  );

export const ChatScreen = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);

  const sendMessage = async () => {
    if (input.trim()) {
      const newMessage = { id: Math.random().toString(), text: input, sender: 'user' as const };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInput('');

      try {
        const response = await axios.post(
          `${API_BASE_URL}/v1/chat-messages`,
          {
            inputs: {},
            query: input,
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
      } catch (error) {
        console.error('Error sending message:', error);
        const errorMessage = { id: Math.random().toString(), text: "エラーが発生しました。もう一度お試しください。", sender: 'bot' as const };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item} />}
        contentContainerStyle={styles.chatContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="メッセージを入力..."
          placeholderTextColor="#A0A0A0"
            />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F0F0F0',
    },
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
      color: '#FFFFFF',  // ユーザーメッセージの文字色を白に設定
    },
    botMessageText: {
      color: '#333',     // ボットメッセージの文字色を濃いグレーに設定
    },
    inputContainer: {
      flexDirection: 'row',
      padding: 10,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#E5E5EA',
    },
    input: {
      flex: 1,
      backgroundColor: '#F0F0F0',
      borderRadius: 20,
      paddingHorizontal: 15,
      paddingVertical: 10,
      fontSize: 16,
      marginRight: 10,
    },
    sendButton: {
      backgroundColor: '#007AFF',
      borderRadius: 25,
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });