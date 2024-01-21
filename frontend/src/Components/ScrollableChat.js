import ScrollableFeed from 'react-scrollable-feed';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics';
import { ChatState } from '../Context/chatProvider';
import { Avatar, Tooltip } from '@chakra-ui/react';

export default function ScrollableChat({messages}) {
  const {user} = ChatState();
  return (
    <ScrollableFeed>
        {messages && messages.map((msg,index) => (
            <div style={{display: "flex"}} key={msg._id}>
                {
                    ((isSameSender(messages,msg,index,user._id)) || (isLastMessage(messages,index,user._id))) && (
                        <Tooltip label={msg.sender.name} placement="bottom-start" hasArrow>
                            <Avatar
                                mt="7px"
                                mr={1}
                                size="sm"
                                cursor="pointer"
                                name={msg.sender.name}
                                src={msg.sender.pic}
                            />
                        </Tooltip>
                    )
                }
                <span style={{
                    backgroundColor: `${msg.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}`,
                    borderRadius: "20px",
                    padding: "5px 15px",
                    maxWidth: "75%",    
                    marginLeft: isSameSenderMargin(messages,msg,index,user._id),
                    marginTop: isSameUser(messages,msg,index) ? 3 : 10,
                }}
                >{msg.content}</span>
            </div>  
        ))}
    </ScrollableFeed>
  );
};