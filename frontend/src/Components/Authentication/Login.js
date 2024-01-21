import {VStack,FormControl,FormLabel,Input,InputGroup,InputRightElement,Button} from '@chakra-ui/react';
import React,{useState} from 'react';
import {useToast} from '@chakra-ui/react';
import axios from "axios";
import {useHistory} from 'react-router-dom';

export default function Login() {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    const [show,setShow] = useState(false);
    const handleClick = function() {
        setShow((currentShow) => {return !currentShow});
    }

    const [loading,setLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();
    const submitHandler = async function() {
        setLoading(true);
        if(!email || !password){
            toast({
                title: "Please Fill all the Fields!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
        try{
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const response = await axios.post(
                "/api/user/login",
                {email,password},
                config
            );
            if (response && response.data) {
                const { data } = response;
                toast({
                    title: "Login Successful!",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });

                localStorage.setItem("userInfo", JSON.stringify(data));
                setLoading(false);
                history.push('/chats');
            } else {
                throw new Error("Unexpected response format");
            }
        }catch(error){
            toast({
                title: "Error Occurred!",
                description: error.response ? error.response.data.message : "Unknown error",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    }

    return (
        <VStack spacing='5px'>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    value={email}
                    placeholder='Enter Your Email'
                    onChange={(event) => {setEmail(event.target.value)}}
                />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        value={password}
                        type={show ? 'text' : 'password'}
                        placeholder='Enter Your Password'
                        onChange={(event) => {setPassword(event.target.value)}}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button
                colorScheme='blue'
                width='100%'
                style={{marginTop: 15}}
                onClick={submitHandler}
                isLoading={loading}
            >
                Login
            </Button>

            <Button
                variant='solid'
                colorScheme='red'
                width='100%'
                onClick={() => {
                    setEmail("guest@example.com");
                    setPassword("123456");
                }}
            >
                Get Guest User Credentials
            </Button>
        </VStack>
    );
};