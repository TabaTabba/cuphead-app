import React, {
  useLayoutEffect,
  useState,
  useRef,
  useEffect,
  MutableRefObject,
  useCallback,
} from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Boss, RootStackParamList, Weapon } from "../data/types";
import { IconButton } from "../components/iconButton";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../redux/favorites";
import { RootState } from "../redux/store";
import Difficulty from "../components/difficulty";
import { themes } from "../data/themeData";
import { imageMapping } from "../data/imageMapping";
import { fetchWeapons } from "../utility/api";
import { WeaponPopup } from "../components/weaponPopup";
import HealthBar from "../components/healthBar";

type Props = NativeStackScreenProps<RootStackParamList, "DetailsScreen">;

const getImage = (path: string) => {
  return imageMapping[path] || null;
};

const { width } = Dimensions.get("window");

const WeaponItem = React.memo(
  ({
    item,
    openWeaponPopup,
  }: {
    item: Weapon;
    openWeaponPopup: (
      weaponId: string,
      weaponRef: MutableRefObject<TouchableOpacity>
    ) => void;
  }) => {
    const weaponRef = useRef<TouchableOpacity>(null);

    return (
      <TouchableOpacity
        ref={weaponRef}
        onPress={() => openWeaponPopup(item.id, weaponRef)}
      >
        <Image
          source={getImage(item?.url)}
          style={styles.weaponImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  }
);

export default function DetailsScreen({ route, navigation }: Props) {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favoriteBosses.ids);
  const theme = useSelector((state: RootState) => state.theme.theme);
  const themeStyles = themes[theme];

  const { item } = route.params as { item: Boss };
  const bossIsFavorite = favorites.includes(+item.id);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [weaponsData, setWeaponsData] = useState<Record<string, Weapon>>({});
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);

  const scaleAnim = useRef(new Animated.Value(2)).current;

  const changeFavoriteStatusHandler = useCallback(() => {
    if (bossIsFavorite) {
      dispatch(removeFavorite({ id: item.id }));
    } else {
      dispatch(addFavorite({ id: item.id }));
    }
  }, [bossIsFavorite, dispatch, item.id]);

  const openWeaponPopup = (
    weaponId: string,
    weaponRef: MutableRefObject<TouchableOpacity>
  ) => {
    weaponRef.current.measure(
      (
        fx: number,
        fy: number,
        width: number,
        height: number,
        px: number,
        py: number
      ) => {
        setPopupPosition({ x: px + 40, y: py - 320 });
        setIsPopupVisible(true);
        setSelectedWeapon(weaponsData[weaponId]);
      }
    );
  };

  const closeWeaponPopup = () => {
    setIsPopupVisible(false);
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
    fetchWeapons()
      .then((response) => {
        const weapons = response.data;
        const weaponMap = weapons.reduce(
          (acc: Record<string, Weapon>, weapon: Weapon) => {
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

  const scrollHandler = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const newIndex = Math.ceil(event.nativeEvent.contentOffset.x / width);
      setActiveIndex(newIndex);
    },
    []
  );

  const renderBossImage = useCallback(
    ({ item }: { item: string }) => (
      <Image
        source={getImage(item)}
        style={styles.image}
        resizeMode="contain"
      />
    ),
    []
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
      <View style={styles.bossImagesContainer}>
        <FlatList
          data={item.images}
          renderItem={renderBossImage}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        />
        <View style={styles.pagination}>
          {item.images.map((_: string, index: number) => (
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
        {/* <View
          style={{ flexDirection: "row", marginTop: 32, alignSelf: "center" }}
        >
          <Image
            source={require("../assets/heart.png")}
            style={{ width: 40, height: 40 }}
            resizeMode="contain"
          />
          <View
            style={{
              width: "70%",
              alignSelf: "center",
              marginLeft: 4,
            }}
          >
            <View
              style={{
                height: 30,
                overflow: "hidden",
                borderRadius: 20,
                backgroundColor: "black",
              }}
            >
              <View
                style={{
                  width: `${(item.health / 2500) * 100}%`,
                  backgroundColor: Colors.red200,
                  height: "100%",
                  borderRadius: 16,
                }}
              />
            </View>
          </View>
        </View> */}
        <HealthBar currentHealth={item.health} maxHealth={2500} />
        <View style={styles.difficultyContainer}>
          <Difficulty difficulty={item.difficulty} />
        </View>
        <FlatList
          style={styles.weaponImagesContainer}
          data={item.recommendedWeapons.map(
            (weaponId: number) => weaponsData[weaponId]
          )}
          renderItem={({ item }) => (
            <WeaponItem item={item} openWeaponPopup={openWeaponPopup} />
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

      {isPopupVisible && selectedWeapon && (
        <WeaponPopup
          isVisible={isPopupVisible}
          weapon={selectedWeapon}
          position={popupPosition}
          onClose={closeWeaponPopup}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bossImagesContainer: {
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
});
