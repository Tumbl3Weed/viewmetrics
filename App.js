



  // const handleUpload = async () => {
  //   const formData = new FormData();
  //   formData.append('video', {
  //     uri: videoUri,
  //     type: 'video/mp4',
  //     name: 'video.mp4',
  //   });
  
  //   const uploadProgressListener = (progressEvent) => {
  //     const progress =
  //       progressEvent.loaded / progressEvent.total;
  //     setUploadProgress(progress);
  //   };
  
  //   try {
  //     const response = await FileSystem.uploadAsync(
  //       'https://example.com/upload',
  //       formData,
  //       {
  //         httpMethod: 'POST',
  //         headers: {
  //           Accept: 'application/json',
  //           'Content-Type': 'multipart/form-data',
  //         },
  //         uploadType: FileSystem.FileSystemUploadType.MULTIPART,
  //         onUploadProgress: uploadProgressListener,
  //       }
  //     );
  
  //     console.log('Upload success:', response);
  //   } catch (error) {
  //     console.log('Upload failed:', error);
  //   }
  // };

  // return (
  //   <View style={{ flex: 1 }}>
  //     <Camera style={{ flex: 1 }} type={cameraType} ref={cameraRef}>
  //       <TouchableOpacity
  //         style={{
  //           alignSelf: 'flex-end',
  //           alignItems: 'center',
  //           backgroundColor: 'transparent',
  //           marginBottom: 20,
  //         }}
  //         onPress={() => {
  //           setCameraType(
  //             cameraType === Camera.Constants.Type.back
  //               ? Camera.Constants.Type.front
  //               : Camera.Constants.Type.back
  //           );
  //         }}>
  //         <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
  //       </TouchableOpacity>
  //     </Camera>
  //     <TouchableOpacity
  //       style={{
  //         alignSelf: 'center',
  //         alignItems: 'center',
  //         backgroundColor: 'white',
  //         padding: 10,
  //         borderRadius: 5,
  //         marginBottom: 20,
  //       }}
  //       onPress={handleRecordButton}>
  //       <Text>{recording ? 'Stop' : 'Record'}</Text>
  //     </TouchableOpacity>
  //     {videoUri && (
  //       <TouchableOpacity
  //         style={{
  //           alignSelf: 'center',
  //           alignItems: 'center',
  //           backgroundColor: 'white',
  //           padding: 10,
  //           borderRadius: 5,
  //           marginBottom: 20,
  //         }}
  //         onPress={async () => {
  //           const formData = new FormData();
  //           formData.append('video', {
  //             uri: videoUri,
  //             type: 'video/mp4',
  //             name: 'video.mp4',
  //           });
  
  //           try {
  //             const response = await FileSystem.uploadAsync(
  //               'https://example.com/upload',
  //               formData,
  //               {
  //                 httpMethod: 'POST',
  //                 headers: {
  //                   Accept: 'application/json',
  //                   'Content-Type': 'multipart/form-data',
  //                 },
  //                 uploadType: FileSystem.FileSystemUploadType.MULTIPART,
  //                 onUploadProgress: (progressEvent) => {
  //                   const progress = progressEvent.loaded / progressEvent.total;
  //                   setUploadProgress(progress);
  //                 },
  //               }
  //             );
  //             console.log('Upload success:', response);
  //           } catch (error) {
  //             console.log('Upload failed:', error);
  //           }
  //         }}>
  //         <Text>Upload Video</Text>
  //       </TouchableOpacity>
  //     )}
  //     {uploadProgress > 0 && <ProgressBar progress={uploadProgress} />}
  //   </View>
  // );
  import * as React from 'react';
  import {NavigationContainer} from '@react-navigation/native';
  import {createNativeStackNavigator} from '@react-navigation/native-stack';
  
  
import CharacterList from "./CharacterList";
import * as notfis from "expo-notifications";
import * as FileSystem from 'expo-file-system';
import { CameraPermission } from 'expo-camera/build/Camera.types';
// import React, { useState, useRef, useEffect } from "react";
import axios from 'axios';

import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView, Button, StatusBar,ProgressBarAndroid,
} from "react-native";
import { Camera } from "expo-camera";
import { Video } from 'expo-av';


const Stack = createNativeStackNavigator();

