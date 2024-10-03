import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { View, StyleSheet, Dimensions, FlatList, Animated } from "react-native";
import { Boss } from "../data/types";
import { IconButton } from "../components/iconButton";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../redux/theme";
import { RootState } from "../redux/store";
import { themes } from "../data/themeData";
import { ImageButton } from "../components/imageButton";
import { fetchBosses } from "../utility/api";
import { SectionHeader } from "../components/sectionHeader";
import { BossItem } from "../components/bossItem";

const { height: screenHeight } = Dimensions.get("window");

export default function MainScreen({ navigation }) {
  const [expandedIsle, setExpandedIsle] = useState<string | null>(null);
  const [isles, setIsles] = useState<
    { id: string; title: string; data: Boss[] }[]
  >([]);

  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.theme);
  const themeStyles = useMemo(() => themes[theme], [theme]);

  const themeConfig = {
    default: {
      icon: require("../assets/cuphead-theme.png"),
      action: () => dispatch(setTheme("cuphead")),
    },
    cuphead: {
      icon: require("../assets/mugman-theme.png"),
      action: () => dispatch(setTheme("mugman")),
    },
    mugman: {
      icon: "moon",
      action: () => dispatch(setTheme("default")),
    },
  };
  const ThemeButton = themeConfig[theme];

  const commonButtonProps = {
    source: ThemeButton.icon,
    width: 28,
    height: 28,
    style: { tintColor: "white", marginBottom: 20 },
    onPress: ThemeButton.action,
  };

  useEffect(() => {
    fetchBosses()
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
      })
      .catch((error) => {
        console.error("Error fetching bosses:", error);
      });
  }, []);

  const toggleIsle = (id: string) => {
    setExpandedIsle(expandedIsle === id ? null : id);
  };

  const navigateToAnotherScreen = useCallback(
    (path: string) => {
      navigation.navigate(`${path}`);
    },
    [navigation]
  );

  function renderItem({ item }: { item: Boss }) {
    return <BossItem item={item} themeStyles={themeStyles} />;
  }

  const renderSection = ({
    section,
  }: {
    section: { id: string; data: Boss[] };
  }) => {
    const isExpanded = expandedIsle === section.id;

    return isExpanded ? (
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
    ) : null;
  };

  return (
    <View style={styles.rootContainer}>
      <View
        style={[
          styles.sidebar,
          { backgroundColor: themeStyles.backgroundColor },
        ]}
      >
        <View
          style={{
            marginBottom: 48,
          }}
        >
          {theme !== "mugman" ? (
            <ImageButton {...commonButtonProps} />
          ) : (
            <IconButton
              name={ThemeButton.icon}
              size={28}
              color="white"
              style={{ marginBottom: 20 }}
              onPress={ThemeButton.action}
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
        style={{
          flexGrow: 1,
          backgroundColor: themeStyles.backgroundColor,
        }}
      >
        {isles.map((isle) => (
          <View key={isle.id}>
            <SectionHeader
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
});
