import React, { useState, useEffect } from "react";
import { ActivityIndicator, Button, FlatList, StyleSheet, TextInput, Text, View, ViewStyle } from "react-native";
import { connectSocket } from "../../src/socket";
import { Socket } from "socket.io-client";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChatMessage } from "../../src/models/chatMessage";
import { useLocalSearchParams } from "expo-router";

//----------------> IMPORTANTE <----------------
//PROFE LE DEJO EL LINK DEL CHAT SERVER PORQUE SE ME OLVIDO DE PONERLO EN CLASSROOM
// https://github.com/Jesuscodes555/chatserver

type MessageBubbleProps = {
  chatMessage: ChatMessage,
  mySocketId?: string
}

const MessageBubble = ({ chatMessage, mySocketId }: MessageBubbleProps) => {
  let bubbleStyle = [style.chatBubble]
  let ownMessage = chatMessage.socketId == mySocketId;
  const date = new Date(chatMessage.time);
  const timeString = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  ownMessage
    ? bubbleStyle.push(style.myChatBubble)
    : bubbleStyle.push(style.othersChatBubble)

  return (
    <View>
      {!ownMessage && <Text>{chatMessage.user}</Text>}
      <Text style={bubbleStyle}>{chatMessage.message}</Text>
      <Text style={{ fontSize: 10, color: 'gray', alignSelf: ownMessage ? 'flex-end' : 'flex-start' }}>
        {timeString}
      </Text>
    </View>

  );
};

type lsp = {
  user: string;
};

export default function ChatScreen() {
  const { user } = useLocalSearchParams<lsp>();
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mySocketId, setMySocketId] = useState<string>();

  useEffect(() => {
    connectSocket(user)
      .then((socketInstance) => {
        setSocket(socketInstance);
        setIsLoading(false);

      })
      .catch((error) => console.error("Error connecting socket:", error));
    return () => {
      socket?.disconnect();
    };
  }, []);

  useEffect(() => {
    socket?.on("connect", () => {
      setMySocketId(socket?.id);
    });
    if (!socket) return;
    const handleMessage = (newMessage: ChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };
    socket.on("message", handleMessage);
    return () => {
      socket.off("message", handleMessage);
    };
  }, [socket]);

  const sendMessage = () => {
    if (message.trim()) {
      socket?.emit("message", message);
      setMessage("");
    }
  };


  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <MessageBubble chatMessage={item} mySocketId={mySocketId} />
        )}
      />

      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <TextInput
          placeholder="Escribe un mensaje"
          style={{
            flex: 1,
            borderColor: "gray",
            borderWidth: 1,
            paddingHorizontal: 10,
          }}
          onChangeText={setMessage}
          value={message}
        />
        <Button title="Enviar" onPress={sendMessage} />
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  chatBubble: {
    backgroundColor: "#006A71",
    color: "#ffffff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 7,
    marginBottom: 1
  } as ViewStyle,
  myChatBubble: {
    alignSelf: "flex-end",
    borderEndStartRadius: 0
  } as ViewStyle,
  othersChatBubble: {
    borderEndStartRadius: 0,
  } as ViewStyle
});