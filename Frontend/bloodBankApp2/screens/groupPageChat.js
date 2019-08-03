import React, { Component } from "react";
import { ip } from "./host.js";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  AppRegistry,
  ScrollView,
  ListItem,
  FlatList,
  ImageBackground,
  TextInput,
  Button,
  RefreshControl,
  Platform,
  Dimensions
} from "react-native";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import { GiftedChat } from "react-native-gifted-chat";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { Makiko,Sae } from "react-native-textinput-effects";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

export default class GroupPageChat extends Component {
  state = {
    messages: []
  };

  renderQuickReply = props => {
    console.log(props);
    let text = "";
    return (
      <View>
        
        <Sae
          label={'Enter your Response...'}
          iconClass={FontAwesomeIcon}
          iconName={'pencil'}
          iconColor={'gray'}
          inputPadding={16}
          labelHeight={24}
          // active border height
          borderHeight={2}
          // TextInput props
          inputStyle={{
            color: "#000",
          }}
          autoCapitalize={'none'}
          autoCorrect={false}
          style={{ width: 305, borderRadius: 5, }}
          onChangeText={t => (text = t)}
        />
        <Button
          title="Send Response"
          style={{ color: "#00f", marginBottom: 10 }}
          onPress={() => {
            alert("Response Sent");
          }}
        />
      </View>
    );
  };

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any"
          }
        },
        {
          _id: 2,
          text: "Hello World",
          createdAt: new Date(),
          image:
            "https://image.shutterstock.com/z/stock-photo-mountains-during-sunset-beautiful-natural-landscape-in-the-summer-time-407021107.jpg",

          user: {
            _id: 1
          }
        },
        {
          _id: 3,
          text:
            "This is a quick reply. Do you love Gifted Chat? (radio) KEEP IT",
          createdAt: new Date(),
          quickReplies: {
            type: "radio", // or 'checkbox',
            keepIt: true,
            values: [
              {
                title: "Yes",
                value: "yes"
              }
            ]
          },
          user: {
            _id: 2,
            name: "React Native"
          }
        }
      ]
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1
          }}
          renderQuickReplies={this.renderQuickReply}
        />
        {Platform.OS === "android" ? <KeyboardSpacer topSpacing={35} /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({});

AppRegistry.registerComponent("bloodBankApp2", () => GroupPage);

/*
renderInputToolbar={()=>{
            return (
              <Text>Please Contact the admin in case you have to send a message on this</Text>
            );
          }}


           <TextInput
          style={{
            marginLeft: 2,
            marginVertical: 5,
            borderColor: "rgba(0,0,0,0.8)",
            borderBottomWidth: 1,
            width: 305,
            paddingLeft: 10,
            borderLeftWidth: 0.5,
            borderRightWidth: 0.5,
            borderTopWidth:0.3,
            borderRadius: 5,
            paddingVertical: 10
          }}
          placeholder="Enter your Response ..."
          autoCapitalize="none"
          onChangeText={t => (text = t)}
        />

        <Makiko
          label={"Enter Your Response..."}
          iconClass={FontAwesomeIcon}
          iconName={"comment"}
          iconColor={"white"}
          inputPadding={16}
          inputStyle={{
            color: "#db786d",
            borderColor: "rgba(0,0,0,0.6)",
            borderLeftWidth: 0.5,
            borderRightWidth: 0.5,
            borderBottomWidth: 0.8,
            borderRadius: 5
          }}
          style={{ width: 305, borderRadius: 5, marginVertical: 10, }}
          onChangeText={t => (text = t)}
        />

*/
