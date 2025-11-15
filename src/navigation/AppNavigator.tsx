// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Dashboard from '../screens/Dashboard';
import ResumeScreen from '../screens/ResumeScreen';
import InterviewScreen from '../screens/InterviewScreen';
import JobTrackerScreen from '../screens/JobTrackerScreen';
import SkillGapScreen from '../screens/SkillGapScreen';
import LinkedInScreen from '../screens/LinkedInScreen';
import SalaryScreen from '../screens/SalaryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ResumeResult from '../screens/ResumeResult';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={() => ({
      headerShown: true,
      headerStyle: {
        backgroundColor: '#0F1724', // A dark blue, matching other components
        elevation: 0, // Remove shadow on Android
        shadowOpacity: 0, // Remove shadow on iOS
        borderBottomWidth: 0,
      },
      headerTintColor: '#E6EEF8', // Light color for title and icons
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      tabBarActiveTintColor: '#3b82f6',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen
      name="Dashboard"
      component={Dashboard}
    
      options={{
        tabBarLabel: 'Home',
      }}
    />
    <Tab.Screen
      name="Resume"
      component={ResumeScreen}
      options={{
        tabBarLabel: 'Resume',
      }}
    />
    <Tab.Screen
      name="Interview"
      component={InterviewScreen}
      options={{
        tabBarLabel: 'Interview',
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarLabel: 'Profile',
      }}
    />
  </Tab.Navigator>
);

export default function AppNavigator() {
  return (
    <NavigationContainer
      linking={{
        prefixes: ['vrittera://'],
        config: {
          screens: {
            SkillGap: 'skill-gap',
            LinkedIn: 'linkedin',
            Salary: 'salary',
          },
        },
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="SkillGap" component={SkillGapScreen} />
        <Stack.Screen name="LinkedIn" component={LinkedInScreen} />
        <Stack.Screen name="Salary" component={SalaryScreen} />
        <Stack.Screen name="JobTracker" component={JobTrackerScreen} />
        <Stack.Screen name="ResumeResult" component={ResumeResult} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}