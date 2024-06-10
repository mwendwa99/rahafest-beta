import { View, Image, FlatList, StyleSheet, Dimensions } from 'react-native';
import { RahaMedia } from '../screens/club/landing/data';

const numColumns = 2;
const imageSize = Dimensions.get('window').width / numColumns;

const ImageList = () => {
  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={item.image} style={styles.image} />
    </View>
  );

  return (
    <FlatList
      data={RahaMedia}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      numColumns={numColumns}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    justifyContent: 'center',
  },
  imageContainer: {
    marginTop: 6,
    padding: 4,
  },
  image: {
    width: imageSize - 10,
    height: imageSize + 100,
    resizeMode: 'fit',
    borderRadius: 6,
  },
});

export default ImageList;
