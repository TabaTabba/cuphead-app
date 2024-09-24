import React, { useLayoutEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Boss, RootStackParamList } from "../data/types";
import { IconButton } from "../components/iconButton";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../redux/favorites";
import { RootState } from "../redux/store";
import Difficulty from "../components/difficulty";
import { themes } from "../data/themeData";

type Props = NativeStackScreenProps<RootStackParamList, "DetailsScreen">;

export default function DetailsScreen({ route, navigation }: Props) {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favoriteBosses.ids);
  const theme = useSelector((state: RootState) => state.theme.theme);
  const themeStyles = themes[theme];

  const { item } = route.params as { item: Boss };
  const bossIsFavorite = favorites.includes(+item.id);
  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = Dimensions.get("window");

  function changeFavoriteStatusHandler() {
    if (bossIsFavorite) {
      dispatch(removeFavorite({ id: item.id }));
    } else {
      dispatch(addFavorite({ id: item.id }));
    }
  }

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

  const handleScroll = (event: any) => {
    const newIndex = Math.ceil(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(newIndex);
  };

  const renderImageItem = ({ item }: { item: any }) => (
    <Image source={item} style={styles.image} resizeMode="contain" />
  );

  return (
    <View
      style={[
        styles.rootContainer,
        { backgroundColor: themeStyles.backgroundColor },
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
          onScroll={handleScroll}
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
        <View style={{ paddingVertical: 16 }}>
          <Difficulty difficulty={item.difficulty} />
        </View>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.appearanceContainer}>Appearance</Text>
        <Text style={styles.appearance}>{item.appearance}</Text>
        <Text style={styles.personalityContainer}>Personality</Text>
        <Text style={styles.personality}>{item.appearance}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    width: Dimensions.get("window").width * 0.9,
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
    backgroundColor: "#fff",
    borderRadius: 5,
    marginHorizontal: 5,
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
