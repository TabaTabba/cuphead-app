import React, { useCallback } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Boss, RootStackParamList } from "../data/types";
import { IconButton } from "./iconButton";
import { getImage } from "../utility/getImage";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../redux/favorites";
import { RootState } from "../redux/store";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

type BossItemProps = {
  item: Boss;
  themeStyles: { backgroundColor: string };
};

export function BossItem({ item, themeStyles }: BossItemProps) {
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const favorites = useSelector((state: RootState) => state.favoriteBosses.ids);
  const bossIsFavorite = favorites.includes(+item.id);

  const navigateToDetails = useCallback(
    (item: Boss) => {
      navigation.navigate("DetailsScreen", { item });
    },
    [navigation]
  );

  function changeFavoriteStatusHandler() {
    if (bossIsFavorite) {
      dispatch(removeFavorite({ id: item.id }));
    } else {
      dispatch(addFavorite({ id: item.id }));
    }
  }

  return (
    <>
      <TouchableOpacity onPress={() => navigateToDetails(item)}>
        <View
          style={[
            styles.itemContainer,
            { backgroundColor: themeStyles.backgroundColor },
          ]}
        >
          <Image
            source={getImage(item.coverImage)}
            style={styles.bossImage}
            resizeMode="contain"
          />
          <Text style={styles.bossTitle}>{item.name}</Text>
        </View>
      </TouchableOpacity>
      <IconButton
        name={bossIsFavorite ? "star" : "star-outline"}
        size={28}
        color="white"
        onPress={changeFavoriteStatusHandler}
        style={styles.starIcon}
      />
    </>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    paddingHorizontal: 10,
    paddingVertical: 25,
    borderBottomWidth: 0.5,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  bossImage: {
    width: "95%",
    height: 400,
  },
  bossTitle: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    fontFamily: "futura",
  },
  starIcon: {
    position: "absolute",
    top: 20,
    right: 10,
  },
});
