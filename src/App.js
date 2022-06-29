import React from "react";
import { Stack } from "@mui/material";
import "./App.css";
import Timer from './components/Timer'

function App() {

  return (
    <Stack direction="row" justifyContent="center" alignItems="center" mt="160px">
      <Timer/>
    </Stack>
  );
}

export default App;
