import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import SideBar from "../components/SideBar";

export default function Home() {
  return (
      <View style={styles.content}>
        <View style = {styles.bar}>
        <SideBar/></View>
        <Text style={{ fontSize: 18 }}>This is the Home screen content</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor:'#fff',
    alignItems: "center",
    flexDirection:'row',
  },
  bar:{
    width:60,
  }
});
