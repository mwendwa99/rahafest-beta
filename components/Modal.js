import React from "react";
import { View, StyleSheet, Modal, StatusBar, Platform } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { IconButton, Text } from "react-native-paper";

const ModalComponent = ({ visible, toggleModal, ...props }) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent={true} animationType="fade" {...props}>
      <View style={styles.modalContainer}>
        <View
          style={[
            styles.modalContent,
            {
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
              paddingLeft: insets.left,
              paddingRight: insets.right,
            },
          ]}
        >
          <View style={styles.header}>
            <IconButton
              icon="close"
              size={24}
              onPress={toggleModal}
              style={styles.closeButton}
              mode="contained"
            />
          </View>
          <View style={styles.content}>{props.children}</View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
  },
  modalContent: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 10,
  },
  closeButton: {
    margin: 0,
  },
  content: {
    flex: 1,
    padding: 20,
  },
});

export default ModalComponent;
