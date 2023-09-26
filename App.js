import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 인트로 화면
function SplashScreen({ navigation }) {
  useEffect(() => {
    // 일정 시간이 지난 후 인트로 화면을 종료하고 다음 화면으로 이동
    setTimeout(() => {
      navigation.navigate('Search');
    }, 3000);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF7101',
      }}
    >
      <Text style={{ fontSize: 25, color: '#fff', fontWeight: 'bold' }}>
        Food Recipe
      </Text>
    </View>
  );
}

// 음식 검색 화면
function FoodSearchScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const API_KEY = 'API_KEY';
  const API_ID = 'API_ID';

  // edamam API 호출
  const GetRecipeSearchAPI = () => {
    fetch(
      `https://api.edamam.com/search?q=${searchText}&app_id=${API_ID}&app_key=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        const recipes = data.hits;
        setSearchResults(recipes);
      })
      .catch((error) => {
        console.error('Error searching recipes:', error);
      });
  };
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="검색어를 입력하세요"
          onChangeText={(text) => setSearchText(text)}
          value={searchText}
        />
        <Button
          title="검색"
          onPress={GetRecipeSearchAPI}
          style={styles.button}
        />
      </View>
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.recipe.uri}
        renderItem={({ item }) => (
          <View style={styles.foodBox}>
            <TouchableOpacity
              onPress={
                () =>
                  navigation.navigate('Recipe', {
                    recipe: item.recipe,
                  }) // 데이터를 전달
              }
            >
              <Image source={{ uri: item.recipe.image }} style={styles.image} />
            </TouchableOpacity>
            <Text style={styles.label}>{item.recipe.label}</Text>
          </View>
        )}
        numColumns={2}
        columnWrapperStyle={{
          marginEnd: -10,
          marginTop: 10,
        }}
        style={{ marginBottom: 40 }}
      />
    </View>
  );
}

// 음식 정보제공 화면
function RecipeScreen({ route, navigation }) {
  const recipe = route.params ? route.params.recipe : null;
  const ingredientLines = recipe ? recipe.ingredientLines : [];
  const totalNutrients = recipe ? recipe.totalNutrients : [];

  return (
    <ScrollView>
      <View style={styles.detailContainer}>
        <Image
          source={{ uri: recipe ? recipe.image : '' }}
          style={styles.detailImage}
        />
        <Text style={styles.calorie}>
          calorie: {recipe ? recipe.calories.toFixed(0) : ''}Kcal
        </Text>
        <Text style={styles.detailTitle}>{recipe ? recipe.label : ''}</Text>

        <View style={{ width: '100%' }}>
          <Text style={styles.ingredient}>Ingredients</Text>
          {ingredientLines.map((item, index) => (
            <Text key={index} style={styles.ingredientLines}>
              {item}
            </Text>
          ))}
          <Text style={styles.Nutrition}>Nutrition</Text>
          {Object.keys(totalNutrients).map((item, index) => (
            <Text key={index} style={styles.totalNutrients}>
              {totalNutrients[item].label}:{' '}
              {totalNutrients[item].quantity.toFixed(2)}
              {totalNutrients[item].unit}
            </Text>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FF7101',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Search"
          component={FoodSearchScreen}
          options={{
            title: 'Food',
            headerLeft: () => <></>, // 뒤로가기 기능 제거
          }}
        />
        <Stack.Screen
          name="Recipe"
          component={RecipeScreen}
          options={{
            title: 'Recipe',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  // SearchBar
  container: {
    marginHorizontal: 15,
    marginVertical: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#e7e7e7',
    paddingHorizontal: 10,
    marginRight: 10,
    borderRadius: 10,
  },
  foodBox: {
    width: '50%',
  },
  image: {
    width: '95%',
    aspectRatio: 1, // 가로 세로 비율을 1:1로 유지 (정사각형)
    marginBottom: 5,
    borderRadius: 20,
  },
  label: { width: '100%', paddingLeft: 5 },

  // DetailsScreen
  detailContainer: {
    marginHorizontal: 15,
  },
  detailImage: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'stretch',
    marginTop: 15,
    borderRadius: 30,
  },
  detailTitle: {
    fontSize: 25,
    marginTop: 5,
    textAlign: 'center',
  },
  calorie: {
    color: '#21b0da',
    textAlign: 'center',
    marginTop: 10,
  },
  ingredient: {
    fontSize: 20,
    marginBottom: 10,
    marginTop: 30,
    color: '#bbb',
  },
  ingredientLines: {
    marginBottom: 10,
  },
  Nutrition: {
    fontSize: 20,
    marginBottom: 10,
    marginTop: 10,
    color: '#bbb',
  },
  totalNutrients: {
    marginBottom: 10,
  },
});
