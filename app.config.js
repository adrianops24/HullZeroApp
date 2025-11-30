export default {
  expo: {
    name: 'HullZero',
    slug: 'hullzero-tmxlsfgvztx4keipg653', // 👈 slug solicitado
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',

    owner: 'adriano.tsx',

    splash: {
      image: './src/assets/LogoHull.png',
      resizeMode: 'contain',
      backgroundColor: '#070710'
    },

    extra: {
      eas: {
        projectId: '468f84de-c9ae-4b97-b421-58de2472b5f9'
      }
    },

    android: {
      softwareKeyboardLayoutMode: 'pan',
      package: 'com.hackthon.ad.hullzero',
      edgeToEdge: true,
      adaptiveIcon: {
        foregroundImage: './src/assets/LogoHull.png',
        backgroundColor: '#070710'
      }
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.hackthon.ad.hullzero'
    },

    plugins: [
      [
        'expo-build-properties',
        {
          android: {
            compileSdkVersion: 35,
            targetSdkVersion: 35,
            buildToolsVersion: '35.0.0'
          }
        }
      ]
    ]
  }
};
