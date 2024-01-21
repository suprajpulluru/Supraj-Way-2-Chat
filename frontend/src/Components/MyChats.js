import { useEffect } from "react";
import { useToast,Box, Button, Stack, Text } from "@chakra-ui/react";
import { ChatState } from "../Context/chatProvider";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSenderFull } from "../config/ChatLogics.js";
import GroupChatModal from "./miscellaneous/GroupChatModal";

export default function MyChats({fetchAgain}) {
  const {selectedChat,setSelectedChat,user,chats,setChats} = ChatState();
  
  const toast = useToast();
  
  const fetchChats = async function() {
    try{
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const {data} = await axios.get('/api/chat',config);
      setChats(data);
    }catch(error){
      toast({
        title: "Error Occured",
        description: "failed to load the chats",
        status: "error",
      })
    }
  }

  useEffect(() => {
    fetchChats();
  },[fetchAgain]);

  return (
    <Box
      display={{base: selectedChat ? "none" : "flex", md: "flex"}}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{base:"100%", md:"31%"}}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{base:"28px", md:"30px"}}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button 
           display="flex" 
            fontSize={{base: "17px", md: "10px", lg: "17px"}} 
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY='scroll'>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat ? getSenderFull(user,chat.users).name : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (<ChatLoading/>)}
      </Box>
    </Box>
  );
};