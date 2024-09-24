import Toast from "react-native-root-toast";

export const warning = async (msg, time = Toast.durations.SHORT) => {
  await showToast(msg, time, "warning");
};

export const danger = async (msg, time = Toast.durations.SHORT) => {
  await showToast(msg, time, "danger");
};

export const success = async (msg, time = Toast.durations.SHORT) => {
  await showToast(msg, time, "success");
};

const showToast = async (msg, time, type) => {
  let backgroundColor;

  switch (type) {
    case "success":
      backgroundColor = "green";
      break;
    case "warning":
      backgroundColor = "orange";
      break;
    case "danger":
      backgroundColor = "red";
      break;
    default:
      backgroundColor = "black";
  }

  Toast.show(msg, {
    duration: time,
    backgroundColor,
    textColor: "white",
    shadow: true,
    animation: true,
    hideOnPress: true,
    position: Toast.positions.CENTER,
  });
};
