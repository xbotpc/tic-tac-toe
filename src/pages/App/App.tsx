import { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import Gameboard from '../../components/Gameboard/Gameboard';
import JoinRoom from '../../components/JoinRoom/JoinRoom';
import TGameData from '../../types/gameData';
import './App.module.scss';
import styles from './App.module.scss';

const socket = io('http://localhost:8080');

function App(): JSX.Element {
  const [gameID, setGameID] = useState('');
  const [roomName, setRoomName] = useState('');
  const [gameData, setGameData] = useState<TGameData>([
    [{ type: '' }, { type: '' }, { type: '' }],
    [{ type: '' }, { type: '' }, { type: '' }],
    [{ type: '' }, { type: '' }, { type: '' }]
  ]);

  useEffect(() => {
    socket.on('roomJoined', ({ gameID: _gameID, gameData }) => {
      setGameID(_gameID);
      setGameData(gameData);
    });

    socket.on('onMoveResponse', (message) => {
      setGameData(message.gameData);
    });
  });

  const onJoinRoomClick = (action: string) => {
    socket.emit(`${action.toLowerCase()}Room`, {
      roomName,
    })
  }

  const onBlockClick = (gameID: string, rowID: number, columnID: number) => {
    socket.emit('blockClick', { gameID, rowID, columnID });
  }

  const onRoomNameChange = (text: string) => {
    setRoomName(text);
  }

  return (
    <>
      <div className={styles.container}>
        {gameID
          ? <Gameboard gameID={gameID} gameData={gameData} onBlockClick={onBlockClick} />
          : <JoinRoom roomName={roomName} onJoinRoomClick={onJoinRoomClick} onRoomNameChange={onRoomNameChange} />
        }
      </div>
    </>
  );
}

export default App;
