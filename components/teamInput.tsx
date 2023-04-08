import { TextInput } from "@mantine/core";

export function TeamInput({
  setTeam,
  num,
  idx,
}: {
  setTeam: Function;
  num: number;
  idx: number;
}) {
  let str = "Team: #" + num;
  return (
    <TextInput
      value={num}
      label={str}
      withAsterisk
      onChange={(event) => setTeam(parseInt(event.currentTarget.value), idx)}
    />
  );
}
