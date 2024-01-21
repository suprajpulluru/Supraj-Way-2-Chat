import {createContext,useContext,useState,useEffect} from 'react';
import {useHistory} from 'react-router-dom';

const ChatContext = createContext();

export default function ChatProvider({children}) {
    const [user,setUser] = useState();
    const [selectedChat,setSelectedChat] = useState();
    const [chats,setChats] = useState([]);
    const [notifications,setNotifications] = useState([]);

    const history = useHistory();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
        
        if(!userInfo && history){
            history.push('/');
        }
    },[history]);

    return (
        <ChatContext.Provider value={{user,setUser,selectedChat,setSelectedChat,chats,setChats,notifications,setNotifications}}>
            {children}
        </ChatContext.Provider>
    )
};

export function ChatState() {
    return useContext(ChatContext);
}