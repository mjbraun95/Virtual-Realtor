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
import { HomesFilters } from "../hooks/useHomes";
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
const buildPrompt = (newMessage: Message) => `
We are analysing a conversation between a realtor and a home buyer. The home buyer sent the following message:

${newMessage.body}

We need to extract a set of filters to help narrow down their search. The filters have this format:

{   
  "property_type": ["Single Family"], 
  "min_price": 0, 
  "max_price": 20000000,
  "min_bedrooms": 1,
  "max_bedrooms": 6, 
  "min_bathrooms": 1, 
  "max_bathrooms": 6, 
  "keywords": ["Park", "Schools", "Airports", "Public Transit", "Shopping", "Playground", "Golf Course", "Ski hill"], 
  "building_type": ["Manufactured Home", "House", "Fourplex", "Duplex", "Apartment", "Row / Townhouse"], 
  "min_storeys": 1, 
  "max_storeys": 6,
  "ownership": ["Freehold", "Condominium/Strata"], 
  "min_land_size": 150,
  "max_land_size": 1000000000
}

An example submission would be:

{   
  "property_type": ["Single Family"], 
  "min_price": 100000, 
  "max_price": 200000,
  "min_bedrooms": 1,
  "max_bedrooms": 3, 
  "min_bathrooms": 1, 
  "max_bathrooms": 2, 
  "keywords": ["Park", "Schools", "Airports", "Public Transit", "Shopping", "Playground"], 
  "building_type": ["Apartment", "Row / Townhouse"], 
  "min_storeys": 1, 
  "max_storeys": 2,
  "ownership": ["Freehold"], 
  "min_land_size": 750,
  "max_land_size": 2000
}


Even if some of those details aren't explicitly filled, you still need to fill all of them. Use the placeholder "any" by itself, not inside an array.
If the user says they don't want any attributes, put null instead of "any".
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

async function getFilters(messages: Message[], conversation: ChatCompletionRequestMessage[]): Promise<HomesFilters> {
  const mySpecialContext: ChatCompletionRequestMessage[] = [
    ...conversation,
    { role: "user", content: buildPrompt(messages[messages.length - 1]) },
  ];
  const mySpecialCompletion = await api.createChatCompletion({
    model: "gpt-4",
    messages: mySpecialContext,
    max_tokens: 500,
  });

  const filters = JSON.parse(mySpecialCompletion.data.choices[0].message?.content ?? "{}");
  const filtersCleaned = {} as Partial<HomesFilters>;
  for (const [key, value] of Object.entries(filters)) {
    if (value !== null && value !== "any") {
      if (Array.isArray(value)) {
        filtersCleaned[key] = value.filter((item) => item !== null && item !== "any");
      } else {
        filtersCleaned[key] = value;
      }
    }
  }

  return filtersCleaned as HomesFilters;
}

async function getNextMessage(conversation: ChatCompletionRequestMessage[]): Promise<string> {
  const completion = await api.createChatCompletion({
    model: "gpt-4",
    messages: [{ role: "user", content: assistant_prompt }, ...conversation],
    max_tokens: 500,
  });

  return completion.data.choices[0].message?.content as string;
}

async function sendMessage(messages: Message[], setMessages: (messages: Message[]) => void, setFilters: (filters: HomesFilters) => void) {
  const conversation = messagesToConversation(messages);

  const [filters, response] = await Promise.all([
    getFilters(messages, conversation),
    getNextMessage(conversation)
  ]);

  setFilters((prev: HomesFilters) => ({ ...prev, ...(filters as HomesFilters) }));
  setMessages([
    ...messages,
    { id: messages.length, author: "assistant", body: response },
  ]);

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
        <div className="dot-flashing" />
      </Box>
    </Box>
  );
}

interface ChatProps {
  setFilters: (filters: HomesFilters) => void,
}

export default function Chat({ setFilters }: ChatProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      author: "assistant",
      body: "Hello, I hear you are looking for a home in Edmonton! My name is Rea, I will be your virtual realtor. What type of living space are you looking for today?",
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

    await sendMessage(newMessages, setMessages, setFilters);
    setLoading(false);
  }, [message, messages, setFilters]);

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
