import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type ChatProps = {
  message: { id: string; text: string; sender: 'user' | 'bot' };
};

export const Chat = ({ message }: ChatProps) => {
  const isUser = message.sender === 'user';
  return (
    <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.botMessage]}>
      <Text style={styles.messageText}>{message.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  userMessage: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#f1f1f1',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
});