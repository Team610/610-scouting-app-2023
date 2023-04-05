import {
  ActionIcon,
  Box,
  Group,
  Text,
  Title,
  Button,
  useMantineTheme,
  Footer,
} from "@mantine/core";
import React, { useState } from "react";
//import {PlayerPlay, Settings, PlaylistAdd, Plus} from "tabler-icon-react";

export default function Home() {
  const theme = useMantineTheme();
  const [time, setTime] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const [chooseTeam, setChooseTeam] = useState(true);
  const [timeTeam1Run, setTimeTeam1Run] = useState(false);
  const [timeTeam2Run, setTimeTeam2Run] = useState(false);
  const [timeTeam3Run, setTimeTeam3Run] = useState(false);
  const [timeTeam1, setTimeTeam1] = useState(0);
  const [timeTeam2, setTimeTeam2] = useState(0);
  const [timeTeam3, setTimeTeam3] = useState(0);

  function handleTeamClick(teamN) {
    if (teamN === 1) {
      setTimeTeam1Run(true);
    } else if (teamN === 2) {
      setTimeTeam2Run(true);
    } else if (teamN === 3) {
      setTimeTeam3Run(true);
    }
    setChooseTeam(false);
    setTimerOn(true);
  }

  React.useEffect(() => {
    let interval = null;
    if (timerOn) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (!timerOn) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerOn]);

  function handleStopClick(timeN) {
    if (timeTeam1Run === true) {
      setTimeTeam1(timeTeam1 + timeN);
      setTimeTeam1Run(false);
    } else if (timeTeam2Run === true) {
      setTimeTeam2(timeTeam2 + timeN);
      setTimeTeam2Run(false);
    } else if (timeTeam3Run === true) {
      setTimeTeam3(timeTeam3 + timeN);
      setTimeTeam3Run(false);
    }
    setTimerOn(false);
    setChooseTeam(true);
    setTime(0);
  }

  return (
    <Group>
      <Group
        style={{
          backgroundColor: theme.colors.gray[8],
          height: "10vh",
          padding: "10px",
          borderRadius: "5px",
          minWidth: "300px",
        }}
        mx="auto"
      >
        <Group spacing="none" position="center" mx="auto">
          <Title order={1} style={{ fontWeight: "900", fontSize: "2rem" }}>
            <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
            <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}</span>
          </Title>
        </Group>
        <div color="dark">
          {chooseTeam && !timerOn && (
            <Button color="dark" onClick={() => handleTeamClick(1)}>
              <span>Team 1</span>
            </Button>
          )}
          {chooseTeam && !timerOn && (
            <Button color="dark" onClick={() => handleTeamClick(2)}>
              <span>Team 2</span>
            </Button>
          )}
          {chooseTeam && !timerOn && (
            <Button color="dark" onClick={() => handleTeamClick(3)}>
              <span>Team 3</span>
            </Button>
          )}
          {!chooseTeam && timerOn && (
            <Button color="dark" onClick={() => handleStopClick(time)}>
              Stop
            </Button>
          )}
        </div>
      </Group>
      <Footer height={125} p="md">
        <Group position="apart" spacing="xl"></Group>
        <Text size="lg">
          <span style={{ fontWeight: "boldest" }}>⌚ Team 1 Time: </span>
          <span>{("0" + Math.floor((timeTeam1 / 60000) % 60)).slice(-2)}:</span>
          <span>{("0" + Math.floor((timeTeam1 / 1000) % 60)).slice(-2)}:</span>
          <span>{("0" + ((timeTeam1 / 10) % 100)).slice(-2)}</span>
        </Text>
        <Text size="lg">
          <span style={{ fontWeight: "boldest" }}>⏳ Team 2 Time: </span>
          <span>{("0" + Math.floor((timeTeam2 / 60000) % 60)).slice(-2)}:</span>
          <span>{("0" + Math.floor((timeTeam2 / 1000) % 60)).slice(-2)}:</span>
          <span>{("0" + ((timeTeam2 / 10) % 100)).slice(-2)}</span>
        </Text>
        <Text size="lg">
          <span style={{ fontWeight: "boldest" }}>⏰ Team 3 Time: </span>
          <span>{("0" + Math.floor((timeTeam3 / 60000) % 60)).slice(-2)}:</span>
          <span>{("0" + Math.floor((timeTeam3 / 1000) % 60)).slice(-2)}:</span>
          <span>{("0" + ((timeTeam3 / 10) % 100)).slice(-2)}</span>
        </Text>
      </Footer>
    </Group>
  );
}

/*
 <Footer height={125} p ="md">
                <Group position = "apart" spacing ="xl"></Group>
                <Text size="lg"><span styles={{fontWeight:"boldest"}}
                >⌚ Team 1 Time:  </span>
                <span>{("0" + Math.floor((teamTime[0] / 60000) % 60)).slice(-2)}:</span>
                <span>{("0" + Math.floor((teamTime[0]  / 1000) % 60)).slice(-2)}:</span>
                <span>{("0" + ((teamTime[0]  / 10) % 100)).slice(-2)}</span></Text>
                <Text size="lg"><span styles={{fontWeight:"boldest"}}
                >⏳ Team 2 Time:  </span>
                <span>{("0" + Math.floor((teamTime[0] / 60000) % 60)).slice(-2)}:</span>
                <span>{("0" + Math.floor((teamTime[0]  / 1000) % 60)).slice(-2)}:</span>
                <span>{("0" + ((teamTime[0]  / 10) % 100)).slice(-2)}</span>
                </Text>
                <Text size="lg"><span styles={{fontWeight:"boldest"}}
                >⏰ Team 3 Time:  </span>
                <span>{("0" + Math.floor((teamTime[0] / 60000) % 60)).slice(-2)}:</span>
                <span>{("0" + Math.floor((teamTime[0]  / 1000) % 60)).slice(-2)}:</span>
                <span>{("0" + ((teamTime[0]  / 10) % 100)).slice(-2)}</span>
                </Text>
          </Footer>
*/

/*
<Text>
            <span>Team 1 Time is</span>
            <span>{("0" + Math.floor((timeTeam1 / 60000) % 60)).slice(-2)}:</span>
            <span>{("0" + Math.floor((timeTeam1 / 1000) % 60)).slice(-2)}:</span>
            <span>{("0" + ((timeTeam1 / 10) % 100)).slice(-2)}</span>
          </Text>
          <Text>
            <span>Team 2 Time is</span>
            <span>{("0" + Math.floor((timeTeam2 / 60000) % 60)).slice(-2)}:</span>
            <span>{("0" + Math.floor((timeTeam2 / 1000) % 60)).slice(-2)}:</span>
            <span>{("0" + ((timeTeam2 / 10) % 100)).slice(-2)}</span>
          </Text>
          <Text>
            <span>Team 3 Time is</span>
            <span>{("0" + Math.floor((timeTeam3 / 60000) % 60)).slice(-2)}:</span>
            <span>{("0" + Math.floor((timeTeam3 / 1000) % 60)).slice(-2)}:</span>
            <span>{("0" + ((timeTeam3 / 10) % 100)).slice(-2)}</span>
          </Text>
*/
