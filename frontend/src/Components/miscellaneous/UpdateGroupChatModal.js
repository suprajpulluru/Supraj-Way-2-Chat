import { ViewIcon } from "@chakra-ui/icons";
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, IconButton, useToast, Box, FormControl, Input, Spinner } from "@chakra-ui/react";
import { ChatState } from "../../Context/chatProvider";
import { useState } from "react";
import axios from "axios";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";

export default function UpdateGroupChatModal({fetchAgain, setFetchAgain, fetchMessages}) {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const {user, selectedChat, setSelectedChat} = ChatState();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const toast = useToast();

  const handleAddUser = async function(userToAdd) {
    if(selectedChat.users.find((u) => u._id === userToAdd._id)){
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if(selectedChat.groupAdmin._id !== user._id){
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try{
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const {data} = await axios.put('/api/chat/groupadd', {
        chatId: selectedChat._id,
        userId: userToAdd._id,
      },config);

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    }catch(error){
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  }

  const handleRemove = async function(userToRemove) {
    if(selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user._id){
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try{
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.put('/api/chat/groupremove', {
        chatId: selectedChat._id,
        userId: userToRemove._id,
      }, config);

      if(response && response.data)userToRemove._id === user._id ? setSelectedChat("") : setSelectedChat(response.data);
      else console.error("Response data is undefined or null");

      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    }catch(error){
      toast({
        title: "Error Occured!",
        description: error.response?.data?.message || "Unknown error",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  }

  const handleRename = async function() {
    if(!groupChatName){
      return;
    }
    try{
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const {data} = await axios.put('/api/chat/rename',{
        chatId: selectedChat._id,
        chatName: groupChatName,
      },config);

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    }catch(error){
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  }

  const handleSearch = async function(query) {
      setSearch(query);
      if(!query){
          setSearchResults([]);
          return;
      }
      try{
          setLoading(true);
          const config = {
              headers: {
                  Authorization: `Bearer ${user.token}`,
              },
          };

          const {data} =await axios.get(`/api/user?search=${query}`,config);
          setLoading(false);
          setSearchResults(data);
      }catch(error){
          toast({
              title: "Error Occured!",
              description: "Failed to Load the Search Results",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom-left",
          });
      }
  }
  
  return (
    <>
      <IconButton onClick={onOpen} display={{base: "flex"}} icon={<ViewIcon/>}/>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          
          <ModalCloseButton />
          
          <ModalBody>
            <Box display="flex" w="100%" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction = {() => handleRemove(u)}
                  />
                ))}
            </Box>

            <FormControl display="flex">
                <Input
                  placeholder="Chat Name"
                  mb={3}
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
                <Button
                  variant="solid"
                  colorScheme="teal"
                  ml={1}
                  isLoading={renameLoading}
                  onClick={handleRename}
                >
                  Update
                </Button>
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Spinner size="lg"/>
            ) : (
              searchResults?.map((u) => (
                <UserListItem
                  key={u._id}
                  user={u}
                  handleFunction = {() => handleAddUser(u)}
                />
              ))
            )}

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>

        </ModalContent>
      </Modal>
    </>
  );
};