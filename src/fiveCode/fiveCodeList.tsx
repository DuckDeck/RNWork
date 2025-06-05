import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
const {width} = Dimensions.get('window');
import {FiveCodeInfo, getFiveCode} from '../model/fiveCode';
const FiveCodeList = () => {
  const [codes, setFiveCode] = useState<FiveCodeInfo[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (loading) {
      return;
    }
    console.log('loadData', page);
    setLoading(true);
    setError(null);
    try {
      var indexHtml = 'index.html';
      if (page > 0) {
        indexHtml = `index_${page + 1}.html`;
      }
      const fetchedCodes = await getFiveCode(indexHtml);
      setFiveCode(preData => [...preData, ...fetchedCodes]);

      setPage(prevPage => prevPage + 1);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load more data.');
    } finally {
      setLoading(false);
    }
  }, [page, loading]);

  useEffect(() => {
    if (page == 0) {
      loadData();
    }
  }, [page, loadData]);
  const renderItem = ({item}: {item: FiveCodeInfo}) => (
    <View style={styles.imageContainer}>
      <Text numberOfLines={1}>
        {item.word}
      </Text>
      <Text numberOfLines={1}>
        {item.spell}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={codes}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.word} // Use URL + index for unique key
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 10,
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
    width: width,
    height: 40, // 留出标题空间
    backgroundColor: '#fff',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-start',
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginVertical: 5,
  },
});

export default FiveCodeList;
