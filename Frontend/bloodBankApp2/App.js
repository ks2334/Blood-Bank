import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";
import Splash from "./screens/splash";
import SignIn from "./screens/login";
import Profile from "./screens/profile";
import Home from "./screens/home";
import PdfView from "./screens/PdfView";
import HomeChat from "./screens/homeChat";
import FriendsList from "./screens/friendList";
import updateprofile from "./screens/updateprofile";
import PostForm from "./screens/post";
import AboutUs from "./screens/aboutUs";
import GroupPage from "./screens/groupPage";
import GroupPageChat from "./screens/groupPageChat";
import ProfileNotFriend from "./screens/profile2";
import Contact from "./screens/contact";
import GroupDescriptionPage from "./screens/groupPageList";
import ProfileDescriptionPage from "./screens/profilePageFromChat";
export default class App extends React.Component {
  update = () => {
    console.log("Update Called");
    this.setState({});
  };

  componentWillUnmount() {
    console.log("Unmounted");
    SecureStore.setItemAsync("latestChat", new Date()).then(response => {
      console.log("Latest Date Saved");
    });
  }

  render() {
    return (
      <Screens
        screenProps={{
          update: this.update
        }}
      />
    );
  }
}

const Screens = createAppContainer(
  createStackNavigator({
    splash: { screen: Splash },
    login: { screen: SignIn },
    Profile: {
      screen: Profile
    },
    Home: {
      screen: HomeChat
    },
    FriendsList: {
      screen: FriendsList
    },
    PdfView: {
      screen: PdfView
    },
    updateprofile: {
      screen: updateprofile
    },
    Post: {
      screen: PostForm
    },
    AboutUs: {
      screen: AboutUs
    },
    GroupPage: {
      screen: GroupPageChat
    },
    GroupDescriptionPage: {
      screen: GroupDescriptionPage
    },
    ProfileDescriptionPage: {
      screen: ProfileDescriptionPage
    },
    AddProfile: {
      screen: ProfileNotFriend
    },
    Contact: {
      screen: Contact
    }
  })
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
