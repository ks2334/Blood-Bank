import React, { Component } from "react";
import { ip } from "./host.js";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  Alert,
  ScrollView,
  TextInput,
  ListView,
  AppRegistry,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ImageBackground
} from "react-native";

import FeatherIcon from "react-native-vector-icons/Feather";
import { ListItem } from "react-native-elements";

export default class ProfileDescriptionPage extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Janakalyan Blood Bank",
      headerStyle: {
        backgroundColor: "#660000"
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
        color: "#fff"
      }
    };
  };
  constructor(props) {
    super(props);
  }

  render() {
    let obj = this.props.navigation.getParam("obj");
    return (
      <ImageBackground
        source={require("../bg3.jpg")}
        style={{
          width: "100%",
          height: "100%"
        }}
      >
        <ScrollView style={styles.container}>
          <Image
            source={{ uri: ip + obj.profilePic }}
            style={{
              width: Dimensions.get("window").width,
              height: 300,
              flex: 1
            }}
          />
          <Text
            style={{
              paddingLeft: 10,
              paddingTop: 15,
              paddingBottom: 3,
              fontSize: 28,
              color: "white",
              fontWeight: "bold"
            }}
          >
            {obj.first_name+" "+obj.last_name}
          </Text>

          <Text
            style={{
              alignSelf: "flex-start",
              fontSize: 20,
              marginLeft: 15,
              marginTop: 5,
              marginBottom: 0,
              color: "white"
            }}
          >
            Mobile Number: {obj.phone}
          </Text>
          <Text
            style={{
              alignSelf: "flex-start",
              fontSize: 20,
              marginLeft: 15,
              marginTop: 5,
              marginBottom: 0,
              color: "white"
            }}
          >
            Blood Group: {obj.bloodGroup}
          </Text>
          <Text
            style={{
              alignSelf: "flex-start",
              fontSize: 20,
              marginLeft: 15,
              marginTop: 5,
              marginBottom: 0,
              color: "white"
            }}
          >
            Gender: {obj.gender?"Male":"Female"}
          </Text>
          
        </ScrollView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent"
  },
  formContent: {
    flexDirection: "row",
    marginTop: 10
  },
  inputContainer: {
    borderColor: "gray",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    borderWidth: 2,
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    margin: 5
  },
  icon: {
    width: 30,
    height: 30
  },
  iconBtnSearch: {
    alignSelf: "center"
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: "#FFFFFF",
    flex: 1
  },
  inputIcon: {
    marginLeft: 15,
    justifyContent: "center"
  },
  notificationList: {
    marginTop: 2,
    padding: 5,
    marginBottom: 10,
    paddingBottom: 20
  },
  notificationBox: {
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 5,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: 0.1
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 20,
    marginLeft: 20
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginLeft: 10,
    alignSelf: "center"
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    alignSelf: "center",
    position: "absolute",
    marginTop: 70,
    zIndex: 1000
  }
});

AppRegistry.registerComponent("bloodBankApp2", () => ProfileDescriptionPage);