const WINDOW_HEIGHT = Dimensions.get("window").height;
const closeButtonSize = Math.floor(WINDOW_HEIGHT * 0.032);
const captureSize = Math.floor(WINDOW_HEIGHT * 0.09);
export default function App() {
  const [hasPermission, setHasPermission] =  React.useState(null);
  const [cameraType, setCameraType] =  React.useState(Camera.Constants.Type.back);
  const [isPreview, setIsPreview] =  React.useState(false);
  const [isCameraReady, setIsCameraReady] =  React.useState(false);
  const [isVideoRecording, setIsVideoRecording] =  React.useState(false);
  const [videoSource, setVideoSource] =  React.useState(null);
  const cameraRef =  React.useRef();
  const [expoPushToken, setExpoPushToken] = React.useState('');
  const [notification, setNotification] = React.useState(false);
  const notificationListener = React.useRef();
  const responseListener = React.useRef();
  const [type, setType] = React.useState(Camera.Constants.Type.back);
  
  
  const [isRecording, setIsRecording] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  
  const handleRecordVideo = async () => {
    if (isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
      return;
    }

    try {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');

      if (hasPermission === null) {
        return null;
      }

      if (hasPermission === false) {
        return <Text>No access to camera</Text>;
      }

      setIsRecording(true);
      const recording = await cameraRef.current.recordAsync({ quality: '720p' });
      const data = new FormData();
      data.append('video', {
        uri: recording.uri,
        type: 'video/mp4',
        name: 'video.mp4',
      });
      const response = await axios.post('https://mvai.qa.onroadvantage.com/api/analyse', data, {
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setUploadProgress(progress);
        },
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {

    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = notfis.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = notfis.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();      
   
    return () => {
      notfis.removeNotificationSubscription(notificationListener.current);
      notfis.removeNotificationSubscription(responseListener.current);

    };

  }, []);

  notfis.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  
  async function sendPushNotification(expoPushToken) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'ViewMetricsNotification Title',
      body: 'ViewMetricsNotification body.',
      data: { someData: 'goes here. Check notification bar' },
    };
  
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }
  
  async function registerForPushNotificationsAsync() {
    let token;
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      const { status: existingStatus } = await notfis.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await notfis.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await notfis.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      notfis.setNotificationChannelAsync('default', {
        name: 'default',
        importance: notfis.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }

  const onCameraReady = () => {
    setIsCameraReady(true);
  };
  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true, skipProcessing: true };
      const data = await cameraRef.current.takePictureAsync(options);
      const source = data.uri;
      if (source) {
        await cameraRef.current.pausePreview();
        setIsPreview(true);
        console.log("picture source", source);
      }
    }
  };
  const recordVideo = async () => {
    if (cameraRef.current) {
      try {
        const videoRecordPromise = cameraRef.current.recordAsync();
        if (videoRecordPromise) {
          setIsVideoRecording(true);
          const data = await videoRecordPromise;
          const source = data.uri;
          if (source) {
            setIsPreview(true);
            console.log("video source", source);
            setVideoSource(source);
          }
        }
      } catch (error) {
        console.warn(error);
      }
    }
  };
  const stopVideoRecording = () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
      setIsPreview(false);
      setIsVideoRecording(false);      
    }
  };
  const switchCamera = () => {
    if (isPreview) {
      return;
    }
    setCameraType((prevCameraType) =>
      prevCameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };
  const cancelPreview = async () => {
    await cameraRef.current.resumePreview();
    setIsPreview(false);
    setVideoSource(null);
  };
  const renderCancelPreviewButton = () => (
    <TouchableOpacity onPress={cancelPreview} style={styles.closeButton}>
      <View style={[styles.closeCross, { transform: [{ rotate: "45deg" }] }]} />
      <View
        style={[styles.closeCross, { transform: [{ rotate: "-45deg" }] }]}
      />
    </TouchableOpacity>
  );
  const renderVideoPlayer = () => (
    <Video
      source={{ uri: videoSource }}
      shouldPlay={true}
      style={styles.media}
    />
  );
  const renderVideoRecordIndicator = () => (
    <View style={styles.recordIndicatorContainer}>
      <View style={styles.recordDot} />
      <Text style={styles.recordTitle}>{"Recording..."}</Text>
    </View>
  );
  const renderCaptureControl = () => (
    <View style={styles.control}>
      <TouchableOpacity disabled={!isCameraReady} onPress={switchCamera}>
        <Text style={styles.text}>{"Flip"}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={!isCameraReady}
        onLongPress={recordVideo}
        onPressOut={stopVideoRecording}
        // onPress={recordVideo}
        style={styles.capture}
      />
    </View>
  );
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text style={styles.text}>No access to camera</Text>;
  }

  function CameraScreen  ({navigation, route})  {
    return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={type} ref={cameraRef}>
        <View style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ flex: 0.1, alignSelf: 'flex-end', alignItems: 'center' }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
          </TouchableOpacity>
        </View>
      </Camera>
      {isRecording ? (
        <TouchableOpacity onPress={handleRecordVideo}>
          <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>Stop Recording</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handleRecordVideo}>
          <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>Record Video</Text>
        </TouchableOpacity>
      )}
      <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} progress={uploadProgress / 100} />
    </View>
  );
};

  function RickAndMortyAndNotifications ({navigation})  {
    return (
      <SafeAreaView>
        <Text>Your expo push token: {expoPushToken}</Text>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
        </View>
        <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Push Notification Example</Text>
      </View>
      <Button
        title="Go To CameraScreen"
        onPress={() =>
          navigation.navigate('CameraScreen', {name: 'CameraScreen'})
        }
        />
      <StatusBar barStyle="dark-content" />
      
        <CharacterList />        
                    
      </SafeAreaView>
      
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="RickAndMortyAndNotifications"
          component={RickAndMortyAndNotifications}          
        />
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
      </Stack.Navigator>
    </NavigationContainer>    
  );
}
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  closeButton: {
    position: "absolute",
    top: 35,
    left: 15,
    height: closeButtonSize,
    width: closeButtonSize,
    borderRadius: Math.floor(closeButtonSize / 2),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#c4c5c4",
    opacity: 0.7,
    zIndex: 2,
  },
  media: {
    ...StyleSheet.absoluteFillObject,
  },
  closeCross: {
    width: "68%",
    height: 1,
    backgroundColor: "black",
  },
  control: {
    position: "absolute",
    flexDirection: "row",
    bottom: 38,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  capture: {
    backgroundColor: "#f5f6f5",
    borderRadius: 5,
    height: captureSize,
    width: captureSize,
    borderRadius: Math.floor(captureSize / 2),
    marginHorizontal: 31,
  },
  recordIndicatorContainer: {
    flexDirection: "row",
    position: "absolute",
    top: 25,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    opacity: 0.7,
  },
  recordTitle: {
    fontSize: 14,
    color: "#ffffff",
    textAlign: "center",
  },
  recordDot: {
    borderRadius: 3,
    height: 6,
    width: 6,
    backgroundColor: "#ff0000",
    marginHorizontal: 5,
  },
  text: {
    color: "#fff",
  },
});