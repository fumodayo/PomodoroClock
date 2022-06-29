import React, { useState, useRef, useEffect } from "react";
import { Stack, Box, Typography, Button } from "@mui/material";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Pause, PlayArrow, Replay } from "@mui/icons-material";
import PrettoSlider from "./PrettoSlider";

const Timer = () => {
  const colorWork = "#28b6f6";
  const tailColorWork = "#cfedfa";
  const colorBreak = "#ffac1c";
  const tailColorBreak = "#ffedcf";

  const [workMinutes, setWorkMinutes] = useState(45);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [isPaused, setIsPaused] = useState(true);

  const [mode, setMode] = useState("work"); // work/break/null
  const [secondsLeft, setSecondsLeft] = useState(0);

  const secondsLeftRef = useRef(secondsLeft);
  const isPausedRef = useRef(isPaused);
  const modeRef = useRef(mode);

  const interval = useRef(null);

  const tick = () => {
    secondsLeftRef.current--;
    setSecondsLeft(secondsLeftRef.current);
  };

  const handleReset = () => {
    secondsLeftRef.current = 2700;
    modeRef.current = "work";
    isPausedRef.current = true;
    setWorkMinutes(45);
    setBreakMinutes(5);
    setIsPaused(true);
    setSecondsLeft(2700);
    setMode("work");
    // console.log(secondsLeft)
    // console.log(totalSeconds)
    return () => clearInterval(interval.current);
  };

  useEffect(() => {
    document.title = `(${minutes + ":" + seconds}) Session: ${
      modeRef.current === "work" ? "Work Time" : "Break Time"
    } - Promodoro Times`;
  }, [minutes, seconds]);

  useEffect(() => {
    const switchMode = () => {
      const nextMode = modeRef.current === "work" ? "break" : "work";
      const nextSeconds =
        (nextMode === "work" ? workMinutes : breakMinutes) * 60;

      setMode(nextMode);
      modeRef.current = nextMode;

      setSecondsLeft(nextSeconds);
      secondsLeftRef.current = nextSeconds;
    };

    secondsLeftRef.current =
      modeRef.current === "work" ? workMinutes * 60 : breakMinutes * 60;
    setSecondsLeft(secondsLeftRef.current);

    // console.log(modeRef.current);
    // console.log("work", workMinutes);
    // console.log("break", breakMinutes);

    interval.current = setInterval(() => {
      if (isPausedRef.current) {
        return;
      }
      if (secondsLeftRef.current === 0) {
        return switchMode();
      }
      tick();
    }, 1000);

    return () => clearInterval(interval.current);
  }, [workMinutes, breakMinutes]);

  const totalSeconds = mode === "work" ? workMinutes * 60 : breakMinutes * 60;
  const percentage = Math.round((secondsLeft / totalSeconds) * 100);
  const minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  if (seconds < 10) seconds = "0" + seconds;

  return (
    <Stack
      direction="column"
      spacing="20px"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
    >
      <Typography fontSize="40px" fontWeight={600}>
        Pomodoro Timer
      </Typography>
      <Box
        sx={{
          width: "800px",
          height: "600px",
          backgroundColor: "#eb144c",
          borderRadius: "50px",
          textTransform: "capitalize",
        }}
        p="20px"
      >
        <Stack
          spacing="20px"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
        >
          <Typography mt="20px" fontSize="25px" fontWeight={600}>
            Session: {modeRef.current === "work" ? "Work" : "Break"}
          </Typography>
          <Box sx={{ width: "250px", height: "250px" }}>
            <CircularProgressbar
              value={percentage}
              text={minutes + ":" + seconds}
              strokeWidth={12}
              styles={buildStyles({
                pathColor: modeRef.current === "work" ? colorWork : colorBreak,
                textColor: "#fff",
                trailColor:
                  modeRef.current === "work" ? tailColorWork : tailColorBreak,
              })}
            />
          </Box>
          <Stack direction="row" spacing="20px">
            {isPaused ? (
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={() => {
                  setIsPaused(false);
                  isPausedRef.current = false;
                }}
              >
                Start
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<Pause />}
                onClick={() => {
                  setIsPaused(true);
                  isPausedRef.current = true;
                }}
              >
                Pause
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={<Replay />}
              onClick={() => {
                handleReset();
              }}
            >
              Reset
            </Button>
          </Stack>
          <Stack
            direction="row"
            color="#000"
            spacing="150px"
            backgroundColor="#fff"
            width="800px"
            height="200px"
            justifyContent="center"
            textAlign="center"
            alignItems="center"
            borderRadius="0 0 50px 50px"
          >
            <Box sx={{ width: "200px", height: "100px" }}>
              <Typography fontSize="20px" fontWeight={600}>
                Session Length
              </Typography>
              <PrettoSlider
                value={workMinutes}
                onChange={(e, newValue) => setWorkMinutes(newValue)}
                valueLabelDisplay="auto"
                aria-label="pretto slider"
                defaultValue={20}
                min={15}
                max={60}
                disabled={isPaused ? false : true}
              />
            </Box>
            <Box sx={{ width: "200px", height: "100px" }}>
              <Typography fontSize="20px" fontWeight={600}>
                Break Length
              </Typography>
              <PrettoSlider
                value={breakMinutes}
                onChange={(e, newValue) => setBreakMinutes(newValue)}
                valueLabelDisplay="auto"
                aria-label="pretto slider"
                defaultValue={20}
                min={5}
                max={30}
                disabled={isPaused ? false : true}
              />
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};

export default Timer;
