import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

function ProfileTab({ form, setForm, imagePreview, setImagePreview }) {
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permissão necessária', 'Permita o acesso à galeria para selecionar uma imagem.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setImagePreview(pickerResult.assets[0].uri);
    }
  };

  const handleSaveProfile = () => {
    Alert.alert('Perfil atualizado!');
  };

  return (
    <ScrollView contentContainerStyle={styles.tabContainer}>
      <TouchableOpacity onPress={handleImageChange}>
        {imagePreview ? (
          <Image source={{ uri: imagePreview }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarPlaceholderText}>Foto</Text>
          </View>
        )}
      </TouchableOpacity>
      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={form.name}
        onChangeText={(text) => handleChange('name', text)}
      />
      <Text style={styles.label}>Cargo</Text>
      <TextInput
        style={styles.input}
        value={form.role}
        onChangeText={(text) => handleChange('role', text)}
      />
      <Text style={styles.label}>Nascimento</Text>
      <TextInput
        style={styles.input}
        value={form.birthdate}
        onChangeText={(text) => handleChange('birthdate', text)}
        placeholder="YYYY-MM-DD"
      />
      <Text style={styles.label}>E-mail Atual</Text>
      <TextInput style={styles.input} value={form.email} editable={false} />
      <Text style={styles.label}>Biografia</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={form.bio}
        onChangeText={(text) => handleChange('bio', text)}
        multiline
      />
      <Button title="Salvar Alterações" onPress={handleSaveProfile} />
    </ScrollView>
  );
}

function SecurityTab({ form, setForm }) {
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateSecurity = () => {
    Alert.alert('Dados de segurança atualizados!');
  };

  return (
    <ScrollView contentContainerStyle={styles.tabContainer}>
      <Text style={styles.label}>Novo E-mail</Text>
      <TextInput
        style={styles.input}
        value={form.newEmail}
        onChangeText={(text) => handleChange('newEmail', text)}
      />
      <Text style={styles.label}>Confirmar Novo E-mail</Text>
      <TextInput
        style={styles.input}
        value={form.confirmEmail}
        onChangeText={(text) => handleChange('confirmEmail', text)}
      />
      <Text style={styles.label}>Senha Atual</Text>
      <TextInput
        style={styles.input}
        value={form.currentPassword}
        onChangeText={(text) => handleChange('currentPassword', text)}
        secureTextEntry
      />
      <Text style={styles.label}>Nova Senha</Text>
      <TextInput
        style={styles.input}
        value={form.newPassword}
        onChangeText={(text) => handleChange('newPassword', text)}
        secureTextEntry
      />
      <Text style={styles.label}>Confirmar Nova Senha</Text>
      <TextInput
        style={styles.input}
        value={form.confirmPassword}
        onChangeText={(text) => handleChange('confirmPassword', text)}
        secureTextEntry
      />
      <Button title="Atualizar Segurança" onPress={handleUpdateSecurity} />
    </ScrollView>
  );
}

export default function ProfileScreenTabs() {
  const [form, setForm] = useState({
    name: '',
    bio: '',
    role: '',
    birthdate: '',
    email: 'jefferson@email.com',
    newEmail: '',
    confirmEmail: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    // Simular carregamento dos dados do perfil
  }, []);

  return (
    <Tab.Navigator>
      <Tab.Screen name="Perfil">
        {() => (
          <ProfileTab
            form={form}
            setForm={setForm}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Segurança">
        {() => <SecurityTab form={form} setForm={setForm} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    padding: 20,
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignSelf: 'center',
    marginBottom: 20,
  },
  avatarPlaceholder: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    color: '#666',
  },
  label: {
    marginBottom: 4,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 12,
    borderRadius: 4,
  },
});
