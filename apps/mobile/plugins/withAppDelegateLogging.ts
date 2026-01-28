import { withAppDelegate, type ConfigPlugin } from 'expo/config-plugins';

/**
 * Config plugin to add os_log at the start of AppDelegate's didFinishLaunchingWithOptions method
 * This logs app launch parameters before React Native initialization
 */
const withAppDelegateLogging: ConfigPlugin = (config) => {
  return withAppDelegate(config, (config) => {
    const { modResults, modRequest } = config;

    const logStatement = `
        os_log("🚀 App Launch - LaunchOptions: %{public}@, ProcessName: %{public}@, BundleIdentifier: %{public}@", String(describing: launchOptions), ProcessInfo.processInfo.processName, Bundle.main.bundleIdentifier ?? "unknown")
`;

    if (modResults.contents) {
      const methodPattern = /func application\(.*didFinishLaunchingWithOptions.*-> Bool \{/;
      modResults.contents = modResults.contents.replace(
        methodPattern,
        (match) => match + logStatement
      );
    }

    return config;
  });
};

export default withAppDelegateLogging;
