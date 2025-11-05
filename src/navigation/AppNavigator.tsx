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

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: true,
      tabBarActiveTintColor: '#00BFFF',
      tabBarInactiveTintColor: '#001F3F',
    }}
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
      name="Jobs"
      component={JobTrackerScreen}
      options={{
        tabBarLabel: 'Jobs',
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}