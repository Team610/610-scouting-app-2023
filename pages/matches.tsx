import { Select } from "@mantine/core";
import React, { use, useState, useEffect } from "react";
import NextCors from 'nextjs-cors';
import { match } from "assert";
export default function SelectMatchDropBox() {
    const [jsonData, setJsonData] = useState("");
    const [matchNumbers, setMatchNumbers] = useState([]);


    useEffect(() => {
        async function fetchData() {
            const headers = {
                "X-TBA-Auth-Key": "monpiIlPoQ81Y5bc8zhoMNuTbm8bLHQzYikSQuYYZHvM3BbAm8Y4uFeaOU6bMNg1",
            }
            const response = await fetch("https://www.thebluealliance.com/api/v3/event/2023isde1/matches", { headers: headers });
            const data = await response.json();
            setJsonData(data);
            setMatchNumbers(data.map((item: { match_number: number, key: any; }) => item.key));


        }
        fetchData();
    }, []);

    const options = matchNumbers.map((number) => ({
        value: number,
        label: `Match #${number}`,
      }));

    return (
        <Select
            label="Choose an event in progress"
            placeholder="Select"
            data={options}
            searchable
        />
    );

}
