// HealthBar.tsx
import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Colors } from "../assets/colors";

interface HealthBarProps {
  currentHealth: number;
  maxHealth: number;
}

export default function ({ currentHealth, maxHealth }: HealthBarProps) {
  const healthPercentage = (currentHealth / maxHealth) * 100;

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/heart.png")}
        style={styles.heartIcon}
        resizeMode="contain"
      />
      <View style={styles.barContainer}>
        <View style={styles.backgroundBar}>
          <View
            style={[
              styles.healthBar,
              { width: `${healthPercentage}%`, backgroundColor: Colors.red200 },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop: 32,
    alignSelf: "center",
  },
  heartIcon: {
    width: 40,
    height: 40,
  },
  barContainer: {
    width: "70%",
    alignSelf: "center",
    marginLeft: 4,
  },
  backgroundBar: {
    height: 30,
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "black",
  },
  healthBar: {
    height: "100%",
    borderRadius: 16,
  },
});
