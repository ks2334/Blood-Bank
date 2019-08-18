import React, { Component } from "react";
import { ip, wsip } from "./host.js";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  AppRegistry,
  ScrollView,
  FlatList,
  Picker,
  Button,
  ImageBackground,
  TextInput,
  RefreshControl,
  Dimensions,
  Share
} from "react-native";

import FeatherIcon from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  createAppContainer,
  createBottomTabNavigator,
  NavigationEvents,
  createMaterialTopTabNavigator,
} from "react-navigation";
import Drawer from "react-native-drawer";
import DrawerContent from "./DrawerContent";
import { ListItem, ButtonGroup } from "react-native-elements";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";
import Toast, { DURATION } from "react-native-easy-toast";
import ImageView from "react-native-image-view";

const { width, height } = Dimensions.get("window");

export class Details extends Component {
  render() {
    return (
      <View contentContainerStyle={{ flex: 1 }}>
        <Text
          style={{
            alignSelf: "flex-start",
            fontSize: 15,
            marginLeft: 15,
            marginTop: 5,
            marginBottom: 0
          }}
        >
          Mobile Number: {this.props.screenProps.homeState.phone}
        </Text>
        <Text
          style={{
            alignSelf: "flex-start",
            fontSize: 15,
            marginLeft: 15,
            marginTop: 5,
            marginBottom: 0
          }}
        >
          Email: {this.props.screenProps.homeState.email}
        </Text>
        <Text
          style={{
            alignSelf: "flex-start",
            fontSize: 15,
            marginLeft: 15,
            marginTop: 5,
            marginBottom: 0
          }}
        >
          Alternate Mobile Number:{" "}
          {this.props.screenProps.homeState.emergencyContact}
        </Text>
        <Text
          style={{
            alignSelf: "flex-start",
            fontSize: 15,
            marginLeft: 15,
            marginTop: 5,
            marginBottom: 0
          }}
        >
          Date of Birth: {this.props.screenProps.homeState.dob}
        </Text>
        <Text
          style={{
            alignSelf: "flex-start",
            fontSize: 15,
            marginLeft: 15,
            marginTop: 5,
            marginBottom: 0
          }}
        >
          Gender: {this.props.screenProps.homeState.gender}
        </Text>
        <Text
          style={{
            alignSelf: "flex-start",
            fontSize: 15,
            marginLeft: 15,
            marginTop: 5,
            marginBottom: 0
          }}
        >
          Address: {this.props.screenProps.homeState.address}
        </Text>
        <Text
          style={{
            alignSelf: "flex-start",
            fontSize: 15,
            marginLeft: 15,
            marginTop: 5,
            marginBottom: 0
          }}
        >
          Aadhar: {this.props.screenProps.homeState.aadhar}
        </Text>
        <Text
          style={{
            alignSelf: "flex-start",
            fontSize: 15,
            marginLeft: 15,
            marginTop: 5,
            marginBottom: 0
          }}
        >
          Education: {this.props.screenProps.homeState.education}
        </Text>
        <Text
          style={{
            alignSelf: "flex-start",
            fontSize: 15,
            marginLeft: 15,
            marginTop: 5,
            marginBottom: 0
          }}
        >
          Profession: {this.props.screenProps.homeState.profession}
        </Text>
        <Text
          style={{
            alignSelf: "flex-start",
            fontSize: 15,
            marginLeft: 15,
            marginTop: 5,
            marginBottom: 0
          }}
        >
          Office Address: {this.props.screenProps.homeState.officeAddress}
        </Text>
      </View>
    );
  }
}

export class Posts extends Component {
  render() {
    return (
      <View contentContainerStyle={{ minHeight: 100 }}>
        <FlatList
          style={[
            styles.list,
            {
              marginHorizontal: 0
            }
          ]}
          data={this.props.screenProps.data1}
          keyExtractor={item => {
            return item.id.toString();
          }}
          ItemSeparatorComponent={() => {
            return <View style={styles.separator} />;
          }}
          renderItem={post => {
            const item = post.item;
            if (item.image != null) {
              image = (
                <Image
                  style={styles.cardImage}
                  source={{
                    uri: ip + item.image.toString()
                  }}
                />
              );
            } else {
              image = null;
            }
            return (
              <View style={styles.card}>
                {image}
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        flex: 1,
                        alignItems: "center"
                      }}
                    >
                      {item.user.profilePic ? (
                        <Image
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 15,
                            marginLeft: 1,
                            marginRight: 5
                          }}
                          source={{
                            uri: ip + item.user.profilePic
                          }}
                        />
                      ) : null}
                      <Text style={styles.title}>
                        {item.user.first_name + " " + item.user.last_name}
                      </Text>
                    </View>

                    <Text style={styles.description}>{item.postDetails}</Text>
                    <View style={styles.timeContainer}>
                      <Image
                        style={styles.iconData}
                        source={{
                          uri:
                            "https://png.icons8.com/color/96/3498db/calendar.png"
                        }}
                      />
                      <Text style={styles.time}>
                        {item.time.toString().substring(0, 10)}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.cardFooter}>
                  <View style={styles.socialBarContainer}>
                    <View style={styles.socialBarSection}>
                      <TouchableOpacity style={styles.socialBarButton}>
                        <Image
                          style={styles.icon}
                          source={{
                            uri:
                              "https://png.icons8.com/material/96/2ecc71/thumb-up.png"
                          }}
                        />
                        <Text style={styles.socialBarLabel}>{item.likes}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </View>
    );
  }
}

const ProfileTabs = createAppContainer(
  createMaterialTopTabNavigator(
    {
      Details: {
        screen: Details,
        navigationOptions: {
          tabBarLabel: "Details"
        }
      },
      Posts: {
        screen: Posts,
        navigationOptions: {
          tabBarLabel: "Posts"
        }
      }
    },
    {
      tabBarOptions: {
        labelStyle: {
          fontSize: 15,
          fontWeight: "bold",
          color: "#000"
        },
        tabStyle: {
          backgroundColor: "rgba(0,0,0,0.1)"
        },
        style: {
          backgroundColor: "transparent"
        },
        indicatorStyle: {
          backgroundColor: "#000"
        },
        swipeEnabled: true
      }
    }
  )
);

export class Profile extends Component {
  static navigationOptions = { header: null };

  constructor(props) {
    super(props);
    this.state = {
      token: this.props.screenProps.token,
      id: "",
      name: "",
      email: "",
      phone: "",
      bg: "",
      donationDate: "",
      dob: "",
      address: "",
      selectedIndex: null,
      data: [],
      data1: [],
      refreshing: false,
      donationDate: this.props.screenProps.homeState.donationDate
    };
    this.updateIndex = this.updateIndex.bind(this);
  }

