import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import { BOSSES } from "../data/mockData";
import { Boss } from "../data/types";
import { IconButton } from "../components/iconButton";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../redux/theme";
import { RootState } from "../redux/store";
import { themes } from "../data/themeData";
import { ImageButton } from "../components/imageButton";

const { height: screenHeight } = Dimensions.get("window");

const isles = [
  {
    id: "1",
    title: "ISLE 1",
    data: BOSSES.filter((boss) => boss.isle === 1),
  },
  { id: "2", title: "ISLE 2", data: BOSSES.filter((boss) => boss.isle === 2) },
  { id: "3", title: "ISLE 3", data: BOSSES.filter((boss) => boss.isle === 3) },
];

const RenderSectionHeader = ({
  section,
  expandedIsle,
  themeStyles,
  toggleIsle,
}: {
  section: { id: string; title: string };
  expandedIsle: string;
  themeStyles: any;
  toggleIsle: any;
}) => {
  const isExpanded = expandedIsle === section.id;

  return (
    <TouchableWithoutFeedback onPress={() => toggleIsle(section.id)}>
      <View
        style={[
          styles.isleHeader,
          { backgroundColor: themeStyles.backgroundColor },
          expandedIsle
            ? {
                height:
                  isExpanded || section.id === "1"
                    ? screenHeight / 10
                    : screenHeight / 20,
              }
            : { height: screenHeight / 3 },
          expandedIsle && section.id === "1"
            ? { justifyContent: "flex-end" }
            : { justifyContent: "center" },
        ]}
      >
        <Text style={styles.isleTitle}>{section.title}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default function MainScreen({ navigation }: any) {
  const [expandedIsle, setExpandedIsle] = useState<string | null>(null);
  const dispatch = useDispatch();

  const theme = useSelector((state: RootState) => state.theme.theme);
  const themeStyles = themes[theme];

  const toggleIsle = (id: string) => {
    setExpandedIsle(expandedIsle === id ? null : id);
  };

  const renderItem = ({ item }: { item: Boss }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("DetailsScreen", { item })}
    >
      <View
        style={[
          styles.itemContainer,
          { backgroundColor: themeStyles.backgroundColor },
        ]}
      >
        <Image
          source={item.coverImage}
          style={styles.bossImage}
          resizeMode="contain"
        />
        <Text style={styles.title}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSection = ({
    section,
  }: {
    section: { id: string; data: Boss[] };
  }) => {
    const isExpanded = expandedIsle === section.id;

    if (!isExpanded) {
      return null;
    }

    return (
      <FlatList
        style={
          isExpanded && section.id === "1"
            ? { height: screenHeight * 0.8 }
            : { height: screenHeight * 0.75 }
        }
        data={section.data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <View style={styles.rootContainer}>
      <View
        style={[
          styles.sidebar,
          { backgroundColor: themeStyles.backgroundColor },
        ]}
      >
        <View style={styles.iconsContainer}>
          <ImageButton
            source={require("../assets/cuphead-theme.png")}
            width={28}
            height={28}
            style={{ tintColor: "white", marginBottom: 20 }}
            onPress={() => dispatch(setTheme("cuphead"))}
          />
          <ImageButton
            source={require("../assets/mugman-theme.png")}
            width={28}
            height={28}
            style={{ tintColor: "white", marginBottom: 20 }}
            onPress={() => dispatch(setTheme("mugman"))}
          />
          <IconButton
            size={28}
            name="moon"
            color="white"
            style={{ marginBottom: 20 }}
            onPress={() => dispatch(setTheme("default"))}
          />
          <IconButton
            name="star"
            size={28}
            color={"white"}
            style={{ marginBottom: 20 }}
            onPress={() => {
              navigation.navigate("FavoritesScreen");
            }}
          />
          <IconButton
            name="search"
            size={28}
            color={"white"}
            style={{ marginBottom: 20 }}
            onPress={() => {
              navigation.navigate("SearchScreen");
            }}
          />
        </View>
      </View>
      <View
        style={[
          styles.sectionsContainer,
          { backgroundColor: themeStyles.backgroundColor },
        ]}
      >
        {isles.map((isle) => (
          <View key={isle.id}>
            <RenderSectionHeader
              section={isle}
              expandedIsle={expandedIsle}
              themeStyles={themeStyles}
              toggleIsle={toggleIsle}
            />
            {renderSection({ section: isle })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flexDirection: "row",
  },
  sidebar: {
    width: "10%",

    borderRightWidth: 2,
    borderColor: "black",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
  },
  logo: {
    width: 32,
    height: 32,
    marginTop: 100,
  },
  iconsContainer: {
    marginBottom: 50,
    justifyContent: "space-between",
  },
  sectionsContainer: {
    flexGrow: 1,
  },
  isleHeader: {
    borderBottomWidth: 0.75,
    borderTopWidth: 0.75,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  isleTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#E0E0E0",
    fontFamily: "futura",
  },
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
  title: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: "bold",
    color: "#E0E0E0",
    fontFamily: "futura",
  },
});
