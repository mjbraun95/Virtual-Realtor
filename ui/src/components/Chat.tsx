import { useCallback, useState } from "react";
import { SendRounded } from "@mui/icons-material";
import {
  Box,
  Card,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";

const config = new Configuration({ apiKey: import.meta.env.VITE_OPENAI_API_KEY });
const api = new OpenAIApi(config);

function messagesToConversation(messages: Message[]): ChatCompletionRequestMessage[] {
  return messages.map((message) => ({
    role: message.author === "user" ? "user" : "system",
    content: message.body,
  }));
}

async function sendMessage(messages: Message[]): Promise<string> {
  const conversation = messagesToConversation(messages);
  const completion = await api.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: conversation,
    max_tokens: 60
  });

  return completion.data.choices[0].message?.content as string;
}

interface Message {
  id: number;
  author: "user" | "assistant";
  body: string;
}

interface MessageProps {
  message: Message;
}

function Message({ message }: MessageProps) {
  const colors =
    message.author === "user"
      ? { backgroundColor: "#2f9ff0", color: "#FFEEEE" }
      : { backgroundColor: "#cccce0", color: "#220000" };

  const position =
    message.author === "user"
      ? { justifyContent: "end" }
      : { justifyContent: "start" };

  return (
    <Box sx={{ display: "flex", ...position, px: 2, py: 1 }}>
      <Box
        sx={{
          ...colors,
          ...position,
          p: 2,
          borderRadius: 2,
          maxWidth: "80%",
        }}
      >
        {message.body
          .split("\n")
          .map((part, i) =>
            part === "" ? (
              <br key={i} />
            ) : (
              <Typography key={i}>{part}</Typography>
            ),
          )}
      </Box>
    </Box>
  );
}

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      author: "assistant",
      body: "Hello, I hear you are looking for a home in Edmonton! I will be your virtual realtor. What type of living space are you looking for today?",
    },
  ]);

  const handleSend = useCallback(async () => {
    const newMessages: Message[] = [
      ...messages,
      { id: messages.length, author: "user", body: message },
    ];
    setMessages(newMessages);
    setMessage("");

    const response = await sendMessage(newMessages);
    setMessages([
      ...newMessages,
      { id: newMessages.length, author: "assistant", body: response },
    ]);
  }, [message, messages]);

  return (
    <Card sx={{ minWidth: 400, flex: 1, mr: 1, boxShadow: "none" }}>
      <Stack direction="column" height="100%">
        <Stack
          direction="column"
          width="100%"
          flex="1"
          overflow="scroll"
          alignItems="stretch"
        >
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </Stack>

        <Box width="100%">
          <TextField
            fullWidth
            multiline
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSend} edge="end">
                    <SendRounded />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Stack>
    </Card>
  );
}