  updateIndex(selectedIndex) {
    this.setState({ selectedIndex: selectedIndex });
    if (selectedIndex === 0) {
      this.props.screenProps.rootNavigation.navigate("FriendsList", {
        friends: this.props.screenProps.homeState.friends,
        friendRequests: this.props.screenProps.homeState.friendRequest,
        token: this.props.screenProps.token,
        name: this.props.screenProps.homeState.name
      });
    } else if (selectedIndex === 1) {
      this.props.screenProps.rootNavigation.navigate("updateprofile", {
        data: this.props.screenProps.homeState,
        token: this.props.screenProps.token
      });
    }
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    fetch(ip + "/getProfileView/", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + this.state.token
      }
    })
      .then(response => response.json())
      .then(response2 => {
        obj = response2; //JSON.parse(response2._bodyInit);
        this.setState({ data: obj["requests"], data1: obj["profilePosts"] });

        this.setState({ refreshing: false });
      })
      .catch(err => {
        console.log(err);
      });
  };
  componentDidMount() {
    fetch(ip + "/getProfileView/", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + this.state.token
      }
    })
      .then(response => response.json())
      .then(response2 => {
        obj = response2; //JSON.parse(response2._bodyInit);
        this.setState({ data: obj["requests"], data1: obj["profilePosts"] });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const buttons = ["Friends", "Update"];
    return (
      <ScrollView
        contentContainerStyle={{ marginBottom: 10 }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
      >
        <View style={styles.header} />
        {this.props.screenProps.homeState.profilePic ? (
          <Image
            style={styles.avatar}
            source={{ uri: this.props.screenProps.homeState.profilePic }}
          />
        ) : (
          <Image
            style={styles.avatar}
            source={{
              uri: ip + "/media/media/avatar.png"
            }}
          />
        )}
        <Image
          style={styles.avatar}
          source={{ uri: this.props.screenProps.homeState.profilePic }}
        />
        <View style={styles.body}>
          <View style={styles.bodyContent}>
            <Text style={styles.Profilename}>
              {this.props.screenProps.homeState.name}
            </Text>
            <Text style={styles.info}>
              Blood Group: {this.props.screenProps.homeState.bg}
            </Text>
            <ButtonGroup
              onPress={this.updateIndex}
              selectedIndex={this.state.selectedIndex}
              buttons={buttons}
              containerStyle={{
                flexDirection: "row",
                flex: 1,
                marginTop: 15,
                marginHorizontal: -10,
                paddingVertical: 8,
                backgroundColor: "rgba(250,250,250,0.2)"
              }}
            />
            <Text
              style={{
                alignSelf: "flex-start",
                fontSize: 20,
                marginLeft: 10,
                marginTop: 12,
                marginBottom: 3,
                fontWeight: "bold",
                color: "green"
              }}
            >
              You Can Donate on or onwards :{this.state.donationDate}
            </Text>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderRadius: 5,
                padding: 10,
                backgroundColor: "rgb(173, 10, 10)",
                paddingHorizontal: 50
              }}
              onPress={() => {
                fetch(
                  ip +
                    "/resetDonate/" +
                    this.props.screenProps.homeState.id +
                    "/",
                  {
                    method: "get",
                    headers: {
                      "Content-Type": "application/json",
                      Accept: "application/json"
                    },

                    credentials: "include"
                  }
                )
                  .then(response => {
                    if (response.status === 200) {
                      alert(
                        "Congratulations! You are someone's hero !\nYour next donation date will be reset soon !"
                      );
                      var today = new Date();
                      var dd = today.getDate();
                      var mm = today.getMonth() + 1; //January is 0!
                      var yyyy = today.getFullYear();
                      this.setState({
                        donationDate:
                          yyyy.toString() +
                          "-" +
                          mm.toString() +
                          "-" +
                          dd.toString()
                      });
                      this._onRefresh();
                    }
                  })
                  .catch(err => {
                    alert(err);
                  });
              }}
            >
              <Text
                style={{
                  alignSelf: "flex-start",
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "white"
                }}
              >
                I Donated Blood Today
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                alignSelf: "flex-start",
                fontSize: 20,
                marginLeft: 10,
                marginTop: 10,
                marginBottom: 3
              }}
            >
              Friend Requests
            </Text>
            <FlatList
              style={styles.list}
              contentContainerStyle={styles.listContainer}
              data={this.state.data}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => {
                return item.id.toString();
              }}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    style={{
                      marginVertical: 5,
                      backgroundColor: "white",
                      borderRadius: 5,
                      marginHorizontal: 10,
                      borderWidth: 0.3,
                      borderColor: "gray",
                      elevation: 0,
                      paddingHorizontal: 15
                    }}
                    onPress={() => {
                      this.props.screenProps.rootNavigation.navigate(
                        "AddProfile",
                        {
                          obj: item,
                          type: "request",
                          token: this.state.token
                        }
                      );
                    }}
                  >
                    <View style={styles.cardHeader} />
                    {item.profilePic ? (
                      <Image
                        style={styles.userImage}
                        source={{
                          uri: ip + item.profilePic
                        }}
                      />
                    ) : (
                      <Image
                        style={styles.userImage}
                        source={{
                          uri: ip + "/media/media/avatar.png"
                        }}
                      />
                    )}

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingTop: 12.5,
                        paddingBottom: 25,
                        paddingHorizontal: 16,
                        borderBottomLeftRadius: 1,
                        borderBottomRightRadius: 1,
                        backgroundColor: "#FFF"
                      }}
                    >
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <Text style={styles.name}>
                          {item.first_name + " " + item.last_name}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>

        <Text
          style={{
            alignSelf: "flex-start",
            fontSize: 20,
            marginLeft: 10,
            marginTop: 12,
            marginBottom: 3,
            fontWeight: "bold"
          }}
        >
          Your Details
        </Text>

        <Details
          screenProps={{
            homeState: this.props.screenProps.homeState,
            data1: this.state.data1
          }}
        />
        <Text
          style={{
            alignSelf: "flex-start",
            fontSize: 20,
            marginLeft: 10,
            marginTop: 15,
            marginBottom: 3,
            fontWeight: "bold"
          }}
        >
          Your Posts
        </Text>

        <Posts
          screenProps={{
            homeState: this.props.screenProps.homeState,
            data1: this.state.data1
          }}
        />
      </ScrollView>
    );
  }
}

export class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: this.props.screenProps.token,
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      selectedIndex: null
    };
    this.updateIndex = this.updateIndex.bind(this);
  }

  result = null;

  updateIndex(selectedIndex) {
    this.setState({ selectedIndex: selectedIndex });
    if (selectedIndex === 0) {
      this.pickImage();
    }
    if (selectedIndex === 1) {
      this.props.screenProps.rootNavigation.navigate("Post", {
        photo: null,
        token: this.props.screenProps.token
      });
    }
  }

  pickImage = async () => {
    result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true
    });

    if (!result.cancelled) {
      this.props.screenProps.rootNavigation.navigate("Post", {
        photo: result,
        token: this.props.screenProps.token
      });
    }
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  async componentDidUpdate() {
    if (this.camera.hasCameraPermission === false) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({ hasCameraPermission: status === "granted" });
    }
  }

  async remount(payload) {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  render() {
    const buttons = ["Gallery", "Skip"];
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <NavigationEvents
            onDidFocus={async payload => {
              await this.remount(payload);
            }}
          />
          <Camera
            style={{ flex: 1 }}
            type={this.state.type}
            ref={ref => {
              this.camera = ref;
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                flexDirection: "row"
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: "flex-end",
                  alignItems: "center"
                }}
                onPress={() => {
                  this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                  });
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    marginBottom: 10,
                    color: "white"
                  }}
                >
                  {" "}
                  <MaterialIcons name="camera-front" size={30} />{" "}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 0.8,
                  alignSelf: "flex-end",
                  alignItems: "center",
                  justifySelf: "center",
                  paddingLeft: 5
                }}
                onPress={async () => {
                  if (this.camera) {
                    result = await this.camera.takePictureAsync();
                    if (result) {
                      this.props.screenProps.rootNavigation.navigate("Post", {
                        photo: result,
                        token: this.props.screenProps.token
                      });
                    }
                  }
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    marginBottom: 10,
                    color: "white"
                  }}
                >
                  {" "}
                  <FeatherIcon name="circle" size={100} />{" "}
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
          <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={this.state.selectedIndex}
            buttons={buttons}
            containerStyle={{
              flexDirection: "row",
              flex: 0.1,
              marginTop: 0,
              marginLeft: -5,
              marginRight: -5,
              marginBottom: 0,
              padding: 0,
              paddingVertical: 2,
              backgroundColor: "rgba(250,250,250,0.2)"
            }}
          />
        </View>
      );
    }
  }
}

