import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { market_categories } from "./marketdata";

export default function Market({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState(
    market_categories[0]
  );

  return (
    <View style={styles.container}>
      {/* Categories Horizontal List */}
      <View style={styles.category_section}>
        <FlatList
          data={market_categories}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedCategory(item)}>
              <CategoryCard title={item.title} image={item.image} />
            </TouchableOpacity>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Sub-categories Vertical List */}
      <FlatList
        data={selectedCategory.sub_categories}
        renderItem={({ item }) => (
          <SubCategoryCard
            title={item.title}
            image={item.image}
            handlePress={() => navigation.navigate("Merchandise")}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.subCategoryList}
      />
    </View>
  );
}

// Rest of your components remain the same
function SubCategoryCard({ title, image, handlePress }) {
  return (
    <TouchableOpacity style={styles.category_container} onPress={handlePress}>
      <Image source={{ uri: image }} style={{ width: 50, height: 50 }} />
      <Text>{title}</Text>
    </TouchableOpacity>
  );
}

function CategoryCard({ title, image, id }) {
  return (
    <View style={styles.promo_card}>
      <Text>{title}</Text>
      <Image source={{ uri: image }} style={{ width: "100%", height: 150 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  category_section: {
    height: 200,
    marginVertical: 10,
  },
  category_container: {
    width: "100%",
    height: 100,
    backgroundColor: "lightgray",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
    flexDirection: "row",
    padding: 20,
  },
  promo_card: {
    width: 200,
    height: 180,
    backgroundColor: "lightgray",
    margin: 10,
    padding: 8,
    borderRadius: 8,
  },
  subCategoryList: {
    paddingHorizontal: 10,
  },
});
