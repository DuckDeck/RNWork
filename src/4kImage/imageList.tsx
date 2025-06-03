// components/ImageGallery.js
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { ImageInfo,get4Kimages } from '../model/ImageInfo';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 30) / 2; // 两列显示，减去一些间距

const ImageGallery = () => {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // 标记是否还有更多数据可以加载
  const [error, setError] = useState<string | null>(null);


  const loadData = useCallback(async () =>{
    if (loading || !hasMore) {
      return
    }
     console.log("loadData",page)
    setLoading(true)
    setError(null)
    try {
        var indexHtml = 'index.html'
        if (page > 0) {
          indexHtml = `index_${page + 1}.html`
        }
      const fetchedImages = await get4Kimages(indexHtml)
      setImages((preData)=>[...preData,...fetchedImages])
      setHasMore(true)
      setPage((prevPage) => prevPage + 1)
    } catch (err) {
       console.error('Error fetching data:', err)
      setError('Failed to load more data.')
    } finally {
      setLoading(false)
    }
  },[page,loading,hasMore])

  useEffect(() => {
    if (page == 0) {
      loadData()
    }
  }, [page,loadData]);
const renderItem = ({ item }: { item: ImageInfo }) => (
    <View style={styles.imageContainer} >
      <Image
        source={{ uri: item.url }}
        style={styles.image}
        resizeMode="cover"
        onError={(e) => console.log('Image load error:', e.nativeEvent.error, item.url)}
      />
      <Text style={styles.imageTitle} numberOfLines={1}>{item.title}</Text>
    </View>
  );
const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  };
  if (loading && page == 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading images...</Text>
      </View>
    );
  } else if (error != null){
  return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  } else {
 return (
    <View style={styles.container}>
      <FlatList
         onEndReachedThreshold={.2}
        onEndReached={loadData}
        data={images}
        
        renderItem={renderItem}
        keyExtractor={(item, index) => item.url} // Use URL + index for unique key
        numColumns={2} // 两列显示
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
  }

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 80, // 增加底部内边距，确保 footer 可见
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE + 40, // 留出标题空间
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-start',
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginVertical: 5,
  },
  image: {
    width: '100%',
    height: IMAGE_SIZE,
  },
  imageTitle: {
    fontSize: 14,
    padding: 8,
    textAlign: 'center',
    color: '#333',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default ImageGallery;