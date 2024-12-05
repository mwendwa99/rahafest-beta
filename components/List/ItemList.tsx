import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "../Avatar";
import Typography from "../Typography";

type ItemListProps = {
  title: string;
  subtitle?: string;
  startIcon?: string;
  endIcon?: string;
  disabled?: boolean;
  style?: ViewStyle;
  onPress?: (event: GestureResponderEvent) => void;
  avatar?: string;
};

const ItemList: React.FC<ItemListProps> = ({
  avatar,
  title,
  subtitle,
  startIcon,
  endIcon,
  disabled = false,
  style,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, style, disabled && styles.disabled]}
      onPress={disabled ? undefined : onPress}
      activeOpacity={disabled ? 1 : 0.7}
    >
      <View style={styles.iconWrapper}>
        {startIcon && !avatar && (
          <Ionicons name={startIcon} size={24} style={styles.startIcon} />
        )}
        {avatar && !startIcon && (
          <Avatar width={50} height={50} fontSize={24} names={avatar} />
        )}
      </View>
      <View style={styles.textWrapper}>
        <Typography style={[styles.title, disabled && styles.disabledText]}>
          {title}
        </Typography>
        {subtitle && (
          <Typography
            style={[styles.subtitle, disabled && styles.disabledText]}
          >
            {subtitle}
          </Typography>
        )}
      </View>
      <Ionicons
        name={endIcon}
        size={24}
        style={[styles.endIcon, disabled && styles.disabledText]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  iconWrapper: {
    marginRight: 15,
  },
  startIcon: {
    color: "#888",
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fafafa",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  endIcon: {
    color: "#888",
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: "#aaa",
  },
});

export default ItemList;
