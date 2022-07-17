import React, { useState, useEffect } from "react";
import "./styles.css";
import initSqlJs from "sql.js";
import ResultsTable from "./components/ResultsTable"
import {HashRouter as Router} from 'react-router-dom';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import API from './utils/API'

export default function App() {
  const [error, setError] = useState(null);

  if (error) return <pre>{error.toString()}</pre>;
  else return <SQLRepl/>;
}

/**
 * A simple SQL read-eval-print-loop
 * @param 
 */
function SQLRepl() {
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  const [isCardMode, setIsCardMode] = useState(true);
  let responses = [];

  function exec(sql) {
    if (sql == '') return;
    responses = [];

    let startgetall0 = performance.now();
    API.get(
      `/api/items`,
      { }
    ).then( (response) => {
      responses.push(['get all 0', startgetall0.toFixed(3), performance.now().toFixed(3), response.data]);
      // setResults(responses);
    }).catch((err) => responses.push(['ERROR: get all 0', startgetall0.toFixed(3), performance.now().toFixed(3), err]));

    let startpost0 = performance.now();
    API.post(
      `/api/items`,
      {name: "phone test 0", count: 2}
    ).then( (response) => {
      responses.push(['post 0', startpost0.toFixed(3), performance.now().toFixed(3), response.data]);
      // setResults(responses);

      let startget0 = performance.now();
      API.get(
        `/api/items/` + response.data.id,
        { }
      ).then( (getresp) => {
        responses.push(['get 0', startget0.toFixed(3), performance.now().toFixed(3), getresp.data]);
        // setResults(responses);
      }).catch((err) => responses.push(['ERROR: get 0', startget0, performance.now(), err]));


      let startput0 = performance.now();
      API.put(
        `/api/items/` + response.data.id,
        {name: "phone test 0", count: 1}
      ).then((putresp) => {
        responses.push(['put 0', startput0.toFixed(3), performance.now().toFixed(3), putresp.data]);

        let startdelete0 = performance.now();
        API.delete(
          `/api/items/` + response.data.id,
          {}
        ).then((deleteresp) => responses.push(['delete 0', startdelete0.toFixed(3), performance.now().toFixed(3), deleteresp.data]))
        .catch((err) => responses.push(['ERROR: delete 0', startdelete0, performance.now(), err]));
      }).catch((err) => responses.push(['ERROR: put 0', startput0, performance.now(), err]));
    }).catch((err) => responses.push(['ERROR: post 0', startpost0, performance.now(), err]));
  }

  // Promise.allSettled([promget0, prompost0])
  //   .then((resp) => {
  //     setResults(responses);
  //   });

  const handleClickRandom = () => {
    // let randHan = getRandom3500Han();
    // document.getElementById('queryTextarea').value = randHan;
    // exec(randHan);
    setResults(responses);
  }

  return (
    <Container className="App">
      <h1>HanPoly</h1>
      

      <textarea
        id="queryTextarea"
        onChange={(e) => exec(e.target.value)}
        placeholder="Enter a Chinese character or romanization (MC pinyin, pinyin, jyutping etc.)
                     No inspiration ? Try `文` or `myon`"
      />

      <Stack direction="row" spacing={2}> 

        <FormControlLabel control={<Switch
              checked={isCardMode}
              onChange={() => setIsCardMode(!isCardMode)}
              name="Card Mode"
              color="primary"
            />} label="Card Mode" />

        <Tooltip title="to handle uncertainty of React setState()">
          <Button onClick={handleClickRandom}>Refresh Result</Button>
        </Tooltip>
        

      </Stack>
      

      <pre className="error">{(error || "").toString()}</pre>

      <div style={{width: "100%"}}>{
        results.map((result, i) => (
          <Typography key={i} component="p" paragraph> 
            {JSON.stringify(result)}
          </Typography>
        ))
      }</div>
      {/* <Typography variant="body1" gutterBottom> 
          {JSON.stringify(results)}
      </Typography> */}
    </Container>
  );
}
