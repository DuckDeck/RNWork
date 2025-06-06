import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TextInput,
  TouchableOpacity,
  
} from 'react-native';
import Toast from 'react-native-root-toast';
const {width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';

import {FiveCodeInfo, getFiveCode} from '../model/fiveCode';

const FiveCodeList = () => {
  const [codes, setFiveCode] = useState<FiveCodeInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchText.trim()) {
      Toast.show('请输入文字', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
      return;
    }
    if (loading) {
      return;
    }
    console.log(searchText);
    setLoading(true);
    setError(null);

    const fetchedCodes = await getFiveCode(searchText);
    if (fetchedCodes.code != 0) {
      Toast.show(fetchedCodes.msg, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    }
    setFiveCode(preData => [...preData, ...fetchedCodes.data]);
    setLoading(false);
  };

  const renderItem = ({item}: {item: FiveCodeInfo}) => (
    <View >
      <Text numberOfLines={1}>{item.word}</Text>
      <Text numberOfLines={1}>{item.spell}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="请输入搜索关键词..."
            value={searchText}
            onChangeText={setText}
            // 键盘类型可以根据需要设置，例如 'default', 'numeric', 'email-address' 等
            keyboardType="default"
            // 可以设置 returnKeyType 来改变键盘右下角按钮的文字，例如 'search'
            returnKeyType="search"
            // 当 returnKeyType 为 'search' 时，可以监听 onSubmitEditing 事件
            onSubmitEditing={handleSearch}
            // 可以禁用自动修正、自动大写等
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Icon name="search" size={20} color="#666" />;
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={codes}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.word} // Use URL + index for unique key
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
    flexDirection: 'column',
  },
  searchContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    flexDirection: 'row', // 横向排列 TextInput 和 Button
    alignItems: 'center', // 垂直居中对齐
    backgroundColor: '#fff',
    borderRadius: 25, // 圆角
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '90%', // 控制搜索框整体宽度
    elevation: 3, // Android 阴影
    shadowColor: '#000', // iOS 阴影
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  textInput: {
    flex: 1, // TextInput 占据剩余空间
    height: 40,
    fontSize: 16,
    color: '#333',
    paddingRight: 10, // 给按钮留出一些空间
  },
  searchButton: {
    borderRadius: 20, // 按钮圆角
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginLeft: 10, // 按钮左侧间距
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff', // 如果是 Image，可以改变颜色
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 80, // 增加底部内边距，确保 footer 可见
  },
});

export default FiveCodeList;
