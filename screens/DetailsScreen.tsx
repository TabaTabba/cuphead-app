import React, { useLayoutEffect, useState, useRef, useEffect } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Boss, RootStackParamList } from "../data/types";
import { IconButton } from "../components/iconButton";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../redux/favorites";
import { RootState } from "../redux/store";
import Difficulty from "../components/difficulty";
import { themes } from "../data/themeData";
import { imageMapping } from "../data/imageMapping";
import { Colors } from "../assets/colors";
import axios from "axios";

type Props = NativeStackScreenProps<RootStackParamList, "DetailsScreen">;

const getImage = (path: string) => {
  return imageMapping[path] || null;
};

const { width } = Dimensions.get("window");

const WeaponItem = ({
  item,
  openModal,
}: {
  item: any;
  openModal: (weaponId: string, weaponRef: any) => void;
}) => {
  const weaponRef = useRef(null);

  return (
    <TouchableOpacity
      ref={weaponRef}
      onPress={() => openModal(item.id, weaponRef)}
    >
      <Image
        source={getImage(item?.url)}
        style={styles.weaponImage}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

export default function DetailsScreen({ route, navigation }: Props) {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favoriteBosses.ids);
  const theme = useSelector((state: RootState) => state.theme.theme);
  const themeStyles = themes[theme];

  const { item } = route.params as { item: Boss };
  const bossIsFavorite = favorites.includes(+item.id);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [weaponsData, setWeaponsData] = useState<Record<string, any>>({});
  const [selectedWeapon, setSelectedWeapon] = useState<any>(null);

  const scaleAnim = useRef(new Animated.Value(2)).current;

  function changeFavoriteStatusHandler() {
    if (bossIsFavorite) {
      dispatch(removeFavorite({ id: item.id }));
    } else {
      dispatch(addFavorite({ id: item.id }));
    }
  }

  const openModal = (weaponId: string, weaponRef: any) => {
    weaponRef.current.measure(
      (
        fx: number,
        fy: number,
        width: number,
        height: number,
        px: number,
        py: number
      ) => {
        setModalPosition({ x: px + 40, y: py - 320 });
        setIsModalVisible(true);
        setSelectedWeapon(weaponsData[weaponId]);
      }
    );
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedWeapon(null);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: item.name,
      headerTitleStyle: {
        fontSize: 24,
      },
      headerStyle: {
        backgroundColor: themeStyles.backgroundColor,
      },
      headerRight: () => (
        <IconButton
          name={bossIsFavorite ? "star" : "star-outline"}
          size={24}
          color="white"
          onPress={changeFavoriteStatusHandler}
        />
      ),
    });
  }, [navigation, changeFavoriteStatusHandler]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/weapons")
      .then((response) => {
        const weapons = response.data;
        const weaponMap = weapons.reduce(
          (acc: Record<string, any>, weapon: any) => {
            acc[weapon.id] = weapon;
            return acc;
          },
          {}
        );
        setWeaponsData(weaponMap);
      })
      .catch((error) => {
        console.error("Error fetching weapons:", error);
      });
  }, []);

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const scrollHandler = (event: any) => {
    const newIndex = Math.ceil(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(newIndex);
  };

  const renderImageItem = ({ item }: { item: any }) => (
    <Image source={getImage(item)} style={styles.image} resizeMode="contain" />
  );

  return (
    <Animated.View
      style={[
        styles.rootContainer,
        {
          backgroundColor: themeStyles.backgroundColor,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.imageContainer}>
        <FlatList
          data={item.images}
          renderItem={renderImageItem}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        />
        <View style={styles.pagination}>
          {item.images.map((_: any, index: any) => (
            <View
              key={index}
              style={[styles.dot, { opacity: activeIndex === index ? 1 : 0.3 }]}
            />
          ))}
        </View>
      </View>
      <ScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginTop: 32, width: "85%", alignSelf: "center" }}>
          <View
            style={{
              height: 40,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "white",
            }}
          >
            <View
              style={{
                width: `${(item.health / 2500) * 100}%`,
                backgroundColor: "white",
                height: "100%",
              }}
            />
          </View>
        </View>
        <View style={styles.difficultyContainer}>
          <Difficulty difficulty={item.difficulty} />
        </View>
        <FlatList
          style={styles.weaponImagesContainer}
          data={item.recommendedWeapons.map(
            (weaponId: number) => weaponsData[weaponId]
          )}
          renderItem={({ item }) => (
            <WeaponItem item={item} openModal={openModal} />
          )}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
        />

        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.appearanceContainer}>Appearance</Text>
        <Text style={styles.appearance}>{item.appearance}</Text>
        <Text style={styles.personalityContainer}>Personality</Text>
        <Text style={styles.personality}>{item.appearance}</Text>
      </ScrollView>

      {isModalVisible && selectedWeapon && (
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContainer,
                {
                  top: modalPosition.y,
                  left: modalPosition.x - 100,
                },
              ]}
            >
              <View
                style={{
                  backgroundColor: selectedWeapon.color,
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Text style={styles.modalTitle}>{selectedWeapon.name}</Text>
              </View>
              <View style={styles.weaponStatsContainer}>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Damage:</Text>
                  <Text style={styles.statValue}>{selectedWeapon.damage}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>EX Damage:</Text>
                  <Text style={styles.statValue}>
                    {selectedWeapon.exDamage}
                  </Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>DPS:</Text>
                  <Text style={styles.statValue}>{selectedWeapon.dps}</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  imageContainer: {
    flex: 1,
    paddingHorizontal: 4,
  },
  image: {
    width: width * 0.9,
    height: 400,
    marginBottom: 20,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    height: 10,
    width: 10,
    backgroundColor: "white",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  difficultyContainer: {
    paddingVertical: 16,
    alignSelf: "center",
  },
  weaponImagesContainer: {
    flexDirection: "row",
    marginBottom: 12,
    alignSelf: "center",
  },
  weaponImage: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  title: {
    fontSize: 32,
    color: "white",
    fontWeight: "bold",
  },
  description: {
    marginTop: 8,
    fontSize: 16,
    color: "white",
  },
  appearanceContainer: {
    marginTop: 24,
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  appearance: {
    marginTop: 8,
    color: "white",
    fontSize: 16,
  },
  personalityContainer: {
    marginTop: 24,
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  personality: {
    marginTop: 8,
    color: "white",
    fontSize: 16,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    position: "absolute",
    width: 200,
    backgroundColor: Colors.black400,
    borderRadius: 10,
    paddingBottom: 16,
    alignItems: "center",
  },
  modalTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 16,
  },
  modalWeaponImage: {
    width: 60,
    height: 60,
    marginVertical: 16,
  },
  weaponStatsContainer: {
    width: "100%",
    alignItems: "center",
  },
  statRow: {
    flexDirection: "column",
    alignItems: "center",
    marginVertical: 4,
  },
  statLabel: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  statValue: {
    color: "white",
    fontSize: 16,
  },
});
