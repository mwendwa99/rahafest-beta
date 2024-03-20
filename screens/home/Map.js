import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, Image, View } from "react-native";
import MapView, {
  Callout,
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
} from "react-native-maps";
// import LiveMap from '../app/components/livemap'

import { AndroidLocation } from "../../utils/permissions";

const LiveMap = () => {
  const [currentPosition, setCurrentLocation] = useState({
    latitude: -1.3264437836590561,
    longitude: 36.80311585942039,
  });
  const [loading, setLoading] = useState(true);
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    const getLocation = async () => {
      try {
        await AndroidLocation();

        Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Highest, timeInterval: 1000 },
          (location) => {
            setCurrentLocation(location.coords);
            setLoading(false);
          }
        );

        Location.watchHeadingAsync((heading) => {
          setHeading(heading.trueHeading);
        });
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    getLocation();
  }, []);

  return (
    <View>
      <Marker
        coordinate={{
          latitude: currentPosition.latitude,
          longitude: currentPosition.longitude,
        }}
        title="my location"
        calloutEnabled
        tracksViewChanges
        rotation={heading}
        pinColor="green"
      >
        <Callout>
          <View>
            {/* <Image style={tyles.icon} source={require('../../assets/icons/bar1.png')} /> */}
          </View>
        </Callout>
      </Marker>
    </View>
  );
};

