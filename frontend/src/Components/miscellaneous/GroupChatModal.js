import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, useToast, FormControl, Input, Box } from "@chakra-ui/react";
import { ChatState } from "../../Context/chatProvider";
import axios from "axios";
import UserListItem from '../UserAvatar/UserListItem.js';
import { useState } from "react";
import UserBadgeItem from "../UserAvatar/UserBadgeItem.js";

export default function GroupChatModal({children}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const {user, chats, setChats} = ChatState();

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

    const handleSubmit = async function() {
        if(!groupChatName || !selectedUsers) {
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        try{
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const {data} = await axios.post('/api/chat/group',{
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id)),
            },config);
            
            setChats([data,...chats]);
            onClose();
            toast({
                title: "New Group Chat Created",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }catch(error){
            toast({
                title: "Failed to Create the Chat!",
                description: error.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    }

    const handleGroup = function(userToAdd) {
         if(selectedUsers.includes(userToAdd)){
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
         }
         setSelectedUsers([...selectedUsers,userToAdd]);
    }

    const handleDelete = function(userToDelete) {
        setSelectedUsers(selectedUsers.filter(u => u._id !== userToDelete._id));
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    >
                        Create Group Chat
                    </ModalHeader>
                        
                    <ModalCloseButton />
                    
                    <ModalBody display="flex" flexDir="column" alignItems="center">
                        <FormControl>
                            <Input 
                                placeholder="Chat Name"
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>

                        <FormControl>
                            <Input 
                                placeholder="Add Users eg: supraj, sumanth"
                                mb={1}
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>

                        {/* {selected users} */}
                        <Box display="flex" flexWrap="wrap" w="100%">
                            {selectedUsers.map((u) => (
                                <UserBadgeItem 
                                    key={u._id} 
                                    user={u}
                                    handleFunction={() => handleDelete(u)}
                                />
                            ))}
                        </Box>

                        {/* render searched users */}
                        {loading ? (<div>loading</div>) : (
                            searchResults.map((u) => (
                                <UserListItem 
                                    key={u._id}
                                    user={u}
                                    handleFunction={() =>handleGroup(u)}
                                />
                            ))
                        )}

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};