import { Button, Typography } from "@mui/material";
import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Typography>{count}</Typography>

      <Button onClick={() => setCount((count) => count + 1)}>Press Me</Button>
    </>
  );
}

export default App;
