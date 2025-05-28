import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, Text } from "react-native";
import { Socket } from "socket.io-client";
import { connectSocket } from "../../src/socket";

interface ConnectedUser {
    socketId: string;
    user: string;
};

export default () => {
    const { user } = useLocalSearchParams<{ user: string }>();
    const [socket, setSocket] = useState<Socket>();
    const [users, setUsers] = useState<string[]>([]);

    useEffect(() => {
        connectSocket(user).then(socket => {
            setSocket(socket);
        });
    }, []);

    useEffect(() => {
        if (!socket) return;
        socket.on('users:update', (data) => {
            setUsers(data.users);
        });
        return () => {
            socket.off('users:update');
        };
    }, [socket]);

    return (
        <SafeAreaView>
            <FlatList
                data={users}
                keyExtractor={(_e, i) => i.toString()}
                renderItem={({ item }) => <Text>{item}</Text>}
            />
        </SafeAreaView>
    );
};
