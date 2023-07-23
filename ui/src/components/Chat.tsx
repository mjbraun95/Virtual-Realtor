import "./Chat.css";
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
// const previousFilters = `
// {
//   "transaction_type": null,
//   "property_type": null,
//   "min_price": null,
//   "max_price": null,
//   "min_bedrooms": null,
//   "max_bedrooms": null,
//   "min_bathrooms": null,
//   "max_bathrooms": null,
//   "listed_since": null,
//   "year_built": null,
//   "open_houses_only": null,
//   "live_streams_only": null,
//   "keywords": null,
//   "building_type": null,
//   "min_storeys": null,
//   "max_storeys": null,
//   "ownership": null,
//   "min_land_size_in_acres": null,
//   "max_land_size_in_acres": null
// }

// `

const assistant_prompt = `You are a realtor having a conversation with a home buyer. A GPT is analyzing the conversation to extract filters:

Bring up price restrictions and consider, based on what you know about current areas, what the quality of living should be like, what might surprise the buyer, and what they should watch out for.
You need to ask the user what details or filters they care about.
Some buyers may be new to the culture so make intelligent assumptions if they don't tell you.

The point is to ensure the observing GPT has all the information it needs.

After clarifying message sent by the user, consider following up, and inform the user to check the map on the right.
`
const buildPrompt = (newMessage:Message) => `
We are analysing a conversation between a realtor and a home buyer. The home buyer sent the following message:

${newMessage.body}

We need to extract a set of filters to help narrow down their search. The filters have this format:

{   
  "transaction_type": "for_sale", 
  "property_type": "any", 
  "min_price": 250000, 
  "max_price": 300000,
  "min_bedrooms": 3,
  "max_bedrooms": 3, 
  "min_bathrooms": 1, 
  "max_bathrooms": 1, 
  "listed_since": "2023-1-1", 
  "year_built": 2023, 
  "open_houses_only": True, 
  "live_streams_only": False, 
  "keywords": ["golf course", "pond"], 
  "building_type": "any", 
  "min_storeys": 1, 
  "max_storeys": 1,
  "ownership": "timeshare/fractional", 
  "min_land_size_in_acres": 0.5, 
  "max_land_size_in_acres": 0.5
}

Even if some of those details aren't explicitly filled, you still need to fill all of them. Use the placeholder "any"
What are the filters of the homebuyers message? Only answer in JSON. Do not produce any extra text.


`;

const config = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});
const api = new OpenAIApi(config);

function messagesToConversation(
  messages: Message[],
): ChatCompletionRequestMessage[] {
  return messages.map((message) => ({
    role: message.author === "user" ? "user" : "system",
    content: message.body,
  }));
}

async function sendMessage(messages: Message[]): Promise<string> {
  const conversation = messagesToConversation(messages);

  const displayMessage = messages[messages.length - 1]
    ? `The user's new message is ${messages[messages.length - 1]}`
    : "No new message";
  const mySpecialContext = [
    ...conversation,
    { role: "user", content: buildPrompt(displayMessage) },
  ];
  console.log(mySpecialContext);
  const mySpecialCompletion = await api.createChatCompletion({
    model: "gpt-4",
    messages: mySpecialContext,
    max_tokens: 500,
  });
  console.log(mySpecialCompletion);

  const completion = await api.createChatCompletion({
    model: "gpt-4",
    messages: [{ role: "user", content: assistant_prompt}, ...conversation],
    max_tokens: 500,
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
      : { backgroundColor: "#ebebf7", color: "#220000" };

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

function Typing() {
  return (
    <Box sx={{ display: "flex", justifyContent: "start", px: 2, py: 1 }}>
      <Box
        sx={{
          backgroundColor: "#ebebf7",
          color: "#220000",
          p: 2,
          borderRadius: 2,
          maxWidth: "80%",
          width: 28,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div class="dot-flashing" />
      </Box>
    </Box>
  );
}

export default function Chat() {
  const [loading, setLoading] = useState(false);
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
    setLoading(true);

    const response = await sendMessage(newMessages);
    setLoading(false);
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

          {loading && <Typing />}
        </Stack>

        <Box width="100%">
          <TextField
            fullWidth
            multiline
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
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
