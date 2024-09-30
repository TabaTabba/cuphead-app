import { useSelector } from "react-redux";
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { RootState } from "../redux/store";

import { themes } from "../data/themeData";
import { useLayoutEffect } from "react";
import { ImageButton } from "../components/imageButton";
import { BOSSES } from "../data/mockData";

const screenWidth = Dimensions.get("window").width;

function FavoritesScreen({ navigation }: any) {
  const favoriteBossIds = useSelector(
    (state: RootState) => state.favoriteBosses.ids
  );
  const theme = useSelector((state: RootState) => state.theme.theme);
  const themeStyles = themes[theme];

  const favoriteBosses = BOSSES.filter((boss) =>
    favoriteBossIds.includes(+boss.id)
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: themeStyles.backgroundColor,
      },
    });
  }, [navigation]);

  if (favoriteBosses.length === 0) {
    return (
      <View
        style={[
          styles.rootContainer,
          styles.emptyStateContainer,
          { backgroundColor: themeStyles.backgroundColor },
        ]}
      >
        <Text style={styles.emptyStateTitle}>
          You have no favorite bosses yet!
        </Text>
      </View>
    );
  }

  function renderBossItem({ item }: { item: any }) {
    return (
      <View style={styles.itemContainer}>
        <ImageButton
          source={item.coverImage}
          style={styles.image}
          resizeMode="contain"
          onPress={() => navigation.navigate("DetailsScreen", { item })}
        />
        <Text style={styles.name}>{item.name}</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.rootContainer,
        { backgroundColor: themeStyles.backgroundColor },
      ]}
    >
      <FlatList
        data={favoriteBosses}
        keyExtractor={(item) => item.id}
        renderItem={renderBossItem}
        showsVerticalScrollIndicator={false}
        numColumns={2}
      />
    </View>
  );
}

export default FavoritesScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    padding: 20,
  },
  emptyStateContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 150,
  },
  itemContainer: {
    marginBottom: 40,
    flex: 1,
    margin: 5,
    maxWidth: screenWidth / 2 - 10,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
