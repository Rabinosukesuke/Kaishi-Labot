import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { RootStackScreenProps } from '../navigation/Routenavigator';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const ITEM_SIZE = width * 0.77;
const SPACING = 10;
const FULL_SIZE = ITEM_SIZE + SPACING * 2;


const machines = [
  { id: '1', name: 'UVプリンタ', image: require('../assets/UVprinter.png') },
  { id: '2', name: '3Dプリンタ', image: require('../assets/3dprinter.png') },
  { id: '3', name: 'レーザーカッター', image: require('../assets/rasercutter.png') },
];

export const MachineSelectionScreen: React.FC<RootStackScreenProps<'MachineSelection'>> = ({ navigation }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const flatListRef = useRef<Animated.FlatList>(null);

  useEffect(() => {
    // コンポーネントがマウントされた後、少し遅延を入れてスクロール
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index: 1, animated: false });
    }, 100);
  }, []);

  const handleMachineSelect = (id: string) => {
    setSelectedMachine(id);
    if (id === '2') {
      navigation.navigate('ChatScreen');
    } else {
      Alert.alert(
        "未対応",
        "この機材は現在対応していません",
        [{ text: "OK", onPress: () => setSelectedMachine(null) }]
      );
    }
  };

  return (
    <LinearGradient colors={['#FFD6C4', '#FFC8C8', '#FFBAC8']} style={styles.container}>
      <View style={styles.contentContainer}>
        <Animated.FlatList
          data={machines}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          snapToInterval={FULL_SIZE}
          decelerationRate="fast"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          initialScrollIndex={1} // UVプリンタ（真ん中の項目）のインデックス
          getItemLayout={(data, index) => ({
            length: FULL_SIZE,
            offset: FULL_SIZE * index,
            index,
          })}
          renderItem={({ item, index }) => {
            const inputRange = [
              (index - 1) * FULL_SIZE,
              index * FULL_SIZE,
              (index + 1) * FULL_SIZE,
            ];

            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.8, 1, 0.8],
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.5, 1, 0.5],
            });

            return (
              <TouchableOpacity onPress={() => handleMachineSelect(item.id)}>
                <Animated.View style={[styles.machineItem, { transform: [{ scale }], opacity }]}>
                  <Image source={item.image} style={styles.machineImage} />
                  <Text style={styles.machineName}>{item.name}</Text>
                </Animated.View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <Text style={styles.instruction}>
        左右にスワイプして機材を選択
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  listContent: {
    alignItems: 'center',
    paddingHorizontal: width * 0.164, 
  },
  machineItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  machineImage: {
    width: ITEM_SIZE - 60,
    height: ITEM_SIZE - 60,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  machineName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    paddingBottom: 30,
    paddingTop: -40,
  },
  instruction: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingBottom: 150,
    paddingTop: -150,
  },
});