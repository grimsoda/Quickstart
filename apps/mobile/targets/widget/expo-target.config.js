/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = (config) => ({
  type: "widget",

  name: "QuickstartWidget",

  entitlements: {
    "com.apple.security.application-groups":
      config.ios.entitlements["com.apple.security.application-groups"],
  },

  deploymentTarget: "17.0",

  bundleIdentifier: ".widget",

  // Widget families (systemSmall, systemMedium) are configured in Swift code
  // using the supportedFamilies property in the Widget struct, not in this config file.
});
