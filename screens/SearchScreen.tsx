import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { themes } from "../data/themeData";
import { useLayoutEffect, useState } from "react";
import { BOSSES } from "../data/mockData";
import { ImageButton } from "../components/imageButton";
import StarRating from "../components/starRating";

const screenWidth = Dimensions.get("window").width;

function SearchScreen({ navigation }: any) {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const themeStyles = themes[theme];
  const [searchText, setSearchText] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<number>(0);
  const [selectedIsle, setSelectedIsle] = useState<number>(0);

  const filteredBosses = BOSSES.filter((boss) => {
    const matchesSearch = boss.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesDifficulty =
      selectedDifficulty == 0 || boss.difficulty == selectedDifficulty;
    const matchesIsle = selectedIsle == 0 || boss.isle == selectedIsle;
    return matchesSearch && matchesDifficulty && matchesIsle;
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: themeStyles.backgroundColor,
      },
    });
  }, [navigation]);

  function searchHandler(text: string) {
    setSearchText(text);
  }

  function renderBoss({ item }: { item: any }) {
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
      <View style={styles.filtersContainer}>
        <View style={styles.filterContainer}>
          <Text style={styles.filterText}>Difficulty</Text>
          <StarRating onRatingPress={setSelectedDifficulty} />
        </View>
        <View style={styles.filterContainer}>
          <Text style={[styles.filterText, { marginBottom: 24 }]}>Isle</Text>
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[
                styles.isleButton,
                selectedIsle === 1 && { backgroundColor: "white" },
              ]}
              onPress={() => setSelectedIsle(selectedIsle === 1 ? 0 : 1)}
            >
              <Text
                style={[
                  selectedIsle === 1 ? { color: "black" } : { color: "white" },
                ]}
              >
                I
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.isleButton,
                selectedIsle === 2 && { backgroundColor: "white" },
              ]}
              onPress={() => setSelectedIsle(selectedIsle === 2 ? 0 : 2)}
            >
              <Text
                style={[
                  selectedIsle === 2 ? { color: "black" } : { color: "white" },
                ]}
              >
                II
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.isleButton,
                selectedIsle === 3 && { backgroundColor: "white" },
              ]}
              onPress={() => setSelectedIsle(selectedIsle === 3 ? 0 : 3)}
            >
              <Text
                style={[
                  selectedIsle === 3 ? { color: "black" } : { color: "white" },
                ]}
              >
                III
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={searchText}
          onChangeText={searchHandler}
          placeholder="Search Bosses..."
          placeholderTextColor="white"
          autoCorrect={false}
        />
      </View>
      <View style={styles.resultsContainer}>
        <FlatList
          data={filteredBosses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderBoss}
          ListEmptyComponent={() => (
            <Text style={styles.noResultsText}>No bosses found</Text>
          )}
          showsVerticalScrollIndicator={false}
          numColumns={2}
        />
      </View>
    </View>
  );
}

export default SearchScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    padding: 20,
  },
  filtersContainer: {
    flex: 6,
    flexDirection: "column",
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  filterText: {
    color: "white",
    fontFamily: "futura",
    fontSize: 20,
    fontWeight: "bold",
  },
  isleButton: {
    width: 88,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "white",
    borderWidth: 1,
    marginLeft: 8,
    borderRadius: 4,
  },
  inputContainer: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "white",
  },
  input: {
    fontSize: 16,
    color: "white",
  },
  itemContainer: {
    marginBottom: 40,
    flex: 1,
    margin: 5,
    maxWidth: screenWidth / 2 - 10,
    alignItems: "center",
  },
  bossName: {
    fontSize: 18,
    color: "white",
  },
  noResultsText: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
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
  resultsContainer: {
    flex: 30,
    marginTop: 20,
  },
});
