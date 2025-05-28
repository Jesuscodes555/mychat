import { Link, Stack } from "expo-router";
import { useState } from "react";
import { Button, Text, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default () => {
    const [username, setUsername] = useState('');
    return (
    <SafeAreaView style ={style.container}>
    <Stack.Screen options={{headerShown : false}}/>
    <Text>Bienvenido al chat</Text>
    <TextInput placeholder="Usuario" value={username} onChangeText={t => setUsername(t)}/>
    <Link href={{pathname: "/chat", params: { user: username}}} asChild>
    <Button title="Entrar"/></Link>
    <Link href= "/settings">Configuración</Link>
    </SafeAreaView>
    );
};
    const style = StyleSheet.create({
        container:{
            flex:1,
            justifyContent:"center",
            alignItems :"center",
            gap:8
        }
    });