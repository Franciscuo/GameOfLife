import React, { useState, useCallback, useRef } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';

import produce from 'immer';

const numRows = 24;
const numCols = 54;
const operations = [
  [0, 1],
  [0, -1],
  [1, 0],
  [1, 1],
  [1, -1],
  [-1, 0],
  [-1, 1],
  [-1, -1]
]

const NavBarGame = (props) => {
  console.log('repitando barra')
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand >El Juego de la vida</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <li className="nav-item active">
              <a href="http://" className="nav-link"
                style={{
                  backgroundColor: !props.running ? '#01DF74' : '#FE2E2E',
                  borderRadius: '15px',
                }}
                onClick={(e) => {
                  e.preventDefault();
                  props.setRunningFunction(!props.running);
                  if (!props.running) {
                    props.runningRefTrue();
                    props.runSimulation();
                  }
                }}
              >{props.running ? 'Stop' : 'Start'} </a>
            </li>
            <li className="nav- item active">
              <a href="http://" className="nav-link" onClick={(e) => {
                e.preventDefault();
                props.randomGrid();
              }}>Aleatorio </a>
            </li>
            <li className="nav- item active">
              <a href="http://" className="nav-link" onClick={(e) => {
                e.preventDefault();
                props.setGridFunction();
              }}>Limpiar </a>
            </li>
            <NavDropdown title={`Velocidad = ${props.vel}`} id="basic-nav-dropdown">
              <NavDropdown.Item href="#" onClick={(e) => {
                e.preventDefault();
                props.setVelFunction(500);
                props.velRefChange(500);
              }}>Lento</NavDropdown.Item>
              <NavDropdown.Item href="#" onClick={(e) => {
                e.preventDefault();
                props.setVelFunction(200);
                props.velRefChange(200);
              }}>
                Normal</NavDropdown.Item>
              <NavDropdown.Item href="#" onClick={(e) => {
                e.preventDefault();
                props.setVelFunction(50);
                props.velRefChange(50);
              }}>Rapido</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}


function App() {

  const cleanBoard = () => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  }

  const [grid, setGrid] = useState(() => {
    return cleanBoard();
  });
  const [running, setRunning] = useState(false);
  const [press, setPress] = useState();
  const [vel, setVel] = useState(500);

  const runningRef = useRef(running);
  runningRef.current = running;

  const velRef = useRef(vel);
  velRef.current = vel;

  const setGridFunction = () => {
    setGrid(cleanBoard())
  }

  const randomGrid = () => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => Math.random() > 0.7 ? 1 : 0));
    }
    setGrid(rows);
  }

  const setRunningFunction = (actual) => {
    setRunning(actual);
  }

  const runningRefTrue = () => {
    runningRef.current = true;
  }

  const setVelFunction = (num) => {
    setVel(num);
  }

  const velRefChange = (num) => {
    velRef.current = num;
  }
  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return
    }
    setGrid(g => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neightbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neightbors += g[newI][newK]
              }
            });

            if (neightbors < 2 || neightbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neightbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      })
    })
    setTimeout(runSimulation, velRef.current);

  }, [])



  return (
    <>
      <NavBarGame
        setRunningFunction={setRunningFunction}
        running={running}
        runningRefTrue={runningRefTrue}
        runSimulation={runSimulation}
        vel={vel}
        setVelFunction={setVelFunction}
        velRefChange={velRefChange}
        setGridFunction={setGridFunction}
        randomGrid={randomGrid}
      />
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${numCols}, 25px)`
        }}>
          {grid.map((rows, i) => rows.map((square, k) => {
            return (
              <div
                onMouseDown={() => {
                  const newGrid = produce(grid, gridCopy => {
                    gridCopy[i][k] = gridCopy[i][k] ? 0 : 1;
                  })
                  setGrid(newGrid)
                  setPress(true)
                }}

                onMouseEnter={() => {
                  if (press) {
                    const newGrid = produce(grid, gridCopy => {
                      gridCopy[i][k] = gridCopy[i][k] ? 0 : 1;
                    })
                    setGrid(newGrid)
                  }
                }}

                onMouseUp={() => {
                  setPress(false);
                }}

                key={`${i}-${k}`}

                id={`${i}-${k}`}
                style={{
                  width: 25,
                  height: 25,
                  backgroundColor: grid[i][k] ? 'DarkTurquoise' : undefined,
                  border: 'solid 0.1px rgb(175, 216, 248)'
                }} >

              </div>)
          }))}
        </div>
      </div>
    </>
  );
}

export default App;