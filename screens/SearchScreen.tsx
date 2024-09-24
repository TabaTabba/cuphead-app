import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { themes } from "../data/themeData";
import { useLayoutEffect, useState } from "react";
import { BOSSES } from "../data/mockData";
import { ImageButton } from "../components/imageButton";
import { Picker } from "@react-native-picker/picker";
import RNPickerSelect from "react-native-picker-select";
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
      <View style={styles.filterContainer}>
        <View style={styles.difficultyContainer}>
          <Text style={styles.difficultyText}>Difficulty</Text>
          <StarRating onRatingPress={setSelectedDifficulty} />
        </View>
        {/* <Picker
          selectedValue={selectedIsle}
          onValueChange={(itemValue) => setSelectedIsle(itemValue)}
          style={styles.picker}
        >
          <Picker.Item
            label="Select Isle"
            value={0}
            style={styles.pickerItem}
            color="white"
          />
          <Picker.Item label="I" value={1} color="white" />
          <Picker.Item label="II" value={2} color="white" />
          <Picker.Item label="III" value={3} color="white" />
        </Picker> */}
      </View>
      {/* <RNPickerSelect
        onValueChange={(value) => console.log(value)}
        items={[
          { label: "0.5", value: 0.5 },
          { label: "1", value: 1 },
        ]}
      /> */}
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
  inputContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "white",
  },
  input: {
    fontSize: 16,
    color: "white",
    backgroundColor: "transparent",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  difficultyContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  difficultyText: {
    color: "white",
    fontFamily: "futura",
    fontSize: 18,
    fontWeight: "bold",
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
    flex: 1,
    marginTop: 20,
  },
});