export class Feed extends Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    let objTemp;
    this.state = {
      token: this.props.screenProps.token,
      data: [],
      data1: [],
      data2: [],
      time: "",
      refreshing: false,
      isImageViewVisible: false,
      imageSource: ""
    };
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    fetch(ip + "/feed/", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + this.state.token
      }
    })
      .then(response => response.json())
      .then(response => {
        obj = response; //JSON.parse(response._bodyInit);
        objTemp = obj;
        this.setState({
          data: obj["groupPosts"],
          data1: obj["profilePosts"],
          data2: obj["formPosts"]
        });

        this.setState({ refreshing: false });
      })
      .catch(err => {
        console.log(err);
      });
  };
  componentWillMount() {
    fetch(ip + "/feed/", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + this.state.token
      }
    })
      .then(response => response.json())
      .then(response => {
        obj = response; //JSON.parse(response._bodyInit);
        this.setState({
          data: obj["groupPosts"],
          data1: obj["profilePosts"],
          data2: obj["formPosts"]
        });

        objTemp = this.state.data1;
      })
      .catch(err => {
        console.log(err);
      });
  }
  formData = new FormData();
  render() {
    let i = 0;

    return (
      <ImageBackground source={require("../bg5.jpg")} style={{ flex: 1 }}>
        <ImageView
          images={[
            {
              source: {
                uri: this.state.imageSource
              },
              title: "",
              width: width
            }
          ]}
          imageIndex={0}
          isVisible={this.state.isImageViewVisible}
        />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
          style={[
            styles.container,
            {
              backgroundColor: "rgba(0,0,0,0);"
            }
          ]}
        >
          <FlatList
            style={[
              styles.list,
              {
                backgroundColor: "rgba(0,0,0,0);"
              }
            ]}
            data={this.state.data2}
            keyExtractor={item => {
              item.group[0].id;
            }}
            ItemSeparatorComponent={() => {
              return <View style={styles.separator} />;
            }}
            renderItem={post => {
              const item = post.item;

              return (
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.props.screenProps.rootNavigation.navigate(
                            "GroupPage",
                            {
                              obj: item.group[0],
                              token: this.state.token
                            }
                          );
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            flex: 1,
                            alignItems: "center"
                          }}
                        >
                          {item.group[0].image ? (
                            <Image
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: 15,
                                marginLeft: 1,
                                marginRight: 5
                              }}
                              source={{
                                uri: ip + item.group[0].image
                              }}
                            />
                          ) : null}
                          <Text style={styles.title}>
                            {item.group[0].title}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <Text style={styles.title}>{item.postDetails}</Text>
                      <TextInput
                        style={styles.inputs}
                        placeholder="Enter your Response ..."
                        autoCapitalize="none"
                        underlineColorAndroid="transparent"
                        onChangeText={t => this.setState({ time: t })}
                      />
                      <Button
                        title="Submit Response"
                        style={{ color: "#00f", marginBottom: 10 }}
                        onPress={() => {
                          this.formData.append("time", this.state.time);
                          this.formData.append("id", item.id);
                          fetch(ip + "/send-response/", {
                            method: "post",
                            headers: {
                              "Content-Type": "multipart/form-data",
                              Accept: "application/json",
                              Authorization: "Token " + this.state.token
                            },
                            body: this.formData,

                            credentials: "include"
                          })
                            .then(response => {
                              if (response.status === 201) {
                                alert(
                                  "We have received your response! Thank You!"
                                );
                              } else {
                                alert("Please Try Again!");
                              }
                            })
                            .catch(err => {
                              alert(err);
                            });
                        }}
                      />
                      <View style={styles.timeContainer}>
                        <Image
                          style={styles.iconData}
                          source={{
                            uri:
                              "https://png.icons8.com/color/96/3498db/calendar.png"
                          }}
                        />

                        <Text style={styles.time}>
                          {item.time.toString().substring(0, 10)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            }}
          />

          <FlatList
            style={[
              styles.list,
              {
                backgroundColor: "rgba(0,0,0,0);"
              }
            ]}
            data={this.state.data}
            keyExtractor={item => {
              item.group[0].id.toString();
            }}
            ItemSeparatorComponent={() => {
              return <View style={styles.separator} />;
            }}
            renderItem={post => {
              const item = post.item;
              if (item.image != null) {
                image = (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      this.setState({
                        imageSource: ip + item.image.toString(),
                        isImageViewVisible: true
                      });
                    }}
                  >
                    <Image
                      style={[
                        styles.cardImage,
                        {
                          borderTopLeftRadius: 5,
                          borderTopRightRadius: 5
                        }
                      ]}
                      source={{
                        uri: ip + item.image.toString()
                      }}
                    />
                  </TouchableWithoutFeedback>
                );
              } else {
                image = null;
              }
              return (
                <View style={styles.card}>
                  {image}
                  <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                      <TouchableOpacity
                        onPress={() => {
                          /*this.props.screenProps.rootNavigation.navigate(
                            "GroupPage",
                            {
                              obj: item.group[0],
                              token: this.state.token
                            }
                          );*/
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            flex: 1,
                            alignItems: "center"
                          }}
                        >
                          {item.group[0].image ? (
                            <Image
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: 15,
                                marginLeft: 1,
                                marginRight: 5
                              }}
                              source={{
                                uri: ip + item.group[0].image
                              }}
                            />
                          ) : (
                            <Image
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: 15,
                                marginLeft: 1,
                                marginRight: 5
                              }}
                              source={{
                                uri: ip + "/media/media/groupDefault.png"
                              }}
                            />
                          )}
                          <Text style={styles.title}>
                            {item.group[0].title}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <Text style={styles.description}>{item.postDetails}</Text>
                      <View style={styles.timeContainer}>
                        <Image
                          style={styles.iconData}
                          source={{
                            uri:
                              "https://png.icons8.com/color/96/3498db/calendar.png"
                          }}
                        />
                        <Text style={styles.time}>
                          {item.time.toString().substring(0, 10)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            }}
          />

          <FlatList
            style={[
              styles.list,
              {
                backgroundColor: "rgba(0,0,0,0);",
                marginBottom: 15
              }
            ]}
            data={this.state.data1}
            keyExtractor={item => {
              item.id.toString();
            }}
            ItemSeparatorComponent={() => {
              return <View style={styles.separator} />;
            }}
            renderItem={(post, index) => {
              const item = post.item;
              if (item.image != null) {
                image = (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      this.setState({
                        imageSource: ip + item.image,
                        isImageViewVisible: true
                      });
                    }}
                  >
                    <Image
                      style={[
                        styles.cardImage,
                        {
                          flex: 1,
                          borderTopLeftRadius: 5,
                          borderTopRightRadius: 5
                        }
                      ]}
                      source={{
                        uri: ip + item.image
                      }}
                    />
                  </TouchableWithoutFeedback>
                );
              } else {
                image = null;
              }
              return (
                <View style={styles.card}>
                  {image}
                  <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.props.screenProps.rootNavigation.navigate(
                            "Profile",
                            {
                              obj: item.user,
                              type: "2",
                              token: this.state.token
                            }
                          );
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            flex: 1,
                            alignItems: "center"
                          }}
                        >
                          {item.user.profilePic ? (
                            <Image
                              resizeMode="contain"
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: 15,
                                marginLeft: 1,
                                marginRight: 5
                              }}
                              source={{
                                uri: ip + item.user.profilePic
                              }}
                            />
                          ) : (
                            <Image
                              resizeMode="contain"
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: 15,
                                marginLeft: 1,
                                marginRight: 5
                              }}
                              source={{
                                uri: ip + "/media/media/avatar.png"
                              }}
                            />
                          )}
                          <Text style={styles.title}>
                            {item.user.first_name + " " + item.user.last_name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <Text style={styles.description}>{item.postDetails}</Text>
                      <View style={styles.timeContainer}>
                        <Image
                          style={styles.iconData}
                          source={{
                            uri:
                              "https://png.icons8.com/color/96/3498db/calendar.png"
                          }}
                        />
                        <Text style={styles.time}>
                          {item.time.toString().substring(0, 10)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.cardFooter}>
                    <View style={styles.socialBarContainer}>
                      <View style={styles.socialBarSection}>
                        <TouchableOpacity
                          style={styles.socialBarButton}
                          onPress={() => {
                            item["likes"] = item["likes"] + 1;
                            this.setState({ data1: this.state.data1 });

                            fetch(ip + "/likePost/", {
                              method: "post",
                              headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                Authorization: "Token " + this.state.token
                              },
                              body: JSON.stringify({
                                id: item.id
                              })
                            })
                              .then(response => {
                                if (response.status === 200) {
                                  this.refs.toast.show("Post Liked", 1000);
                                } else {
                                  this.refs.toast.show(
                                    "Could Not Like Post! Please try again after sometime!",
                                    1000
                                  );
                                  item["likes"] = item["likes"] - 1;
                                  this.setState({ data1: this.state.data1 });
                                }
                              })
                              .catch(err => {
                                this.refs.toast.show(
                                  "Could Not Like Post! Please try again after sometime!",
                                  1000
                                );
                                item["likes"] = item["likes"] - 1;
                                this.setState({ data1: this.state.data1 });
                                console.log(err);
                              });
                          }}
                        >
                          <Image
                            style={styles.icon}
                            source={{
                              uri:
                                "https://png.icons8.com/material/96/2ecc71/thumb-up.png"
                            }}
                          />
                          <Text style={styles.socialBarLabel}>
                            {item.likes}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        </ScrollView>
        <Toast
          ref="toast"
          style={{ backgroundColor: "black", marginTop: 20 }}
          position="bottom"
          positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{ color: "white" }}
        />
      </ImageBackground>
    );
  }
}

