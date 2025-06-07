/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Button} from '@react-navigation/elements';
import ImageGallery from './src/4kImage/imageList';
import FiveCode from './src/fiveCode/fiveCodeList';
import {RootSiblingParent} from 'react-native-root-siblings';
type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}
function HomeScreen() {
  const navigation = useNavigation();
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const safePadding = '5%';
  return (
    <ScrollView style={backgroundStyle}>
      <View style={{paddingRight: safePadding}}>
        <Header />
      </View>
      <View
        style={{
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
          paddingHorizontal: safePadding,
          paddingBottom: safePadding,
        }}>
        <Section title="4K图片">
          <Button onPress={() => navigation.push('ImageGallery')}>
            4K壁纸
          </Button>
        </Section>
        <Section title="五笔反查">
          <Button onPress={() => navigation.push('FiveCode')}>五笔反查</Button>
        </Section>
      </View>
    </ScrollView>
  );
}

const Stack = createNativeStackNavigator();
function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{headerStyle: {backgroundColor: 'gray'}}}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{title: 'overView'}}></Stack.Screen>
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="ImageGallery" component={ImageGallery} />
      <Stack.Screen name="FiveCode" component={FiveCode} />
    </Stack.Navigator>
  );
}
function App2() {
  return (
    <RootSiblingParent>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </RootSiblingParent>
  );
}

function DetailsScreen(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  /*
   * To keep the template simple and small we're adding padding to prevent view
   * from rendering under the System UI.
   * For bigger apps the recommendation is to use `react-native-safe-area-context`:
   * https://github.com/AppAndFlow/react-native-safe-area-context
   *
   * You can read more about it here:
   * https://github.com/react-native-community/discussions-and-proposals/discussions/827
   */
  const safePadding = '5%';

  return (
    <View style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView style={backgroundStyle}>
        <View style={{paddingRight: safePadding}}>
          <Header />
        </View>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            paddingHorizontal: safePadding,
            paddingBottom: safePadding,
          }}>
          <Section title="Cos网页">
            <Button onPress={() => navigation.goBack()}>Go back</Button>
          </Section>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App2;
