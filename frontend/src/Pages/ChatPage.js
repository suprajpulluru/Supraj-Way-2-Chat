import { Box } from '@chakra-ui/react';
import {ChatState} from '../Context/chatProvider.js';
import SideDrawer from '../Components/miscellaneous/SideDrawer.js';
import MyChats from '../Components/MyChats.js';
import ChatBox from '../Components/ChatBox.js';
import {useHistory} from 'react-router-dom';
import {useEffect, useState} from 'react';

export default function ChatPage() {
    const {user,setUser} = ChatState();
    const [fetchAgain,setFetchAgain] = useState(false);

    const history = useHistory();
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
        if(!userInfo && history){
            history.push('/');
        }
    },[history]);

    return (
        <div style={{width: '100%'}}>
            {user && <SideDrawer/>}
            <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px"> 
                {user && <MyChats fetchAgain={fetchAgain}/>}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
            </Box>
        </div>
    );
};