export class Groups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: this.props.screenProps.token,
      data: ""
    };
  }

  componentDidMount() {
    this.setState({ data: this.props.screenProps.homeState.allData });
  }

  render() {
    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
      >
        <Text
          style={{
            paddingLeft: 10,
            paddingTop: 10,
            paddingBottom: 5,
            fontSize: 22,
            color: "gray"
          }}
        >
          Your Groups
        </Text>

        {this.props.screenProps.homeState.yourGroups == "" ? (
          <Text
            style={{
              paddingLeft: 15,
              paddingTop: 8,
              paddingBottom: 2,
              fontSize: 15,
              color: "black"
            }}
          >
            You are not a member of any group yet!
          </Text>
        ) : (
          this.props.screenProps.homeState.yourGroups.map((l, i) => (
            <TouchableOpacity
              onPress={() => {
                this.props.screenProps.rootNavigation.push("GroupPage", {
                  obj: this.state.data["groupData"][l.title.toString()],
                  token: this.state.token,
                  addMessage: this.props.screenProps.addMessage,
                  type: "group",
                  resetChatOpened: this.props.screenProps.resetChatOpened,
                  hasChatPrivilege: this.props.screenProps.homeState
                    .hasChatPrivilege
                });
                this.props.screenProps.openChat("Group", l.title);
              }}
            >
              {l.image ? (
                <ListItem
                  key={i}
                  avatar={{
                    uri: ip + l.image
                  }}
                  title={l.title}
                  subtitle={l.description}
                  rightIcon={
                    l.messageCount !== 0 ? (
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          backgroundColor: "rgb(25, 80, 120)",
                          fontSize: 15,
                          padding: 10,
                          borderRadius: 10
                        }}
                      >
                        {l.messageCount}
                      </Text>
                    ) : (
                      undefined
                    )
                  }
                />
              ) : (
                <ListItem
                  key={i}
                  avatar={{
                    uri: ip + "/media/media/groupDefault.png"
                  }}
                  title={l.title}
                  subtitle={l.description}
                  rightIcon={
                    l.messageCount !== 0 ? (
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          backgroundColor: "rgb(25, 80, 120)",
                          fontSize: 15,
                          padding: 10,
                          borderRadius: 10
                        }}
                      >
                        {l.messageCount}
                      </Text>
                    ) : (
                      undefined
                    )
                  }
                />
              )}
            </TouchableOpacity>
          ))
        )}

        <Text
          style={{
            paddingLeft: 10,
            paddingTop: 10,
            paddingBottom: 5,
            fontSize: 22,
            color: "gray"
          }}
        >
          Your Chats
        </Text>

        {this.props.screenProps.homeState.yourChats == "" ? (
          <Text
            style={{
              paddingLeft: 15,
              paddingTop: 8,
              paddingBottom: 2,
              fontSize: 15,
              color: "black"
            }}
          >
            You do not have any chats yet!
          </Text>
        ) : (
          this.props.screenProps.homeState.yourChats.map((l, i) => (
            <TouchableOpacity
              onPress={() => {
                this.props.screenProps.openChat("User", l.title);
                this.props.screenProps.rootNavigation.navigate("GroupPage", {
                  obj: this.state.data["userData"][l.title.toString()],
                  token: this.state.token,
                  addMessage: this.props.screenProps.addMessage,
                  type: "user",
                  resetChatOpened: this.props.screenProps.resetChatOpened
                });
              }}
            >
              {l.image ? (
                <ListItem
                  key={i}
                  avatar={{
                    uri: ip + l.image
                  }}
                  title={l.title}
                  rightIcon={
                    l.messageCount !== 0 ? (
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          backgroundColor: "rgb(25, 80, 120)",
                          fontSize: 15,
                          padding: 10,
                          borderRadius: 10
                        }}
                      >
                        {l.messageCount}
                      </Text>
                    ) : (
                      undefined
                    )
                  }
                />
              ) : (
                <ListItem
                  key={i}
                  avatar={{
                    uri: ip + "/media/media/avatar.png"
                  }}
                  title={l.title}
                  rightIcon={
                    l.messageCount !== 0 ? (
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          backgroundColor: "rgb(25, 80, 120)",
                          fontSize: 15,
                          padding: 10,
                          borderRadius: 10
                        }}
                      >
                        {l.messageCount}
                      </Text>
                    ) : (
                      undefined
                    )
                  }
                />
              )}
            </TouchableOpacity>
          ))
        )}

        <Text
          style={{
            paddingLeft: 10,
            paddingTop: 15,
            paddingBottom: 7,
            fontSize: 22,
            color: "gray"
          }}
        >
          Available Groups
        </Text>
        {this.props.screenProps.homeState.availableGroups == "" ? (
          <Text
            style={{
              paddingLeft: 15,
              paddingTop: 8,
              paddingBottom: 2,
              fontSize: 15,
              color: "black"
            }}
          >
            There are no groups to join at the moment!
          </Text>
        ) : (
          this.props.screenProps.homeState.availableGroups.map((l, i) => (
            <TouchableOpacity
              onPress={() => {
                fetch(ip + "/joinGroup/", {
                  method: "post",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Token " + this.state.token
                  },
                  body: JSON.stringify({
                    group: l.id
                  })
                })
                  .then(response => {
                    if (response.status === 200) {
                      alert("Your request has been sent!Thank You!");
                    } else {
                      alert("Please Try Again");
                    }
                  })
                  .catch(err => {
                    console.log(err);
                  });
              }}
            >
              {l.image ? (
                <ListItem
                  key={i + 100}
                  avatar={{
                    uri: ip + l.image
                  }}
                  title={l.title}
                  subtitle={l.description}
                  rightIcon={
                    <FeatherIcon name={"user-plus"} size={20} color={"gray"} />
                  }
                />
              ) : (
                <ListItem
                  key={i + 100}
                  avatar={{
                    uri: ip + "/media/media/groupDefault.png"
                  }}
                  title={l.title}
                  subtitle={l.description}
                  rightIcon={
                    <FeatherIcon name={"user-plus"} size={20} color={"gray"} />
                  }
                />
              )}
            </TouchableOpacity>
          ))
        )}

        <Text
          style={{
            paddingLeft: 10,
            paddingTop: 15,
            paddingBottom: 7,
            fontSize: 22,
            color: "gray"
          }}
        >
          Your Friends
        </Text>

        {this.props.screenProps.homeState.friends.length === 0 ? (
          <Text
            style={{
              paddingLeft: 15,
              paddingTop: 8,
              paddingBottom: 2,
              fontSize: 15,
              color: "black"
            }}
          >
            Please Add some friends
          </Text>
        ) : (
          this.props.screenProps.homeState.friends.map((element, i) => (
            <TouchableOpacity
              onPress={() => {
                this.props.screenProps.rootNavigation.navigate("GroupPage", {
                  obj: { information: element, messages: [] },
                  token: this.state.token,
                  addMessage: this.props.screenProps.addMessage,
                  type: "new",
                  addChat: this.props.screenProps.addChat,
                  resetChatOpened: this.props.screenProps.resetChatOpened
                });
              }}
            >
              {element.profilePic ? (
                <ListItem
                  key={i}
                  avatar={{
                    uri: element.profilePic
                  }}
                  title={element.first_name + " " + element.last_name}
                />
              ) : (
                <ListItem
                  key={i}
                  avatar={{
                    uri: ip + "/media/media/avatar.png"
                  }}
                  title={element.first_name + " " + element.last_name}
                />
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    );
  }
}

export default class HomeChat extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Janakalyan Blood Bank",
      headerLeft: (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={navigation.getParam("openDrawer")}
        >
          <Entypo name="menu" size={25} color={"white"} />
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={async () => {
            try {
              const result = await Share.share({
                message:
                  'Follow the link to download "Jankalyan Blood Bank App, pune" - \n https://play.google.com/store/apps/details?id=com.jankalyan.bloodBank'
              });

              if (result.action === Share.sharedAction) {
                if (result.activityType) {
                  // shared with activity type of result.activityType
                } else {
                  // shared
                }
              } else if (result.action === Share.dismissedAction) {
                // dismissed
              }
            } catch (error) {
              alert(error.message);
            }
          }}
        >
          <FeatherIcon name="share-2" size={25} color={"white"} />
        </TouchableOpacity>
      ),
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
    self = this.openControlPanel;

    this.state = {
      name: "",
      email: "",
      phone: "",
      bg: "",
      dob: "",
      address: "",
      donationDate: "",
      profilePic: null,
      aadhar: "",
      officeAddress: "",
      education: "",
      profession: "",
      emergencyContact: "",
      friends: [],
      friendRequest: [],
      id: "",
      wsToken: "",
      yourGroups: "",
      availableGroups: "",
      yourFriends: "",
      yourChats: "",
      allData: "",
      chatOpened: ""
    };

    this.ws = undefined;
  }

  gotoFriends = () => {
    this.props.navigate("FriendsList");
  };

  closeControlPanel = () => {
    this._drawer.close();
  };
  openControlPanel = () => {
    this._drawer.open();
  };

  componentDidMount() {
    this.props.navigation.setParams({
      openDrawer: this.openControlPanel
    });

    fetch(ip + "/profile.json", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + this.props.navigation.getParam("token")
      }
    })
      .then(response => response.json())
      .then(response => {
        obj = response[0]; //JSON.parse(response._bodyInit)[0];
        this.setState({
          name: obj.first_name + " " + obj.last_name,
          email: obj.email,
          phone: obj.phone,
          dob: obj.dob,
          bg: obj.bloodGroup,
          address: obj.address,
          profilePic: obj.profilePic,
          donationDate: obj.donationDate,
          aadhar: obj.adhaarNo,
          gender: obj.gender,
          officeAddress: obj.officeAddress,
          profession: obj.profession,
          emergencyContact: obj.emergencyContact,
          education: obj.education,
          friends: obj.friends,
          friendRequest: obj.friendRequests,
          id: obj.id,
          hasChatPrivilege: obj.hasChatPrivilege
        });

        this.props.navigation.setParams({
          friends: this.state.friends,
          friendRequests: this.state.friendRequest,
          token: this.props.navigation.getParam("token"),
          name: this.state.name
        });
      })
      .catch(err => {
        console.log(err);
      });

    fetch(ip + "/chatFetch/", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + this.props.navigation.getParam("token")
      }
    })
      .then(response => response.json())
      .then(response => {
        obj = response; //JSON.parse(response);
        this.setState({
          wsToken: obj["wsToken"]["token"],
          availableGroups: obj["availableGroups"],
          userGroups: obj["userGroups"]
        });
        this.sort(obj);
        //this.saveMessages()

        this.ws = new WebSocket(wsip + "/ws/chat/appRoom/", [
          "Token",
          this.state.wsToken
        ]);

        allData = this.state.allData;

        this.ws.onopen = () => {
          this.setState({ websocketConnected: true });
          //this.ws.send('something'); // send a message
        };

        this.ws.onmessage = e => {
          msg = JSON.parse(e.data)["message"].split(": ");

          if (msg[0] === "UR") {
            msg[1] = this.getNameFromPhone(msg[1]);
            name = msg[1].first_name + " " + msg[1].last_name;
            if (!(name in allData["userData"])) {
              this.addChat(msg[1]);
            }
            if (msg[1].profilePic !== null) {
              this.addMessage("userData", name, {
                _id: 1,
                text: msg[2],
                createdAt: new Date(),
                user: {
                  _id: 2,
                  name: name,
                  avatar: msg[1].profilePic
                }
              });
            } else {
              this.addMessage("userData", name, {
                _id: 1,
                text: msg[2],
                createdAt: new Date(),
                user: {
                  _id: 2,
                  name: name
                }
              });
            }

            this.sortChatOrder();
            this.incChatCounter("User", name);
          } else if (msg[0] === "GR") {
            groupName = msg[1];
            if (msg[2] === "Admin") {
              senderName = "Admin";
            } else {
              u = this.getNameFromPhoneGroup(msg[2], groupName);
              senderName = u.first_name + " " + u.last_name;
            }

            message = msg[3];
            if (msg.length === 4) {
              this.addMessage("groupData", groupName, {
                _id: Math.random()
                  .toString(36)
                  .substring(2),
                text: message,
                createdAt: new Date(),
                user: {
                  _id: 2,
                  name: senderName
                }
              });
            } else if (msg.length === 6) {
              if (msg[4] === "Image") {
                this.addMessage("groupData", groupName, {
                  _id: Math.random()
                    .toString(36)
                    .substring(2),
                  text: message,
                  image: ip + msg[4],
                  createdAt: new Date(),
                  user: {
                    _id: 2,
                    name: senderName
                  }
                });
              } else if (msg[4] === "Form") {
                this.addMessage("groupData", groupName, {
                  _id: Math.random()
                    .toString(36)
                    .substring(2),
                  text: message,
                  quickReplies: { id: msg[5] },
                  createdAt: new Date(),
                  user: {
                    _id: 2,
                    name: senderName
                  }
                });
              }
            }

            this.sortChatOrder();
            this.incChatCounter("Group", groupName);
          } else if (msg[0] === "US") {
          } else if (msg[0] === "GS") {
          }

          this.props.screenProps.update();
        };

        this.ws.onerror = e => {
          // an error occurred
          this.setState({ websocketConnected: false });
          this.ws = new WebSocket(wsip + "/ws/chat/appRoom/", [
            "Token",
            this.state.wsToken
          ]);
          alert(
            "Could not send/receive Messages!Please restart the app or try again after sometime!"
          );
        };

        this.ws.onclose = e => {
          // connection closed
          this.setState({ websocketConnected: false });
          this.ws = new WebSocket(wsip + "/ws/chat/appRoom/", [
            "Token",
            this.state.wsToken
          ]);
          alert(
            "Could not send/receive Messages!Please restart the app or try again after sometime!"
          );
        };
      })
      .catch(err => {
        console.log(err);
      });
  }

  encryptName(name) {
    name = name.replace(" ", "_");
    name = name.replace("+", "plusSymbol");
    name = name.replace("-", "minusSymbol");
    name = name.replace("(", "openBracketSymbol");
    name = name.replace(")", "closeBracketSymbol");
    name = name.replace("/", "slashSymbol");
    name = name.replace(":", "colonSymbol");
    return name;
  }

  decryptName(name) {
    name = name.replace("_", " ");
    name = name.replace("plusSymbol", "+");
    name = name.replace("minusSymbol", "-");
    name = name.replace("openBracketSymbol", "(");
    name = name.replace("closeBracketSymbol", ")");
    name = name.replace("slashSymbol", "/");
    name = name.replace("colonSymbol", ":");
    return name;
  }

  async retrieveLatestDates() {
    latestDates = {};

    for (i = 0; i < this.state.userGroups.length; i++) {
      element = this.state.userGroups[i];
      name = element.title;
      response = await SecureStore.getItemAsync(this.encryptName(name));
      if (response !== null) {
        latestDates[name] = JSON.parse(response)["date"];
      }
    }

    for (i = 0; i < this.state.friends.length; i++) {
      element = this.state.friends[i];
      name = element.first_name + " " + element.last_name;
      response = await SecureStore.getItemAsync(this.encryptName(name));
      if (response !== null) {
        latestDates[name] = JSON.parse(response)["date"];
      }
    }

    this.setState({ latestDates: latestDates });
  }
  omponentWillUnmount() {
    SecureStore.setItemAsync("latestChat", new Date()).then(response => {});
  }

  async sort(obj) {
    await this.retrieveLatestDates();

    currentPhone = this.state.phone;
    let groupData = {};
    let userData = {};

    obj["userGroups"].forEach(element => {
      groupData[element.title] = {
        information: element,
        unreadMessagesCount: 0,
        latest: new Date("2018"),
        messages: []
      };
    });

    imageData = obj["imageData"];
    formData = obj["formData"];
    textData = obj["textData"];

    imageData.forEach(element => {
      img = element.image;
      message = element.postDetails;
      time = new Date(element.time);
      for (i = 0; i < element.group.length; i++) {
        if (element.group[i] in groupData) {
          if (img === null || img === undefined || img === "") {
            groupData[element.group[i]]["messages"].push({
              _id: 1,
              text: message,
              createdAt: time,
              user: {
                _id: 2,
                name: "Admin",
                avatar: "https://placeimg.com/140/140/any"
              }
            });
          } else {
            groupData[element.group[i]]["messages"].push({
              _id: 1,
              text: message,
              createdAt: time,
              image: img,
              user: {
                _id: 2,
                name: "Admin",
                avatar: "https://placeimg.com/140/140/any"
              }
            });
          }

          if (element.group[i] in this.state.latestDates) {
            if (time > this.state.latestDates[element.group[i]]) {
              groupData[element.group[i]]["unreadMessagesCount"] += 1;
            }
          } else {
            groupData[element.group[i]]["unreadMessagesCount"] += 1;
          }

          if (time > groupData[element.group[i]]["latest"]) {
            groupData[element.group[i]]["latest"] = time;
          }
        }
      }
    });

    formData.forEach(element => {
      message = element.postDetails;
      time = new Date(element.time);
      for (i = 0; i < element.group.length; i++) {
        if (element.group[i] in groupData) {
          groupData[element.group[i]]["messages"].push({
            _id: 1,
            text: message,
            createdAt: time,
            quickReplies: { id: element.id },
            user: {
              _id: 2,
              name: "Admin",
              avatar: "https://placeimg.com/140/140/any"
            }
          });

          if (element.group[i] in this.state.latestDates) {
            if (time > this.state.latestDates[element.group[i]]) {
              groupData[element.group[i]]["unreadMessagesCount"] += 1;
            }
          } else {
            groupData[element.group[i]]["unreadMessagesCount"] += 1;
          }

          if (time > groupData[element.group[i]]["latest"]) {
            groupData[element.group[i]]["latest"] = time;
          }
        }
      }
    });

    textData.forEach(element => {
      message = element.message;
      time = new Date(element.time);

      if (element.isGroup) {
        if (element.group in groupData) {
          if (element.user1.phone === currentPhone) {
            groupData[element.group]["messages"].push({
              _id: 1,
              text: message,
              createdAt: time,
              user: {
                _id: 1,
                name: element.user1.first_name + " " + element.user1.last_name,
                avatar: ip + element.user1.profilePic
              }
            });
          } else {
            groupData[element.group]["messages"].push({
              _id: 1,
              text: message,
              createdAt: time,
              user: {
                _id: 2,
                name: element.user1.first_name + " " + element.user1.last_name,
                avatar: ip + element.user1.profilePic
              }
            });
            if (time > this.state.latestChat) {
              groupData[element.group]["unreadMessagesCount"] += 1;
            }

            if (element.group in this.state.latestDates) {
              if (time > this.state.latestDates[element.group]) {
                groupData[element.group]["unreadMessagesCount"] += 1;
              }
            } else {
              groupData[element.group]["unreadMessagesCount"] += 1;
            }
          }

          if (time > groupData[element.group]["latest"]) {
            groupData[element.group]["latest"] = time;
          }
        }
      } else {
        if (element.user1.phone === currentPhone) {
          name = element.user2.first_name + " " + element.user2.last_name;
          if (!(name in userData)) {
            userData[name] = {
              information: element.user2,
              unreadMessagesCount: 0,
              messages: [],
              latest: new Date("2018")
            };
          }

          userData[name]["messages"].push({
            _id: 1,
            text: message,
            createdAt: time,
            user: {
              _id: 1,
              name: element.user1.first_name + " " + element.user1.last_name,
              avatar: ip + element.user1.profilePic
            }
          });

          /*if(time>this.state.latestChat){
            userData[name]["unreadMessagesCount"] += 1
          }*/

          if (time > userData[name]["latest"]) {
            userData[name]["latest"] = time;
          }
        } else if (element.user2.phone === currentPhone) {
          name = element.user1.first_name + " " + element.user1.last_name;
          if (!(name in userData)) {
            userData[name] = {
              information: element.user1,
              unreadMessagesCount: 0,
              messages: [],
              latest: new Date("2018")
            };
          }

          userData[name]["messages"].push({
            _id: 2,
            text: message,
            createdAt: time,
            user: {
              _id: 2,
              name: element.user1.first_name + " " + element.user1.last_name,
              avatar: ip + element.user1.profilePic
            }
          });

          if (name in this.state.latestDates) {
            if (time > this.state.latestDates[name]) {
              userData[name]["unreadMessagesCount"] += 1;
            }
          } else {
            userData[name]["unreadMessagesCount"] += 1;
          }

          if (time > userData[name]["latest"]) {
            userData[name]["latest"] = time;
          }
        }
      }
    });

    groupArray = [];
    userArray = [];

    this.setState({
      yourGroups: groupArray,
      yourChats: userArray,
      allData: { groupData: groupData, userData: userData }
    });

    this.sortChatOrder();
  }

  sortChatOrder() {
    groupArray = [];
    userArray = [];
    groupData = this.state.allData["groupData"];
    userData = this.state.allData["userData"];

    for (var key in groupData) {
      if (groupData.hasOwnProperty(key)) {
        groupArray.push({
          title: key,
          description: groupData[key]["information"]["description"],
          image: groupData[key]["information"]["image"],
          latest: groupData[key]["latest"],
          messageCount: groupData[key]["unreadMessagesCount"]
        });
      }
    }

    for (var key in userData) {
      if (userData.hasOwnProperty(key)) {
        userArray.push({
          title: key,
          image: userData[key]["information"]["profilePic"],
          latest: userData[key]["latest"],
          messageCount: userData[key]["unreadMessagesCount"]
        });
      }
    }

    groupArray = groupArray.slice(0);
    groupArray.sort(function(a, b) {
      return b.latest - a.latest;
    });

    userArray = userArray.slice(0);
    userArray.sort(function(a, b) {
      return b.latest - a.latest;
    });

    this.setState({ yourGroups: groupArray, yourChats: userArray });
  }

  resetChatOpened = () => {
    this.setState({ chatOpened: "" });
  };

  incChatCounter(type, name) {
    if (type === "User") {
      allData = this.state.allData;
      userArray = this.state.yourChats;
      userArray.forEach(element => {
        if (element.title === name && this.state.chatOpened !== name) {
          element.messageCount += 1;
          allData["userData"][name]["unreadMessagesCount"] += 1;
        }
      });
      this.setState({ yourChats: userArray, allData: allData });
    } else if (type === "Group") {
      allData = this.state.allData;
      groupArray = this.state.yourGroups;
      groupArray.forEach(element => {
        if (element.title === name && this.state.chatOpened !== name) {
          element.messageCount += 1;
          allData["groupData"][name]["unreadMessagesCount"] += 1;
        }
      });
      this.setState({ yourGroups: groupArray, allData: allData });
    }
  }

  openChat = (type, name) => {
    if (type === "Group") {
      groupArray = this.state.yourGroups;
      groupArray.forEach(element => {
        if (element.title === name) {
          element.messageCount = 0;
          SecureStore.setItemAsync(
            this.encryptName(name),
            JSON.stringify({
              date: new Date()
            })
          );
        }
      });

      allData = this.state.allData;
      allData["groupData"][name]["unreadMessagesCount"] = 0;

      this.setState({
        yourGroups: groupArray,
        chatOpened: name,
        allData: allData
      });
    } else if (type === "User") {
      userArray = this.state.yourChats;
      userArray.forEach(element => {
        if (element.title === name) {
          element.messageCount = 0;
          SecureStore.setItemAsync(
            this.encryptName(name),
            JSON.stringify({
              date: new Date()
            })
          );
        }
      });

      allData = this.state.allData;
      allData["userData"][name]["unreadMessagesCount"] = 0;

      this.setState({
        yourChats: userArray,
        chatOpened: name,
        allData: allData
      });
    }
  };

  addChat = element => {
    userArray = this.state.yourChats;
    userArray.push({
      title: element.first_name + " " + element.last_name,
      image: element.profilePic,
      latest: new Date("2018"),
      messageCount: 0
    });

    allData = this.state.allData;

    allData["userData"][element.first_name + " " + element.last_name] = {
      information: element,
      unreadMessagesCount: 0,
      messages: [],
      latest: new Date("2018")
    };

    this.setState({ allData: allData, yourChats: userArray });
  };

  addMessage = (type, name, message, send = false) => {
    if (this.state.websocketConnected) {
      if (!(name in this.state.allData[type])) {
        this.addChat(this.getElement(name));
      }
      allData = this.state.allData;
      allData[type][name].messages.push(message);
      //allData[type][name].unreadMessagesCount += 1
      this.props.navigation.setParams({
        obj: this.state.allData[type][name],
        flag: true
      });
      allData[type][name].latest = new Date();
      this.setState({ allData: allData });

      if (type === "userData" && send) {
        phone = this.getPhoneFromName(name);
        this.ws.send(
          JSON.stringify({
            message: "User: " + phone.phone + ": " + message.text
          })
        );
      } else if (type === "groupData" && send) {
        this.ws.send(
          JSON.stringify({
            message: "Group: " + name + ": " + message.text
          })
        );
      }

      SecureStore.setItemAsync(
        this.encryptName(name),
        JSON.stringify({
          date: new Date()
        })
      );
    } else {
      alert(
        "Could Not Connect to Server!Please Restart App or try again after sometime!"
      );
    }
    //this.props.screenProps.update()
  };

  getNameFromPhoneGroup(phone, groupName) {
    allData = this.state.allData;
    users = allData["groupData"][groupName].information.user;
    for (i = 0; i < users.length; i++) {
      element = users[i];
      if (element.phone.toString() === phone.toString()) {
        return element; //element.first_name + " " + element.last_name
      }
    }

    return "";
  }

  getNameFromPhone(phone) {
    for (i = 0; i < this.state.friends.length; i++) {
      element = this.state.friends[i];
      if (element.phone.toString() === phone.toString()) {
        return element; //element.first_name + " " + element.last_name
      }
    }

    return "";
  }

  getPhoneFromName(name) {
    for (i = 0; i < this.state.friends.length; i++) {
      element = this.state.friends[i];
      if (element.first_name + " " + element.last_name === name) {
        return element; //element.first_name + " " + element.last_name
      }
    }

    return "";
  }

  getElement(name) {
    for (i = 0; i < this.state.friends.length; i++) {
      element = this.state.friends[i];
      if (element.first_name + " " + element.last_name === name) {
        return element; //element.first_name + " " + element.last_name
      }
    }

    return "";
  }

  render() {
    return (
      <Drawer
        ref={ref => (this._drawer = ref)}
        content={
          <DrawerContent
            name={this.state.name}
            bloodGroup={this.state.bg}
            profilePic={this.state.profilePic}
            close={this.closeControlPanel}
            nav={this.props.navigation}
            token={this.props.navigation.getParam("token")}
          />
        }
        type="displace"
        tapToClose={true}
        openDrawerOffset={0.15}
        panCloseMask={
          0.15 // 20% gap on the right side of drawer
        }
        closedDrawerOffset={-3}
        styles={this.drawerStyles}
        tweenHandler={ratio => ({
          main: { opacity: (2 - ratio) / 2 }
        })}
      >
        <View style={styles.container}>
          <Tabs
            screenProps={{
              rootNavigation: this.props.navigation,
              token: this.props.navigation.getParam("token"),
              homeState: this.state,
              openChat: this.openChat,
              addMessage: this.addMessage,
              addChat: this.addChat,
              openNewChat: this.openNewChat,
              resetChatOpened: this.resetChatOpened
            }}
          />
        </View>
      </Drawer>
    );
  }
}

