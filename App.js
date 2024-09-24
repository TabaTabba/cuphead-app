import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainScreen from "./screens/MainScreen";
import DetailsScreen from "./screens/DetailsScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import SearchScreen from "./screens/SearchScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name="MainScreen"
                component={MainScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="DetailsScreen"
                component={DetailsScreen}
                options={{
                  headerBackTitleVisible: false,
                  headerBackButtonMenuEnabled: false,
                  headerTintColor: "white",
                }}
              />
              <Stack.Screen
                name="FavoritesScreen"
                component={FavoritesScreen}
                options={{
                  headerBackTitleVisible: false,
                  headerBackButtonMenuEnabled: false,
                  headerTintColor: "white",
                  headerTitle: "Favorite Bosses",
                  headerTitleStyle: {
                    fontSize: 28,
                    color: "white",
                    fontFamily: "futura",
                    fontWeight: "bold",
                  },
                }}
              />
              <Stack.Screen
                name="SearchScreen"
                component={SearchScreen}
                options={{
                  headerBackTitleVisible: false,
                  headerBackButtonMenuEnabled: false,
                  headerTintColor: "white",
                  headerTitle: "Search Bosses",
                  headerTitleStyle: {
                    fontSize: 28,
                    color: "white",
                    fontFamily: "futura",
                    fontWeight: "bold",
                  },
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </>
  );
}
