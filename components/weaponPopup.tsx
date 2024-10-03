import React from "react";
import { View, Text, TouchableWithoutFeedback, StyleSheet } from "react-native";
import { Weapon } from "../data/types";
import { Colors } from "../assets/colors";

type WeaponPopupProps = {
  isVisible: boolean;
  weapon: Weapon | null;
  position: { x: number; y: number };
  onClose: () => void;
};

export const WeaponPopup: React.FC<WeaponPopupProps> = ({
  isVisible,
  weapon,
  position,
  onClose,
}) => {
  if (!isVisible || !weapon) return null;

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.popupOverlay}>
        <View
          style={[
            styles.popupContainer,
            {
              top: position.y,
              left: position.x - 100,
            },
          ]}
        >
          <View
            style={{
              backgroundColor: weapon.color,
              width: "100%",
              alignItems: "center",
            }}
          >
            <Text style={styles.popupTitle}>{weapon.name}</Text>
          </View>
          <View style={styles.weaponStatsContainer}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Damage:</Text>
              <Text style={styles.statValue}>{weapon.damage}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>EX Damage:</Text>
              <Text style={styles.statValue}>{weapon.exDamage}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>DPS:</Text>
              <Text style={styles.statValue}>{weapon.dps}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  popupOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  popupContainer: {
    position: "absolute",
    width: 200,
    backgroundColor: Colors.black400,
    borderRadius: 10,
    paddingBottom: 16,
    alignItems: "center",
  },
  popupTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 16,
  },
  weaponStatsContainer: {
    width: "100%",
    alignItems: "center",
  },
  statRow: {
    flexDirection: "column",
    alignItems: "center",
    marginVertical: 4,
  },
  statLabel: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  statValue: {
    color: "white",
    fontSize: 16,
  },
});
