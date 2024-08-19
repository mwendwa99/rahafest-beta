import React from "react";
import { View, StyleSheet, Modal } from "react-native";

import Button from "./Button";

const ModalComponent = ({ visible, ...props }) => {
  return (
    <Modal visible={visible} {...props}>
      <Button
        label="close modal"
        variant={"contained"}
        // onPress={() => setShowPhoneInputModal(false)}
      />
      {props.children}
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: 300,
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default ModalComponent;
