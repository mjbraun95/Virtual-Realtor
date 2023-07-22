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
          display: "flex",
          ...position,
          p: 2,
          borderRadius: 2,
          maxWidth: "80%",
        }}
      >
        <Typography>{message.body}</Typography>
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
    {
      id: 1,
      author: "user",
      body: "Hey, I am moving to Edmonton early next year. I am looking to purchase a home for my family of 4.",
    },
  ]);

  const handleSend = useCallback(() => {
    setMessages((messages) => [
      ...messages,
      { id: messages.length, author: "user", body: message },
    ]);
    setMessage("");
  }, [message]);

  return (
    <Card sx={{ w: "30vw", maxWidth: 500 }}>
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
