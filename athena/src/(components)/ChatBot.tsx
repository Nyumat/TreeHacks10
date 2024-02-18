'use client';
import React, { useState, useEffect } from 'react';
import ChatComponent from './ChatComponent';

interface Message {
    userId: string;
    message: {
        type: string;
        data: {
            content: string;
            name?: string | null;
            role?: string | null;
            additional_kwargs?: string | null;
        };
    };
}

const dummyData: Message[] = [
    {
        userId: "user1",
        message: {
            type: "text",
            data: {
                content: "Hello!",
                name: "Alice"
            }
        }
    },
    {
        userId: "user2",
        message: {
            type: "bot",
            data: {
                content: "Hi Alice!",
                name: "Bob"
            }
        }
    },
    {
        userId: "user1",
        message: {
            type: "text",
            data: {
                content: "How are you?",
                name: "Alice"
            }
        }
    },
    {
        userId: "user2",
        message: {
            type: "bot",
            data: {
                content: "I'm good, thanks!",
                name: "Bob"
            }
        }
    }
];

const ChatBot: React.FC = () => {
    const [chatData, setChatData] = useState<Message[]>(dummyData);

    useEffect(() => {
        const fetchChatData = async () => {
            try {
                const response = await fetch('/api/chat');
                const data: Message[] = await response.json();
                setChatData(data);
            } catch (error) {
                console.error('Error fetching chat data:', error);
            }
        };

        fetchChatData();
    }, []);

    return (
        <div>
            <h2>Chat</h2>
            <div>
                {chatData.map((message, index,) => (
                    <ChatComponent isBot={message.message.type === 'bot'} content={message.message.data.content} key={index} />
                ))}
            </div>
        </div>
    );
};

export default ChatBot;
