import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function MerchCard({product}) {
  return (
    <View style={styles.card}>
      <Image source={product.image} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>KES{product.price}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => alert(`Buying ${product.name}`)}
      >
        <Text style={styles.buttonText}>Buy</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    card: {
        // flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        margin: 5,
        padding: 16,
        width: 175,
        backgroundColor: '#212529',
        color:'#fafafa',
        borderRadius: 6,
      },
      image: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginBottom: 10,
      },
      name: {
        fontSize: 16,
        fontWeight: 'thin',
        marginBottom: 5,
        color: '#fafafa',
      },
      price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fafafa',
        marginBottom: 10,
      },
      button: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#F4A329',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
      },
      buttonText: {
        color: '#212529',
        fontSize: 16,
      },
});
