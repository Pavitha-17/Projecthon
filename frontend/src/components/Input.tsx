import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";

type InputProps = TextInputProps & {
  icon?: React.ReactNode;
  label: string;
  password?: boolean;
};

const CustomInput = ({ icon, label, password, ...rest }: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputContainer,
          { borderColor: isFocused ? "#A855F7" : "#ccc" },
        ]}
      >
        {icon && <View style={styles.icon}>{icon}</View>}
        <TextInput
          style={styles.input}
          secureTextEntry={password}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={'#616468ff'}
          {...rest}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "85%",
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: "#374151",
    fontWeight:400
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#F9FAFB",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#111827",
  },
});

export default CustomInput;
