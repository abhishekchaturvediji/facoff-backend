import FCM from "fcm-node";
var fcm = new FCM( process.env.FIREBASE_SERVER_KEY)
import type { Notification } from "./../types/request/notification";


export default class AppFunctions{
    
    pushNotification = async(notification : Notification, firebaseToken : string) => {
        console.log("notification : ", notification , firebaseToken);
        const message = {
            to: firebaseToken,
            notification: { 
                title: notification.title,
                body : notification.message,
                click_action: "default",
            },
            data: {
                profile_id: notification.user_id,
                notification_type: notification.notification_type
            },
            priority: 1
        };
    
        if (message) {
            fcm.send(message, function(err, response) {
                if (err) {
                    console.log("Something has gone wrong!", err);
                    return { status: false, response }
                } else {
                    console.log("Successfully sent with response: ", response);
                    return { status: true, response }
                }
            });
        }
    }
}