const Tabs = createAppContainer(
  createBottomTabNavigator(
    {
      Feed: {
        screen: Feed,
        navigationOptions: {
          tabBarLabel: "Home",
          tabBarIcon: ({ tintColor }) => (
            <FeatherIcon name="home" size={25} color={tintColor} />
          )
        }
      },
      Groups: {
        screen: Groups,
        navigationOptions: {
          tabBarLabel: "Groups",
          tabBarIcon: ({ tintColor }) => (
            <Entypo name="chat" size={25} color={tintColor} />
          )
        }
      },
      Post: {
        screen: Post,
        navigationOptions: {
          tabBarLabel: "Post",
          tabBarIcon: ({ tintColor }) => (
            <Entypo name="squared-plus" size={25} color={tintColor} />
          )
        }
      },

      Profile: {
        screen: Profile,
        navigationOptions: {
          tabBarLabel: "Your Profile",
          tabBarIcon: ({ tintColor }) => (
            <Entypo name="user" size={25} color={tintColor} />
          )
        }
      }
    },
    {
      tabBarOptions: {
        activeTintColor: "#222",
        inactiveTintColor: "gray",
        style: {},
        showLabel: true,
        activeBackgroundColor: "#ddd"
      }
    },
    {
      lazy: false
    }
  )
);

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#660000",
    height: 120
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
  },
  Profilename: {
    fontSize: 32,
    color: "#000",
    fontWeight: "bold",
    paddingTop: 20,
    paddingBottom: 2,
    alignSelf: "center"
  },
  body: {
    marginTop: 40
  },
  bodyContent: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 30
  },
  info: {
    fontSize: 16,
    color: "#00BFFF",
    marginTop: 5
  },
  description: {
    fontSize: 18,
    color: "#696969",
    textAlign: "center",
    marginLeft: 10,
    marginVertical: 20
  },
  viewDesc: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 1,
    marginTop: 10,
    textAlign: "center"
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: "#00BFFF"
  },
  container: {
    flex: 1
  },
  list: {
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    paddingTop: 5
  },
  separator: {
    marginTop: 5
  },
  /******** card **************/
  card: {
    shadowColor: "#00000000",
    shadowOffset: {
      width: 0
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    marginVertical: 0,
    backgroundColor: "white",
    borderRadius: 25
  },
  cardHeader: {
    paddingVertical: 17,
    paddingHorizontal: 16,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  cardContent: {
    paddingVertical: 12.5,
    paddingHorizontal: 16
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
    backgroundColor: "#EEEEEE"
  },
  cardImage: {
    flex: 1,
    width: undefined,
    height: 410
  },
  /******** card components **************/
  title: {
    fontSize: 18,
    flex: 1
  },
  description: {
    fontSize: 15,
    color: "#888",
    flex: 1,
    marginTop: 5,
    marginBottom: 5
  },
  time: {
    fontSize: 13,
    color: "#808080",
    marginTop: 5
  },
  icon: {
    width: 25,
    height: 25
  },
  iconData: {
    width: 15,
    height: 15,
    marginTop: 5,
    marginRight: 5
  },
  timeContainer: {
    flexDirection: "row"
  },
  /******** social bar ******************/
  socialBarContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flex: 1
  },
  socialBarSection: {
    justifyContent: "flex-end",
    flexDirection: "row",
    flex: 1
  },
  socialBarlabel: {
    marginLeft: 8,
    alignSelf: "flex-end",
    justifyContent: "center",
    paddingLeft: 10
  },
  socialBarButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },

  listContainer: {
    alignItems: "center"
  },
  /******** card **************/
  card: {
    shadowColor: "#00000000",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 3,

    marginVertical: 2,
    backgroundColor: "rgba(255,255,255,0.9)",
    flexBasis: "46%",
    marginHorizontal: 1,
    borderRadius: 5,
    borderWidth: 0.1,
    borderColor: "rgba(0,0,0,0.1)"
  },
  cardFooter: {
    paddingBottom: 15,
    paddingTop: 0,
    paddingHorizontal: 16,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  cardContent: {
    paddingTop: 6,
    paddingBottom: 3,
    paddingHorizontal: 16
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: "transparent",
    flex: 1
  },
  userImage: {
    height: 120,
    width: 120,
    borderRadius: 60,
    alignSelf: "center",
    borderColor: "#DCDCDC",
    borderWidth: 3
  },
  name: {
    fontSize: 18,
    flex: 1,
    alignSelf: "center",
    color: "#008080",
    fontWeight: "bold"
  },
  position: {
    fontSize: 14,
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    alignSelf: "center",
    color: "#696969"
  },
  followButton: {
    marginTop: 10,
    height: 35,
    width: 100,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "#00BFFF"
  },
  followButtonText: {
    color: "#FFFFFF",
    fontSize: 20
  },
  icon: {
    height: 20,
    width: 20
  }
});