const Map = () => {
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: -1.3260428510920745,
          longitude: 36.80065023291559,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        // minZoomLevel={17}
        // maxZoomLevel={18.5}
        mapType="satellite"
        loadingEnabled
      >
        <LiveMap />

        {/* main stage */}
        <Marker
          coordinate={{
            latitude: -1.3250194031472067,
            longitude: 36.80053424261274,
          }}
          title="Stage"
          description="Main stage"
          calloutEnabled
          tracksViewChanges
        >
          <View style={styles.imageContainer}>
            <Image
              style={styles.icon}
              source={require("../../assets/icons/stage.png")}
            />
          </View>
          <Callout>
            <View>
              <Text style={styles.label}>Stage</Text>
            </View>
          </Callout>
        </Marker>

        {/* raha fest 3d logo */}
        <Marker
          coordinate={{
            latitude: -1.3268865200872235,
            longitude: 36.80053273074613,
          }}
          title="Rahafest 3D logo"
          description="Rahafest 3D logo"
          calloutEnabled
          tracksViewChanges
        >
          <View style={styles.imageContainer}>
            <Image
              style={styles.icon}
              source={require("../../assets/icons/logo-design.png")}
            />
          </View>
          <Callout>
            <View>
              <Text style={styles.label}>Rahafest 3D Logo</Text>
            </View>
          </Callout>
        </Marker>

        {/* Main concert area */}
        <Marker
          coordinate={{
            latitude: -1.325947998501439,
            longitude: 36.800543459581974,
          }}
          title="Concert area"
          description="Main concert area"
          calloutEnabled
          tracksViewChanges
        >
          <View style={styles.imageContainer}>
            <Image
              style={styles.icon}
              source={require("../../assets/icons/hands-up.png")}
            />
          </View>
          <Callout style={{ width: "auto" }}>
            <View>
              <Text style={styles.label}>Concert Area</Text>
            </View>
          </Callout>
        </Marker>

        {/* exit */}
        <Marker
          coordinate={{
            latitude: -1.3273852771279349,
            longitude: 36.80075267188107,
          }}
          title="Exit"
          description="exit"
          calloutEnabled
          tracksViewChanges
        >
          <View style={styles.imageContainer}>
            {/* <Image style = { styles.icon } source={require('../../assets/icons/exit.png')} /> */}
          </View>
          <Callout>
            <View>
              <Text style={styles.label}>Exit</Text>
            </View>
          </Callout>
        </Marker>
        <Polyline
          coordinates={[
            { latitude: -1.3273852771279349, longitude: 36.80075267188107 },
            { latitude: -1.327619938609936, longitude: 36.80109511665861 },
          ]}
          strokeColor="#fff"
          strokeWidth={2}
        />

        <Marker
          coordinate={{
            latitude: -1.327619938609936,
            longitude: 36.80109511665861,
          }}
          title="Exit"
          description="exit"
          calloutEnabled
          tracksViewChanges
        >
          <View style={styles.imageContainer}>
            <Image
              style={styles.icon}
              source={require("../../assets/icons/exit.png")}
            />
          </View>
          <Callout>
            <View>
              <Text style={styles.label}>Exit</Text>
            </View>
          </Callout>
        </Marker>

        {/* VIP entrance */}
        <Marker
          coordinate={{
            latitude: -1.3273852771279349,
            longitude: 36.800548823999904,
          }}
          title="VIP entrance"
          description="VIP entrance"
          calloutEnabled
        >
          <View style={styles.imageContainer}>
            {/* <Image style = { styles.icon } source={require('../../assets/icons/red-carpet.png')} /> */}
          </View>
          <Callout>
            <View>
              <Text style={styles.label}>VIP entrance</Text>
            </View>
          </Callout>
        </Marker>

        <Polyline
          coordinates={[
            { latitude: -1.3273852771279349, longitude: 36.800548823999904 },
            { latitude: -1.3279631691705918, longitude: 36.80055867486607 },
          ]}
          strokeColor="#fff"
          strokeWidth={2}
        />
        <Marker
          coordinate={{
            latitude: -1.3279631691705918,
            longitude: 36.80055867486607,
          }}
          title="VIP entrance"
          description="VIP entrance"
          calloutEnabled
        >
          <View style={styles.imageContainer}>
            <Image
              style={styles.icon}
              source={require("../../assets/icons/red-carpet.png")}
            />
          </View>
          <Callout>
            <View>
              <Text style={styles.label}>VIP entrance</Text>
            </View>
          </Callout>
        </Marker>

        {/* Regular entrance */}
        <Marker
          coordinate={{
            latitude: -1.327428180954696,
            longitude: 36.80033424728288,
          }}
          title="Regular entrance"
          description="Regular entrance"
          calloutEnabled
        >
          <View style={styles.imageContainer}>
            {/* <Image style = { styles.icon } source={require('../../assets/icons/entrance.png')} /> */}
          </View>
          <Callout>
            <View>
              <Text style={styles.label}>Regular entrance</Text>
            </View>
          </Callout>
        </Marker>

        <Polyline
          coordinates={[
            { latitude: -1.327428180954696, longitude: 36.80033424728288 },
            { latitude: -1.3278237317610664, longitude: 36.79999004656596 },
          ]}
          strokeColor="#fff"
          strokeWidth={2}
        />

        <Marker
          coordinate={{
            latitude: -1.3278237317610664,
            longitude: 36.79999004656596,
          }}
          title="Regular entrance"
          description="Regular entrance"
          calloutEnabled
        >
          <View style={styles.imageContainer}>
            <Image
              style={styles.icon}
              source={require("../../assets/icons/entrance.png")}
            />
          </View>
          <Callout>
            <View>
              <Text style={styles.label}>Regular entrance</Text>
            </View>
          </Callout>
        </Marker>

        {/* Toilet */}
        <Marker
          coordinate={{
            latitude: -1.3272243877709589,
            longitude: 36.80029669635741,
          }}
          title="Toilet"
          description="Toilet"
          calloutEnabled
        >
          <View style={styles.imageContainer}>
            <Image
              style={styles.icon}
              source={require("../../assets/icons/toilet.png")}
            />
          </View>
          <Callout>
            <View>
              <Text style={styles.label}>Toilet</Text>
            </View>
          </Callout>
        </Marker>

        <Marker
          coordinate={{
            latitude: -1.3271707579829592,
            longitude: 36.800784858388624,
          }}
          title="Toilet"
          description="Toilet"
          calloutEnabled
        >
          <View style={styles.imageContainer}>
            <Image
              style={styles.icon}
              source={require("../../assets/icons/toilet.png")}
            />
          </View>
          <Callout>
            <View>
              <Text style={styles.label}>Toilet</Text>
            </View>
          </Callout>
        </Marker>

        {/* food and bar */}
        <Marker
          coordinate={{
            latitude: -1.326489659574388,
            longitude: 36.79989436501299,
          }}
          title="Food & Bar"
          description="Food & Bar"
          calloutEnabled
        >
          <View style={styles.imageContainer}>
            <Image
              style={styles.icon}
              source={require("../../assets/icons/bar.png")}
            />
          </View>
          <Callout>
            <View>
              <Text style={styles.label}>Food & Bar</Text>
            </View>
          </Callout>
        </Marker>

        <Marker
          coordinate={{
            latitude: -1.326489659574388,
            longitude: 36.801165732061335,
          }}
          title="Food & Bar"
          description="Food & Bar"
          calloutEnabled
        >
          <View style={styles.imageContainer}>
            <Image
              style={styles.icon}
              source={require("../../assets/icons/bar.png")}
            />
          </View>
          <Callout>
            <View>
              <Text style={styles.label}>Food & Bar</Text>
            </View>
          </Callout>
        </Marker>

        {/* Corporate area */}
        <Marker
          coordinate={{
            latitude: -1.3255457748460688,
            longitude: 36.79988900059641,
          }}
          title="Corporate Area"
          description="Corporate Area"
          calloutEnabled
        >
          <View style={styles.imageContainer}>
            <Image
              style={styles.icon}
              source={require("../../assets/icons/corporate.png")}
            />
          </View>
          <Callout>
            <View>
              <Text style={styles.label}>Corporate Area</Text>
            </View>
          </Callout>
        </Marker>

        {/* Vvip entrance */}
        <Marker
          coordinate={{
            latitude: -1.3249665726661597,
            longitude: 36.8020669542749,
          }}
          title="VVIP entrance"
          description="VVIP entrance"
          calloutEnabled
        >
          <View style={styles.imageContainer}>
            <Image
              style={styles.icon}
              source={require("../../assets/icons/gate.png")}
            />
          </View>
          <Callout>
            <View>
              <Text style={styles.label}>VVIP entrance</Text>
            </View>
          </Callout>
        </Marker>

        {/* Vvip area(private food, bar and toilets) */}
        <Marker
          coordinate={{
            latitude: -1.325374159404016,
            longitude: 36.80114427439098,
          }}
          title="VVIP Area"
          description="VVIP private food, bar and toilets"
          calloutEnabled
        >
          <View style={styles.imageContainer}>
            <Image
              style={styles.icon}
              source={require("../../assets/icons/exclusive.png")}
            />
          </View>
          <Callout>
            <View>
              <Text style={styles.label}>VVIP Area</Text>
            </View>
          </Callout>
        </Marker>

        {/* VIP area(private food, bar and toilets) */}
        <Marker
          coordinate={{
            latitude: -1.3257871090413367,
            longitude: 36.80115500322683,
          }}
          title="VIP Area"
          description="private food, bar and toilets"
          calloutEnabled
        >
          <View style={styles.imageContainer}>
            <Image
              style={styles.icon}
              source={require("../../assets/icons/vip.png")}
            />
          </View>
          <Callout>
            <View>
              <Text style={styles.label}>VIP Area</Text>
            </View>
          </Callout>
        </Marker>

        {/* Vvip parking */}
        <Marker
          coordinate={{
            latitude: -1.3256637604402766,
            longitude: 36.802506836544794,
          }}
          title="VVIP Parking"
          description="VVIP Parking"
          calloutEnabled
        >
          <View style={styles.imageContainer}>
            <Image
              style={styles.icon}
              source={require("../../assets/icons/parking-area.png")}
            />
          </View>
          <Callout>
            <View>
              <Text style={styles.label}>VVIP Parking</Text>
            </View>
          </Callout>
        </Marker>

        {/* artists & vvip lounge */}
        <Marker
          coordinate={{
            latitude: -1.3250952842700012,
            longitude: 36.79852107402615,
          }}
          title="Artists & VVIP lounge"
          description="Artists & VVIP lounge"
          calloutEnabled
        >
          <View style={styles.imageContainer}>
            <Image
              style={styles.icon}
              source={require("../../assets/icons/lounge.png")}
            />
          </View>
          <Callout>
            <View>
              <Text style={styles.label}>Artists & VVIP lounge</Text>
            </View>
          </Callout>
        </Marker>

        {/* art/branding panel */}
        <Marker
          coordinate={{
            latitude: -1.3253527074576086,
            longitude: 36.80209914078246,
          }}
          title="Art and branding panel"
          description="Art and branding panel"
          calloutEnabled
        >
          <View style={styles.imageContainer}>
            <Image
              style={styles.icon}
              source={require("../../assets/icons/painting.png")}
            />
          </View>
          <Callout>
            <View>
              <Text style={styles.label}>Art & branding panel</Text>
            </View>
          </Callout>
        </Marker>

        {/* VVIP art, games, fashion, activations */}
        <Marker
          coordinate={{
            latitude: -1.3251113732353186,
            longitude: 36.801396402033475,
          }}
          title="VVIP Art, Games, Fashion, Activations"
          description="VVIP Art, Games, Fashion, Activations"
          calloutEnabled
        >
          <View style={styles.imageContainer}>
            <Image
              style={styles.icon}
              source={require("../../assets/icons/crown.png")}
            />
          </View>
          <Callout>
            <View>
              <Text style={styles.label}>
                VVIP Art, Games, Fashion, Activations
              </Text>
            </View>
          </Callout>
        </Marker>

        {/* art, games, fashion, activations */}
        <Marker
          coordinate={{
            latitude: -1.3251113732353186,
            longitude: 36.799749525730356,
          }}
          title="Art, Games, Fashion, Activations"
          description="Art, Games, Fashion, Activations"
          calloutEnabled
        >
          <View style={styles.imageContainer}>
            <Image
              style={styles.icon}
              source={require("../../assets/icons/game-console.png")}
            />
          </View>
          <Callout>
            <View>
              <Text style={styles.label}>Art, Games, Fashion, Activations</Text>
            </View>
          </Callout>
        </Marker>
      </MapView>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  icon: {
    height: 32,
    width: 32,
  },
  imageContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 5,
    flexDirection: "row",
    padding: 5,
  },
  label: {
    borderRadius: 5,
    flexDirection: "row",
  },
  map: {
    // flex: 1,
    // height: '100%',
    // width: '100%'
    ...StyleSheet.absoluteFillObject,
  },
});
