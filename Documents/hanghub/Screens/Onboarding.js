import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
//import { setItem } from '../utils/asyncStorage';

const {width, height} = Dimensions.get('window');

export default function OnboardingScreen() {
    const navigation = useNavigation();

    const handleDone = ()=>{
        navigation.navigate('Login');
        //setItem('onboarded', '1');
    }

    const doneButton = ({...props})=>{
        return (
            <TouchableOpacity style={styles.doneButton} {...props}>
                <Text>Done</Text>
            </TouchableOpacity>
        )
        
    }
  return (
    <View style={styles.container}>
      <Onboarding
            onDone={handleDone}
            onSkip={handleDone}
             bottomBarHighlight={false}
            DoneButtonComponent={doneButton}
            containerStyles={{paddingHorizontal: 15}}
            pages={[
              {
                backgroundColor: '#a7f3d0',
                image: 
                  
                    <LottieView
                      source={require('../assets/animations/Animation 3 - 1705815274705.json')} 
                      style= {styles.lottie}
                      autoPlay
                      loop
                    />,
                  
                
                title:
                  'Welcome to HangHub , your go-to app for finding free classrooms or spaces in your college to relax or work between classes.',
                //subtitle: 'Developed by: Nexify',
              },
              {
                backgroundColor: '#fef3c7',
                image: 
                  
                    <LottieView
                      source={require('../assets/animations/Animation 2 - 1705815557464.json')} 
                      style= {styles.lottie}
                      autoPlay
                      loop
                    />
                  
                ,
                title: 'Step into Hang Hub – Your Passport to Seamless Bunking.',
               // subtitle: 'Developed by: Nexify',
              },
              {
                backgroundColor: '#a78bfa',
                image: 
                  
                    <LottieView
                      source={require('../assets/animations/Animation 1 - 1705815835575.json')} 
                      style= {styles.lottie}
                      autoPlay
                      loop
                    />
                  
                ,
                title: 'Sign Up To Proceed Further',
                //subtitle: 'Developed by: Nexify',
              },
            ]}
        />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    lottie:{
        width: width*0.9,
        height: width
    },
    doneButton: {
      padding:15,
      backgroundColor:'white',
      borderRadius:40,
    }
})