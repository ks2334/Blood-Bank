import React, { Component } from "react";
import { ip } from "./host.js";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight,
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
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default class GroupPageChat extends Component {
  
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            marginHorizontal: 10,
            alignItems: "center"
          }}
        >
          {navigation.getParam("type") === "group" ?(<Image
            style={styles.avatar}
            source={{
              uri: ip + navigation.getParam("obj").information.image
            }}
          />):(<Image
            style={styles.avatar}
            source={{
              uri: ip + navigation.getParam("obj").information.profilePic
            }}
          />)}

          {navigation.getParam("type") === "group" ?(
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
            {navigation.getParam("obj").information.title}
          </Text>):(
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
            {navigation.getParam("obj").information.first_name + " " + navigation.getParam("obj").information.last_name}
          </Text>)}
          
        </View>
      ),

      headerStyle: {
        backgroundColor: "#660000"
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
        color: "#fff"
      },
      headerRight: (
        <TouchableOpacity
          style={{ width: 40, paddingLeft: 10 }}
          onPress={() => {
            if(navigation.getParam("type") === "group"){
              navigation.navigate("GroupDescriptionPage", {
                obj: navigation.getParam("obj").information
              });
            }
            else{
              navigation.navigate("ProfileDescriptionPage", {
                obj: navigation.getParam("obj").information
              });
            }

            
          }}
        >
          <Icon name="arrow-right" size={20} color={"white"} />
        </TouchableOpacity>
      ),
      headerLeft: (
        <TouchableHighlight
				onPress={() => {
          navigation.state.params["resetChatOpened"]()
          navigation.pop()
        }}>
          <Icon name="arrow-left" size={20} color={"white"} style={{marginLeft:10}} />
			</TouchableHighlight>
      )
    };
  };

  constructor(props){
    super(props);
    this.state = {
      token: this.props.navigation.getParam("token"),
      data:this.props.navigation.state.params["obj"],
      type:this.props.navigation.state.params["type"]
    };

  }

  renderQuickReply = props => {
    let text = "";
    let id = props["currentMessage"]["quickReplies"]["id"]
    formData = new FormData();
    return (
      <View style={{marginBottom:13}}>
        
        <TextInput
          style={{
            marginLeft: 2,
            marginTop: 2,
            borderColor: "rgba(0,0,0,0.8)",
            borderBottomWidth: 1,
            width: 305,
            paddingLeft: 10,
            borderLeftWidth: 0.5,
            borderRightWidth: 0.5,
            borderTopWidth:0.3,
            borderRadius: 5,
            paddingVertical: 10,
            marginBottom:2
          }}
          placeholder="Enter your Response ..."
          autoCapitalize="none"
          onChangeText={t => (text = t)}
        />
        <Button
          title="Send Response"
          style={{ color: "#00f", marginBottom: 10 }}
          onPress={() => {
            formData.append("time", text);
            formData.append("id", id);
            fetch(ip + "/send-response/", {
              method: "post",
              headers: {
                "Content-Type": "multipart/form-data",
                Accept: "application/json",
                Authorization: "Token " + this.state.token
              },
              body: formData,

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
      </View>
    );
  };




  componentDidMount() {

    messages = this.state.data.messages.slice(0);
    messages.sort(function(a,b) {
        return b.createdAt - a.createdAt;
    });

    let cnt=1;
    messages.forEach(element => {
      element["_id"] = cnt
      if("image" in element){
        element["image"] = ip + element["image"]
      }
      cnt++;
    });

    this.setState({
      messages: messages
    });

  }
  
  flag = true

  componentDidUpdate(p){
    if(this.flag){
      messages = this.state.data.messages.slice(0);
      messages.sort(function(a,b) {
          return b.createdAt - a.createdAt;
      });

      let cnt=1;
      messages.forEach(element => {
        element["_id"] = cnt
        cnt++;
      });

      if(this.state.messages.length !== messages.length){
        this.setState({
          messages: messages
        });
      }
    }
    else{
      this.flag = true
    }
    
  }

 onSend(messages = []) {
    this.flag = false
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));

    if(this.state.type==="group"){
      
      this.props.navigation.state.params.addMessage("groupData",this.state.data.information.title,messages[0],send=true)
    }
    else if(this.state.type==="user"){
      this.props.navigation.state.params.addMessage("userData",this.state.data.information.first_name+" "+this.state.data.information.last_name,messages[0],send=true)
    }
    else if(this.state.type === "new"){
      if(this.state.messages.length===0){
        this.props.navigation.state.params.addChat(this.state.data.information) 
      }
      this.props.navigation.state.params.addMessage("userData",this.state.data.information.first_name+" "+this.state.data.information.last_name,messages[0],send=true)
    }
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
          renderInputToolbar={this.props.navigation.state.params.hasChatPrivilege || this.props.navigation.state.params.type!=="group" ?  undefined : () =>null}
          renderUsernameOnMessage={true}
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

*/


/*
[
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
          quickReplies: {},
          user: {
            _id: 2,
            name: "React Native"
          }
        }
      ]


*/