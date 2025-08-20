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
  label: string;
  password?: boolean;
};

const CustomInput = ({ icon, label, password, ...rest }: InputProps) => {
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
          { borderColor: isFocused ? '#A855F7' : '#ccc' },
        ]}
      >
        {icon && <View style={styles.icon}>{icon}</View>}
        <TextInput
          style={styles.input}
          secureTextEntry={password && !visibility}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={'#616468ff'}
          {...rest}
        />
        {password && visibility && (
          <Pressable
            onPressIn={() => setTouched(true)}
            onPressOut={() => setTouched(false)}
            onPress={toggleVisibility}
          >
            <Eye size={20} color={touched ? '#535863ff' : '#6B7280'} />
          </Pressable>
        )}
        {password && !visibility && (
          <Pressable
            onPressIn={() => setTouched(true)}
            onPressOut={() => setTouched(false)}
            onPress={toggleVisibility}
          >
            <EyeOff size={20} color={touched ? '#535863ff' : '#6B7280'} />
          </Pressable>
        )}
      </View>
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
});

export default CustomInput;
