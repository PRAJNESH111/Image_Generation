import React from 'react'
import styled from 'styled-components'
import Button from './button'
import TextInput from './TextInput'
import { AutoAwesome, CreateRounded } from '@mui/icons-material'
import { GenerateAIImage } from '../api'
import { CreatePost } from '../api'

const Form = styled.div`
 flex: 1;
    display: flex;
    padding:16px 20px;
    flex-direction: column;
    gap: 9%;
    justify-content: center;

`
const Top = styled.div`
display: flex;
flex-direction: column;
gap: 6px;

`;

const Title = styled.div`
  font-size: 30px;
    font-weight: 600;
    color:${({ theme }) => theme.text_primary}; 
   `

const Desc = styled.div`
 font-size: 20px;
    font-weight: 400;
    color:${({ theme }) => theme.text_secondary}; `

const Body = styled.div`
display: flex;
    flex-direction: column;
    gap: 18px;
    font-size: 12px;
    font-weight: 400;
    color:${({ theme }) => theme.text_secondary}; `
    ;

const Action = styled.div`
flex: 1;
display: flex;
    gap: 10px;
`;


const GenerateImageForm = ({
    createPostLoading,
    setcreatePostLoading,
    generateImageLoading,
    setGenerateImageLoading,
    post,
    setPost
}) => {
    const generateImageFun = async () => {
    try {
        setGenerateImageLoading(true);
        const res = await GenerateAIImage({ prompt: post.prompt });
        setPost({ ...post, photo: res?.data?.photo });
        console.log(res.data.photo);

    } catch (err) {
        console.error("Error generating image:", err);

    } finally {
        setGenerateImageLoading(false);
        
    }
};

    const createPostFun = async () => {
        if(!post.name || !post.prompt || !post.photo) {
            alert("Please fill in all the required fields.");
            return;
        }
        setcreatePostLoading(true);
        try {
            const response = await CreatePost(post);
            console.log("Post created:", response.data);
            alert("Post created successfully!");
            // Optionally clear the form or redirect the user
            setPost({ name: "", prompt: "", photo: "" });
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Failed to create post. Please try again.");
        } finally {
            setcreatePostLoading(false);
        }
    }

    return (
        <Form>
            <Top>
                <Title>Generate Image</Title>
                <Desc>Generate an image using AI</Desc>
            </Top>
            <Body>
                <TextInput
                    label="Author"
                    placeholder="Enter your name..."

                    name="name"
                    value={post.name}
                    handelChange={(e) => setPost({ ...post, name: e.target.value })}

                />

                <TextInput
                    label="Prompt"
                    placeholder="Write a detailed prompt for the image..."
                    name="name"
                    textArea
                    row="8"
                    value={post.prompt} 
                    handelChange={(e) => setPost({ ...post, prompt: e.target.value })}

                />  

                ** You can post the AI Generated Image to the Communuty **
            </Body>

            <Action>
                <Button text="Generate Image" leftIcon={<AutoAwesome />} isLoading={generateImageLoading}  isDisabled={post.prompt === ""} onClick={()=>generateImageFun()}/>
                <Button text="Post Image" flex type="secondary" leftIcon={<CreateRounded />} isLoading={createPostLoading} isDisabled={post.name === "" || post.photo === ""} onClick={()=>createPostFun()} />
            </Action>
        </Form>
    )
}

export default GenerateImageForm
