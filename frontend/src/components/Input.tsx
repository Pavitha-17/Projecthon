import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  Pressable,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

type InputProps = TextInputProps & {
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label: string;
  password?: boolean;
  error?: string;
  onChangeText?: (text: string) => void;
};

const CustomInput = ({ icon, rightIcon, label, password, error, onChangeText, ...rest }: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [visibility, setVisibility] = useState(false);
  const [touched, setTouched] = useState(false);

  function toggleVisibility() {
    setVisibility(!visibility);
  }
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputContainer,
          { borderColor: error ? "#EF4444" : isFocused ? "#A855F7" : "#ccc" },
        ]}
      >
        {icon && <View style={styles.icon}>{icon}</View>}
        <TextInput
          style={styles.input}
          secureTextEntry={password && !visibility}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={'#616468ff'}
          onChangeText={onChangeText}
          {...rest}
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '85%',
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#374151',
    fontWeight: 400,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#F9FAFB',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 13,
    color: '#111827',
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

export default CustomInput;
