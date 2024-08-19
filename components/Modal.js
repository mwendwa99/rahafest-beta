import React from "react";
import { View, StyleSheet, Modal } from "react-native";

import Button from "./Button";
import { IconButton } from "react-native-paper";

const ModalComponent = ({ visible, toggleModal, ...props }) => {
  return (
    <Modal visible={visible} {...props}>
      <IconButton
        icon="close"
        size={20}
        mode="contained"
        onPress={toggleModal}
      />
      {props.children}
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default ModalComponent;
