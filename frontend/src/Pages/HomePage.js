import React,{useEffect} from 'react';
import {Container, Box, Text} from '@chakra-ui/react';
import {Tab, Tabs, TabList, TabPanel, TabPanels} from '@chakra-ui/react';
import Login from '../Components/Authentication/Login.js';
import Signup from '../Components/Authentication/Signup.js';
import { useHistory } from 'react-router-dom';

export default function HomePage() {
  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userinfo"));
    if(userInfo && history){
        history.push('/chats');
    }
  },[history]);

  return (
    <Container maxW='xl' centerContent>
      <Box
        d="flex"
        justifyContent="center"
        alignItems="center"  // Add this line to center the text vertically
        textAlign="center"  // Add this line to center the text horizontally
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius = "lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="work sans" color="black" fontWeight="bold">Way-2-Chat</Text>
      </Box>

      <Box bg="white" w="100%" p={4} borderRadius="lg" color="black" borderWidth="1px">
        <Tabs variant='soft-rounded'>
          <TabList mb="1em">
            <Tab w="50%">Login</Tab>
            <Tab w="50%">Sign Up</Tab>
          </TabList>
        
          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>
            <TabPanel>
              <Signup/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}