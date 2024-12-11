import { withInfoPlist } from "expo/config-plugins";

export const withNotificationPermissions = (config) => {
  return withInfoPlist(config, (config) => {
    // Add notification usage description
    config.modResults.NSUserNotificationUsageDescription =
      "We need notification permissions to keep you updated with important information";

    // Enable background notifications if not already enabled
    if (!config.modResults.UIBackgroundModes) {
      config.modResults.UIBackgroundModes = ["remote-notification"];
    } else if (
      Array.isArray(config.modResults.UIBackgroundModes) &&
      !config.modResults.UIBackgroundModes.includes("remote-notification")
    ) {
      config.modResults.UIBackgroundModes.push("remote-notification");
    }

    return config;
  });
};