const drawerStyles = {
  drawer: { shadowColor: "#000000", shadowOpacity: 0.8, shadowRadius: 3 },
  main: { paddingLeft: 3 }
};

AppRegistry.registerComponent("bloodBankApp2", () => Home);

/*

async retrieveMessages(){
    allData = {"groupData":{},"userData":{}}

    for(i=0;i<this.state.userGroups.length;i++){
      element = this.state.userGroups[i]
      name = element.title
      response = await SecureStore.getItemAsync(this.encryptName(name))
      if(response !== null){
        allData["groupData"][name] = JSON.parse(response)
      }
    }


    for(i=0;i<this.state.friends.length;i++){
      element = this.state.friends[i]
      name = element.first_name + " " + element.last_name
      response = await SecureStore.getItemAsync(this.encryptName(name))
      if(response !== null){
        allData["userData"][name] = JSON.parse(response)
      }
    }

  }


  saveMessages(){
    groupData = this.state.allData["groupData"]
    userData = this.state.allData["userData"]
    Object.keys(groupData).forEach(item => {
      SecureStore.setItemAsync(this.encryptName(item),JSON.stringify(groupData[item])).then(()=>{
      })
    });

    Object.keys(userData).forEach(item => {
      SecureStore.setItemAsync(this.encryptName(item),JSON.stringify(userData[item])).then(()=>{
      })
    });

    SecureStore.setItemAsync("isChatSaved",JSON.stringify(true)).then(()=>{
    })

    this.retrieveMessages()
  }

*/
