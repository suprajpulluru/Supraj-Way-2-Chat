import {VStack,FormControl,FormLabel,Input,InputGroup,InputRightElement,Button} from '@chakra-ui/react';
import React,{useState} from 'react';
import {useToast} from '@chakra-ui/react';
import axios from "axios";
import {useHistory} from 'react-router-dom';

export default function Signup() {
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const [pic,setPic] = useState();
    const [loading,setLoading] = useState(false);

    const [show,setShow] = useState(false);
    const handleClick = function() {
        setShow((currentShow) => {return !currentShow});
    }

    const toast = useToast();
    const history = useHistory();

    const postDetails = function(pics) {
        setLoading(true);
        if(pics === undefined){
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
        if(pics.type === "image/jpeg" || pics.type === "image/png" || pics.type === "image/jpg"){
            const data = new FormData();
            data.append("file",pics);
            data.append("upload_preset","chat-app");
            data.append("cloud_name","disgq9bs2");
            fetch("https://api.cloudinary.com/v1_1/disgq9bs2/image/upload",{
                method: "post",
                body: data,
            })
                .then((response) => response.json())
                .then((data) => {
                    setPic(data.url.toString());
                    // console.log(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                })
        }else{
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    }

    const submitHandler = async function() {
        setLoading(true);
        if(!name || !email || !password || !confirmPassword){
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
        if(password !== confirmPassword){
            toast({
                title: "Passwords Do Not Match!",
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
                "/api/user",
                {name, email, password, pic},
                config
            );

            if (response && response.data) {
                const {data}=response;
                toast({
                    title: "Registration Successful!",
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
    };

    return (
        <VStack spacing='5px'>
            <FormControl id='first-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    value={name}
                    placeholder='Enter Your Name'
                    onChange={(event) => {setName(event.target.value)}}
                />
            </FormControl>
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
            <FormControl id='confirmpassword' isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input
                        value={confirmPassword}
                        type={show ? 'text' : 'password'}
                        placeholder='Confirm Password'
                        onChange={(event) => {setConfirmPassword(event.target.value)}}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='pic' isRequired>
                <FormLabel>Upload your Picture</FormLabel>
                <Input
                    type='file'
                    p={1.5}
                    accept='image/*'
                    onChange={(event) => {postDetails(event.target.files[0])}}
                />
            </FormControl>
            <Button
                colorScheme='blue'
                width='100%'
                style={{marginTop: 15}}
                onClick={submitHandler}
                isLoading={loading}
            >
                Sign Up
            </Button>
        </VStack>
    );
};