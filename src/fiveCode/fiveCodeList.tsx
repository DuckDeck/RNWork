import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Keyboard,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-root-toast';
const {width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';
import { MMKV } from 'react-native-mmkv'
import {FiveCodeInfo, getFiveCode} from '../model/fiveCode';

export const storage = new MMKV()


const FiveCodeList = () => {
  const [codes, setFiveCode] = useState<FiveCodeInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(()=>{
    const jsCodes = storage.getString('fiveCode')
    if(jsCodes == undefined || jsCodes == null){
       console.log('No fiveCode data found in storage.')
      return
    }
    
    const fiveData =  JSON.parse(jsCodes)
     setFiveCode(fiveData)
  },[])

  const handleSearch = async () => {
    Keyboard.dismiss();
    if (!searchText.trim()) {
      Toast.show('请输入文字');
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
      Toast.show(fetchedCodes.msg);
    }

    setFiveCode(prevCodes => {
      // 使用 Map 来高效去重，并保持顺序 (后出现的覆盖先出现的)
      // Map 维护插入顺序，Key 是唯一标识符，Value 是完整的 FiveCodeInfo 对象
      const uniqueItemsMap = new Map<string, FiveCodeInfo>();

      // 1. 将旧数据放入 Map，作为基础
      prevCodes.forEach(item => uniqueItemsMap.set(item.word, item));

      // 2. 将新数据放入 Map。如果 code 相同，新数据会覆盖旧数据
      //    这样可以确保新数据如果在旧数据中存在，最终会使用新数据的位置（如果需要）
      //    或者在这里反过来，确保旧数据中的元素不会被新数据中重复的覆盖
      //    为了实现新数据在前且去重，我们需要更精细的控制

      // 更好的策略：
      // 1. 先处理新数据，确保新数据在顶部
      const newItemsToAdd: FiveCodeInfo[] = [];
      fetchedCodes.data.forEach(newItem => {
        // 如果新数据中的项不在旧数据中，则添加到 newItemsToAdd
        if (!prevCodes.some(oldItem => oldItem.word === newItem.word)) {
          newItemsToAdd.push(newItem);
        }
      });

      // 2. 将新数据（去重后）放在最前面，然后是旧数据
      // 再次使用 Map 来处理最终去重，因为 newItemsToAdd + prevCodes 可能仍然有重复
      const finalUniqueItemsMap = new Map<string, FiveCodeInfo>();

      // 优先加入新数据，保持其顺序
      newItemsToAdd.forEach(item => finalUniqueItemsMap.set(item.word, item));

      // 再加入旧数据，如果 key 已经存在，则不会被覆盖 (保持了新数据在前的优势)
      prevCodes.forEach(item => {
        if (!finalUniqueItemsMap.has(item.word)) {
          finalUniqueItemsMap.set(item.word, item);
        }
      });
      // 将 Map 的值转换为数组
      const resultData = Array.from(finalUniqueItemsMap.values());
      storage.set("fiveCode",JSON.stringify(resultData))

      return resultData
     
    });

    

    setLoading(false);
  };

  const renderItem = ({item}: {item: FiveCodeInfo}) => (
    <View style={{flexDirection: 'row', padding: 5, height: 30}}>
      <Text numberOfLines={1} style={{flex: 0.3, textAlign: 'center'}}>
        {item.word}
      </Text>
      <Text numberOfLines={1} style={{flex: 0.3, textAlign: 'center'}}>
        {item.spell}
      </Text>
      <Text numberOfLines={1} style={{flex: 0.3, textAlign: 'center'}}>
        {item.code}
      </Text>
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
        keyExtractor={(item, index) => item.word}
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
