import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  FlatList,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { Boss } from "../data/types";
import { IconButton } from "../components/iconButton";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../redux/theme";
import { RootState } from "../redux/store";
import { themes } from "../data/themeData";
import { ImageButton } from "../components/imageButton";
import { imageMapping } from "../data/imageMapping";
import { addFavorite, removeFavorite } from "../redux/favorites";

const { height: screenHeight } = Dimensions.get("window");

const getImage = (path: string) => {
  return imageMapping[path] || null;
};

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
  const [isles, setIsles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const favorites = useSelector((state: RootState) => state.favoriteBosses.ids);

  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.theme);
  const themeStyles = useMemo(() => themes[theme], [theme]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/bosses")
      .then((response) => {
        const bosses = response.data;
        const organizedIsles = [
          {
            id: "1",
            title: "ISLE 1",
            data: bosses.filter((boss: Boss) => boss.isle === 1),
          },
          {
            id: "2",
            title: "ISLE 2",
            data: bosses.filter((boss: Boss) => boss.isle === 2),
          },
          {
            id: "3",
            title: "ISLE 3",
            data: bosses.filter((boss: Boss) => boss.isle === 3),
          },
        ];
        setIsles(organizedIsles);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching bosses:", error);
        setLoading(false);
      });
  }, []);

  const toggleIsle = (id: string) => {
    setExpandedIsle(expandedIsle === id ? null : id);
  };

  const navigateToAnotherScreen = useCallback(
    (path: string, item?: Boss) => {
      navigation.navigate(`${path}`, item && { item });
    },
    [navigation]
  );

  function renderItem({ item }: { item: Boss }) {
    const bossIsFavorite = favorites.includes(+item.id);

    function changeFavoriteStatusHandler() {
      if (bossIsFavorite) {
        dispatch(removeFavorite({ id: item.id }));
      } else {
        dispatch(addFavorite({ id: item.id }));
      }
    }
    return (
      <>
        <TouchableOpacity
          onPress={() => navigateToAnotherScreen("DetailsScreen", item)}
        >
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
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.rootContainer}>
      <View
        style={[
          styles.sidebar,
          { backgroundColor: themeStyles.backgroundColor },
        ]}
      >
        <View style={styles.iconsContainer}>
          {theme === "default" && (
            <ImageButton
              source={require("../assets/cuphead-theme.png")}
              width={28}
              height={28}
              style={{ tintColor: "white", marginBottom: 20 }}
              onPress={() => dispatch(setTheme("cuphead"))}
            />
          )}
          {theme === "cuphead" && (
            <ImageButton
              source={require("../assets/mugman-theme.png")}
              width={28}
              height={28}
              style={{ tintColor: "white", marginBottom: 20 }}
              onPress={() => dispatch(setTheme("mugman"))}
            />
          )}
          {theme === "mugman" && (
            <IconButton
              size={28}
              name="moon"
              color="white"
              style={{ marginBottom: 20 }}
              onPress={() => dispatch(setTheme("default"))}
            />
          )}
          <IconButton
            name="star"
            size={28}
            color={"white"}
            style={{ marginBottom: 20 }}
            onPress={() => navigateToAnotherScreen("FavoritesScreen")}
          />
          <IconButton
            name="search"
            size={28}
            color={"white"}
            style={{ marginBottom: 20 }}
            onPress={() => navigateToAnotherScreen("SearchScreen")}
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
    color: "white",
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
  bossTitle: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    fontFamily: "futura",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  starIcon: {
    position: "absolute",
    top: 20,
    right: 10,
  },
});
