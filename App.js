/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, Alert} from 'react-native';
import firebase from 'react-native-firebase';


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {

  async componentDidMount() {
    console.log('componentDidMount');
    this.checkPermission();
    this.createNotificationListeners(); 

    const channel = new firebase.notifications.Android.Channel('channel-new','Yeni Hizmet', firebase.notifications.Android.Importance.Max)
      .setDescription('Kurumun yeni geliştirdiği hizmetlerden sizi bilgilendirir.')
      .setSound('star.wav');
    firebase.notifications().android.createChannel(channel);
    

    const channel2 = new firebase.notifications.Android.Channel('channel-emergency','Acil Durum', firebase.notifications.Android.Importance.Max)
      .setDescription('Acil durumlarda sizi bilgilendirir.')
      .setSound('siren.mp3');
    firebase.notifications().android.createChannel(channel2);

    firebase.notifications().setBadge(0);
  }
  
  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
    this.messageListener();
  }

  async createNotificationListeners() {

    this.messageListener = firebase.messaging().onMessage((notification) => {
      console.log('burada');
      console.log(notification);

      const { title, body } = notification.data;
        //this.showAlert(title, body);

        const localNotification = new firebase.notifications.Notification({
          show_in_foreground: true
        });

        localNotification.setNotificationId(notification.messageId);
        localNotification.setTitle(title);
        localNotification.setBody(body);
        //localNotification.setSound('star.wav');

        console.log(notification);

        if (Platform.OS === 'android')
        {
          if (notification.data.channelId !== null)
          {
            localNotification.android.setChannelId(notification.data.channelId);
          }
          else 
          {
            localNotification.android.setChannelId('channel-new');
          }
          //localNotification.android.setChannelId('channel-new');
        }

        localNotification.android.setChannelId('channel-new');
        
        firebase.notifications().setBadge(5);

        const date = new Date();
        date.setSeconds(date.getSeconds() + 15);
        console.log(date);

        const action2 = new firebase.notifications.Android.Action('Cevapla', 'ic_launcher', 'Test Action');
        localNotification.android.addAction(action2);

        
        const action = new firebase.notifications.Android.Action('Cevapla2', 'ic_launcher', 'Test Action2');
        localNotification.android.addAction(action);

        //firebase.notifications().displayNotification(localNotification);

        console.log('scheduled' + date);

        firebase.notifications().scheduleNotification(localNotification, {
          fireDate: date.getTime()
        });
    });

    //Uygulama açıkken notification geldi
    this.notificationListener = firebase.notifications().onNotification((notification) => {
        
        const { title, body } = notification;
        //this.showAlert(title, body);

        const localNotification = new firebase.notifications.Notification({
          show_in_foreground: true
        });

        localNotification.setNotificationId(notification.notificationId);
        localNotification.setTitle(title);
        localNotification.setBody(body);
        //localNotification.setSound('star.wav');

        console.log(notification);

        if (Platform.OS === 'android')
        {
          if (notification.data.channelId !== null)
          {
            localNotification.android.setChannelId(notification.data.channelId);
          }
          else 
          {
            localNotification.android.setChannelId('channel-new');
          }
          //localNotification.android.setChannelId('channel-new');
        }

        localNotification.android.setChannelId('channel-new');
        
        firebase.notifications().setBadge(5);

        

        /*const action2 = new firebase.notifications.Android.Action('id-evet', 'ic_launcher', 'Kabul Ediyorum');
        localNotification.android.addAction(action2);

        
        const action = new firebase.notifications.Android.Action('id-hayir', 'ic_launcher', 'Onaylamıyorum');
        localNotification.android.addAction(action);*/

        const action3 = new firebase.notifications.Android.Action('id-cevapla', 'ic_launcher', 'Cevapla');
        const remoteInput = new firebase.notifications.Android.RemoteInput('inputText').setLabel('Message');
        action3.addRemoteInput(remoteInput);
        localNotification.android.addAction(action3);
        console.log('display');

        firebase.notifications().displayNotification(localNotification);


        /*const date = new Date();
        date.setSeconds(date.getSeconds() + 15);
        console.log(date);

        console.log('scheduled' + date);

        firebase.notifications().scheduleNotification(localNotification, {
          fireDate: date.getTime()
        });*/

        

        //Tamamını Remove Etme
        //firebase.notifications().removeAllDeliveredNotifications();

        //Zamanlanmış Notificationları Alma
        //firebase.notifications().getScheduledNotifications();

        //Seçili Olanı Remove Etmek
        //firebase.notifications().removeDeliveredNotification('notification-id');
        
    });
  
    //Uygulama arka planda iken notification açıldı.
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
        const { title, body } = notificationOpen.notification.data;
        console.log("Action - " + notificationOpen.action);
        console.log(notificationOpen.notification);
        this.showAlert(title, body);
    });
  
    //Uygulama kapalı iken gelen tıklayınca açılan notification
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
        console.log(notificationOpen);
        console.log("Action - " + notificationOpen.action);
        const { title, body } = notificationOpen.notification.data;
        console.log(notificationOpen.notification);
        console.log(notificationOpen.notification.android.actions);
        this.showAlert(title, body);
    }
    this.messageListener = firebase.messaging().onMessage((message) => {
      console.log(JSON.stringify(message));
    });
  }
  
  showAlert(title, body) {
    Alert.alert(
      title, body,
      [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }
  
    //1
  async checkPermission() {
    console.log('checkPermission');
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      console.log('enabled');
        this.getToken();
    } else {
      console.log('not enabled');
        this.requestPermission();
    }
  }
  
    //3
  async getToken() {
    console.log('getToken');
    let value = '';
    let fcmToken = await AsyncStorage.getItem('fcmToken', value);
    console.log(fcmToken);
    if (fcmToken=== null || fcmToken === '') {
        fcmToken = await firebase.messaging().getToken();
        console.log('messaging - getToken');
        if (fcmToken) {
            // user has a device token
            await AsyncStorage.setItem('fcmToken', fcmToken);
        }
    }
    console.log(fcmToken);
  }
  
    //2
  async requestPermission() {
    console.log('requestPermission');
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        this.getToken();
    } catch (error) {
        // User has rejected permissions
        console.log('permission rejected');
    }
  }


  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
