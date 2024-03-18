import * as Location from "expo-location";

const AndroidLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status;
  } catch (error) {
    console.log("PERM ERR: ", error);
    return false;
  }
};

export { AndroidLocation };