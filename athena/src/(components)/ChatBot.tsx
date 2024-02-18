"use client";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import React, { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";
import ChatComponent from "./ChatComponent";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

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
        name: "Alice",
      },
    },
  },
  {
    userId: "user2",
    message: {
      type: "bot",
      data: {
        content: "Hi Alice!",
        name: "Bob",
      },
    },
  },
  {
    userId: "user1",
    message: {
      type: "text",
      data: {
        content: "How are you?",
        name: "Alice",
      },
    },
  },
  {
    userId: "user2",
    message: {
      type: "bot",
      data: {
        content: "I'm good, thanks!",
        name: "Bob",
      },
    },
  },
  {
    userId: "user1",
    message: {
      type: "text",
      data: {
        content: "How are you?",
        name: "Alice",
      },
    },
  },
  {
    userId: "user2",
    message: {
      type: "bot",
      data: {
        content: "I'm good, thanks!",
        name: "Bob",
      },
    },
  },
  {
    userId: "user1",
    message: {
      type: "text",
      data: {
        content: "How are you?",
        name: "Alice",
      },
    },
  },
  {
    userId: "user2",
    message: {
      type: "bot",
      data: {
        content: "I'm good, thanks!",
        name: "Bob",
      },
    },
  },
  {
    userId: "user1",
    message: {
      type: "text",
      data: {
        content: "How are you?",
        name: "Alice",
      },
    },
  },
  {
    userId: "user2",
    message: {
      type: "bot",
      data: {
        content: "I'm good, thanks!",
        name: "Bob",
      },
    },
  },
];

const ChatBot: React.FC = () => {
  const [chatData, setChatData] = useState<Message[]>([]);
  const [value, setValue] = useState("");
  const auth = useUser();
  const userId = auth.user?.id as string;

  useEffect(() => {
    const chat = document.getElementById("chat");
    chat?.scrollTo(0, chat.scrollHeight);
  }, [chatData.length]);

  const data = useQuery(api.messaging.list, { userId });

  console.log(data);

  const sendMessage = useMutation(api.messaging.send);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitting");
    if (value !== "") {
      await sendMessage({ message: value, userId });
      setValue("");
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 p-4 h-[70vh]">
        <div className="flex flex-col gap-2">
          {chatData.map((message, index) => (
            <ChatComponent
              isBot={message.message.type === "bot"}
              content={message.message.data.content}
              key={index}
            />
          ))}
        </div>
      </div>
      <div className="flex h-full place-items-end justify-center my-2">
        <form className="flex items-center w-full" onSubmit={handleSubmit}>
          <Input
            className="flex-1 h-10 mx-2 focus:outline-none rounded-lg"
            placeholder="Type your message here"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button className="h-10 mx-3 rounded-r-lg" type="submit">
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
