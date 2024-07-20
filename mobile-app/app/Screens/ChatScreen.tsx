import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { Chat } from '../components/Chat';
import axios from 'axios';
import { API_KEY, API_BASE_URL } from '@env';

export const ChatScreen = () => {
    const [messages, setMessages] = useState<{ id: string; text: string; sender: 'user' | 'bot' }[]>([]);
    const [input, setInput] = useState('');
    const [conversationId, setConversationId] = useState<string | null>(null);

    const sendMessage = async () => {
        if (input.trim()) {
            const newMessage = { id: Math.random().toString(), text: input, sender: 'user' as const };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setInput('');

            try {
                console.log('Request URL:', `${API_BASE_URL}/v1/chat-messages`);
                console.log('Request Headers:', {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                });
                console.log('Request Body:', {
                    inputs: {},
                    query: input,
                    response_mode: "blocking",
                    conversation_id: conversationId,
                    user: "user"
                });
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
                if (axios.isAxiosError(error)) {
                  if (error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                    console.error('Response headers:', error.response.headers);
                  } else if (error.request) {
                    console.error('No response received:', error.request);
                  } else {
                    console.error('Error setting up request:', error.message);
                  }
                } else {
                  console.error('Non-Axios error:', error);
                }
                // エラーメッセージをユーザーに表示
                const errorMessage = { id: Math.random().toString(), text: "エラーが発生しました。もう一度お試しください。", sender: 'bot' as const };
                setMessages((prevMessages) => [...prevMessages, errorMessage]);
              }
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <Chat message={item} />}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Type a message"
                />
                <Button title="Send" onPress={sendMessage} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
    },
});