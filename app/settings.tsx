import AsyncStorage from "@react-native-async-storage/async-storage";
import {useRouter} from "expo-router";
import{useEffect, useState} from "react"
import { Button, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default()=> {
    const router = useRouter();
    const [serverAddress, setServerAddres] = useState('http://localhost:3000');
    useEffect(() => {
        (async()=> {
            const localServerAddrress = await AsyncStorage.getItem("serverAddress")
            if (localServerAddrress){
                setServerAddres(localServerAddrress);
            }
    })();
        },
        
    []);
    const handleSave = async () => {
        try{
            await AsyncStorage.setItem("serverAddress", serverAddress);
            router.back();
        }catch (err){
            console.error(err)
        }
        
    };
    return(
        <SafeAreaView>
            <Text>Servidor</Text>
            <TextInput
            value={serverAddress}
            onChangeText={setServerAddres}
            placeholder="Direccion del servidor"/>
            <Button title="Guardar" onPress={handleSave}/>

        </SafeAreaView>
    )
}