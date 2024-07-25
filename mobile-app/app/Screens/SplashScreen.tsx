import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { RootStackScreenProps } from '../navigation/Routenavigator';


export const SplashScreen: React.FC<RootStackScreenProps<'SplashScreen'>> = ({ navigation }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
          navigation.replace('MachineSelection');
        }, 3000); // 3秒後にMachineSelectionScreenに遷移
      
        return () => clearTimeout(timer);
      }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
      />
      <Text style={styles.text}>KAISHI-LABOT</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFD6C4', 
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  text: {
    marginBottom: 40, // ロゴとテキストの間隔
    marginTop: -25,
    fontSize: 24, // フォントサイズ
    fontWeight: 'bold', // 太字
    fontFamily: 'Helvetica',
    color: 'white', // 黒色
  },
});