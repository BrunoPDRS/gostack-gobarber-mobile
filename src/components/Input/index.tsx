import React from 'react';
import {Text, TextInputProps} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Container, TextInput, Icon } from './styles';

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
}

const Input: React.FC<InputProps> = ({name, icon, ...rest}) => (
  <Container>
    <Icon name={icon} size={20} color="#666360" />

    <TextInput
      keyboardAppearance="dark"
      placeholderTextColor="#0a0805"
      {...rest}
    />

    <TouchableOpacity><Text>Esqueci minha Senha</Text></TouchableOpacity>
  </Container>
);

export default Input;
