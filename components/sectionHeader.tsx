import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
  Dimensions,
} from "react-native";

const { height: screenHeight } = Dimensions.get("window");

type SectionHeaderProps = {
  section: { id: string; title: string };
  expandedIsle: string;
  themeStyles: { backgroundColor: string };
  toggleIsle: (id: string) => void;
};

export function SectionHeader({
  section,
  expandedIsle,
  themeStyles,
  toggleIsle,
}: SectionHeaderProps) {
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
}

const styles = StyleSheet.create({
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
});
