import React, { useState, useEffect, useMemo } from 'react';
import { colors, fontSizes, spacing } from '../styles/theme';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Pressable,
  Linking,
  Modal,
} from 'react-native';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';
import defaultProductImage from '../../assets/default-product-image.jpeg';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [productPhotos, setProductPhotos] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, photosRes, categoriesRes] = await Promise.all([
          axios.get('https://api.univerdog.site/api/products'),
          axios.get('https://api.univerdog.site/api/products-photos'),
          axios.get('https://api.univerdog.site/api/products-categories'),
        ]);
        //console.log('Products:', productsRes.data);
        //console.log('Photos:', photosRes.data);
        //console.log('Categories:', categoriesRes.data);
        setProducts(productsRes.data);
        setProductPhotos(photosRes.data);
        setProductCategories(categoriesRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    return selectedCategory
      ? products.filter(
          product => product.products_category_id === selectedCategory,
        )
      : products;
  }, [products, selectedCategory]);

  useEffect(() => {
   // console.log('Filtered Products:', filteredProducts);
  }, [filteredProducts]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  const handleCategoryClick = categoryId => {
    setSelectedCategory(categoryId);
  };

  const findProductPhoto = productId => {
    const photos = productPhotos.filter(
      photo => photo.product_id === productId,
    );
    return photos.length > 0 ? photos[0].photo_name_product : null;
  };

  const renderCategoryButton = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item.id && styles.selectedCategoryButton,
      ]}
      onPress={() => handleCategoryClick(item.id)}
    >
      <Text
        style={[
          styles.categoryButtonText,
          selectedCategory === item.id && styles.selectedCategoryButtonText,
        ]}
      >
        {item.name_product_cat}
      </Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <FontAwesome name="shopping-bag" size={24} color={colors.primary} />
        <Text style={styles.title}>Nos produits phares</Text>
      </View>

      <FlatList
        horizontal
        data={[
          ...productCategories,
          { id: null, name_product_cat: 'Tous les produits' },
        ]}
        renderItem={renderCategoryButton}
        keyExtractor={item => item.id?.toString() || 'all'}
        style={styles.categoryList}
        showsHorizontalScrollIndicator={false}
      />
    </>
  );

  const renderProductItem = ({ item }) => {
    const photo = findProductPhoto(item.id);
    const fullImageUrl = photo
      ? `https://api.univerdog.site/storage/products_photos/${photo}`
      : null;

    const handleImagePress = () => {
      setFullScreenImage(fullImageUrl);
    };

    const handleBuyPress = () => {
      if (item.affiliation_link) {
        Linking.openURL(item.affiliation_link).catch(err =>
          console.error("Erreur lors de l'ouverture du lien:", err),
        );
      } else {
       // console.log("Pas de lien d'affiliation disponible pour ce produit");
      }
    };

    return (
      <View style={styles.productCard}>
        <Pressable onPress={handleImagePress}>
          <Image
            style={styles.productImage}
            source={{ uri: fullImageUrl }}
            defaultSource={defaultProductImage} // Assurez-vous d'avoir une image par défaut
            onError={e =>
              console.log('Image loading error:', e.nativeEvent.error)
            }
            onLoad={() => console.log('Image loaded successfully')}
          />
        </Pressable>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name_product}</Text>
          <Text style={styles.productDescription} numberOfLines={2}>
            {item.description_product}
          </Text>
          <Text style={styles.productPrice}>
            <FontAwesome name="dollar" size={16} color={colors.primary} />{' '}
            {item.price} €
          </Text>
          <TouchableOpacity style={styles.buyButton} onPress={handleBuyPress}>
            <FontAwesome name="shopping-cart" size={16} color={colors.white} />
            <Text style={styles.buyButtonText}> Acheter</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderFullScreenImage = () => (
    <Modal
      visible={!!fullScreenImage}
      transparent={true}
      onRequestClose={() => setFullScreenImage(null)}
    >
      <Pressable
        style={styles.fullScreenContainer}
        onPress={() => setFullScreenImage(null)}
      >
        <Image
          style={styles.fullScreenImage}
          source={{ uri: fullScreenImage }}
          resizeMode="contain"
        />
      </Pressable>
    </Modal>
  );

  return (
    <View style={styles.scrollView}>
      <View style={styles.container}>
        <FlatList
          ListHeaderComponent={renderHeader}
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.productList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Aucun produit trouvé</Text>
          }
        />
        {renderFullScreenImage()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buyButton: {
    alignItems: 'center',
    backgroundColor: colors.button,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: spacing.small,
  },
  buyButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: spacing.tiny,
  },
  categoryButton: {
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    marginRight: spacing.small,
    minWidth: 100,
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
  },
  categoryButtonText: {
    color: colors.text.tertiary,
    fontWeight: '600',
  },
  categoryList: {
    marginBottom: spacing.medium,
    paddingHorizontal: spacing.medium,
  },
  container: {
   
    flex: 1,
    paddingBottom: spacing.large,
    paddingTop: spacing.large,
    
  },
  emptyText: {
    color: colors.text,
    fontSize: fontSizes.medium,
    marginTop: spacing.large,
    textAlign: 'center',
  },
  fullScreenContainer: {
    alignItems: 'center',
    backgroundColor: colors.overlay,
    flex: 1,
    justifyContent: 'center',
  },
  fullScreenImage: {
    height: '100%',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: spacing.medium,
    marginBottom: 10,
    
    
  },
  loadingContainer: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    color: colors.text,
    fontSize: fontSizes.large,
  },
  productCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    elevation: 3,
    flex: 1,
    margin: spacing.small,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productDescription: {
    color: colors.secondaryText,
    fontSize: fontSizes.small,
    marginBottom: spacing.small,
  },
  productImage: {
    height: 150,
    width: '100%',
  },
  productInfo: {
    padding: spacing.small,
  },
  productList: {
    paddingHorizontal: spacing.small,
  },
  productName: {
    color: colors.text.tertiary,
    fontSize: fontSizes.medium,
    fontWeight: 'bold',
    marginBottom: spacing.tiny,
  },
  productPrice: {
    color: colors.primary,
    fontSize: fontSizes.medium,
    fontWeight: 'bold',
    marginBottom: spacing.small,
  },
  scrollView: {
    
    backgroundColor: colors.background,
    flex: 1,
    paddingBottom: spacing.extraLarge,
  },
  selectedCategoryButton: {
    backgroundColor: colors.primary,
  },
  selectedCategoryButtonText: {
    color: colors.white,
  },
  title: {
    color: colors.white,
    fontSize: fontSizes.large,
    fontWeight: 'bold',
    marginLeft: spacing.small,
    marginVertical: spacing.small,
  },
});

export default Shop;
