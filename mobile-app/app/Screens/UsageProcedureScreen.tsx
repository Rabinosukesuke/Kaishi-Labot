import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const procedures = [
  {
    id: '01',
    title: 'ご利用予約',
    description: '機材を利用する場合と、サークル活動や文化祭の準備等で長時間ラボを使用する場合は、利用予約が必要です。予約は、ご利用日の前日までに予約システムから行ってください。',
  },
  {
    id: '02',
    title: '受付',
    description: 'ご利用当日は、ラボの受付にて学籍番号・氏名をお伝えください。',
  },
  {
    id: '03',
    title: '初回講習受講',
    description: '初めて利用する機材の場合、初回講習を受講していただきます。その後、自由に機材を使用することができるようになります。※機材を利用しない場合は初回受講講習は不要です。',
  },
  {
    id: '04',
    title: '機材の利用',
    description: '怪我や事故に気をつけて、自由に機材をお使いください。不明点などがありましたら、いつでもラボスタッフにお声がけください。',
  },
];

export const UsageProcedureScreen = () => {
    const navigation = useNavigation();
  return (
    
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.header}>ご利用の手順</Title>
      {procedures.map((procedure) => (
        <Card key={procedure.id} style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text style={styles.cardNumber}>{procedure.id}</Text>
              <Title style={styles.cardTitle}>{procedure.title}</Title>
            </View>
            <Paragraph style={styles.cardDescription}>{procedure.description}</Paragraph>
          </Card.Content>
        </Card>
      ))}
      <Text style={styles.note}>※ 機材の空き状況によっては、当日受付に来ていただき、そのまま利用していただくことも可能です。受付にて館内の利用状況を確認いたしますので、学籍番号、名前、使用目的（機材）をお伝えください。</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginTop: 30,
    backgroundColor: '#f5f5f5',
  },
  header: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 24,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 16,
  },
  cardTitle: {
    fontSize: 18,
  },
  cardDescription: {
    fontSize: 14,
    color: '#333',
  },
  note: {
    fontSize: 12,
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
});