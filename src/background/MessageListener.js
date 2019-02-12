import firebase from 'react-native-firebase';

export default async (message) => {
    firebase.notifications().setBadge(45);

    console.log('burada');
    const text = 'asd';
    const payload = 'payload';
    const localNotification = new firebase.notifications.Notification({
      show_in_foreground: true
    });

    localNotification.setNotificationId('ecd');
    localNotification.setTitle('New message');
    localNotification.setSubtitle('Unread message: 1');
    localNotification.setBody('text');
    localNotification.setSound('star.wav');
    localNotification.setData({ action : 'Test' });
      
    localNotification.android.setChannelId('channel-new');
    localNotification.android.setPriority(firebase.notifications.Android.Priority.High);

    /*const action = new firebase.notifications.Android.Action('Reply', 'ic_launcher', 'My Test Action');
    localNotification.android.addAction(action);*/

    return firebase.notifications().displayNotification(localNotification);
}