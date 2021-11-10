import dotenv from 'dotenv';
import { useEffect, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { io } from "socket.io-client";
import Button from '../../components/Button/Button';
import Gameboard from '../../components/Gameboard/Gameboard';
import JoinRoom from '../../components/JoinRoom/JoinRoom';
import Scoreboard from '../../components/Scoreboard/Scoreboard';
import TGameData from '../../types/gameData';
import { RoomAction } from '../../types/roomAction';
import styles from './App.module.scss';
import { ReactComponent as RefreshIcon } from '../../images/icons/refresh.svg';

dotenv.config();

const { REACT_APP_SOCKET_URL } = process.env;

const socket = io(REACT_APP_SOCKET_URL || '');

function App(): JSX.Element {
  const [gameID, setGameID] = useState('');
  const [roomName, setRoomName] = useState('');
  const [gameData, setGameData] = useState<TGameData>([
    [{ type: '' }, { type: '' }, { type: '' }],
    [{ type: '' }, { type: '' }, { type: '' }],
    [{ type: '' }, { type: '' }, { type: '' }]
  ]);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [tieScore, setTieScore] = useState(0);
  const [youWon, setYouWon] = useState(false);
  const [gamePlay, setGamePlay] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    socket.on('roomJoined', ({ gameID: _gameID, gameData: _gameData, nextMove, message }) => {
      if (message === 'Room already exists') {
        // TODO: Show room already exists message.
        console.log('Room already exists.');
      } else {
        unstable_batchedUpdates(() => {
          setGameID(_gameID);
          setGameData(_gameData);
          setIsMyTurn(nextMove === socket.id);
          setGamePlay(true);
        });
      }
    });

    socket.on('onMoveResponse', (message) => {
      if (message.message === 'winner' || message.message === 'tie') {
        unstable_batchedUpdates(() => {
          setIsMyTurn(false);
          setYouWon(message.winnerID === socket.id);
          setGamePlay(false);
          setPlayer1Score(message.score.player1);
          setPlayer2Score(message.score.player2);
          setTieScore(message.score.tie);
          setGameFinished(true);
        })
      } else {
        setIsMyTurn(message.nextMove === socket.id);
      }
      setGameData(message.gameData);
    });

    socket.on('onNewGame', (message) => {
      setGameData(message.gameData);
      setIsMyTurn(message.nextMove === socket.id);
      setGamePlay(true);
      setGameFinished(false);
    })
  }, []);

  const onJoinRoomClick = (action: RoomAction) => {
    socket.emit(`${action.toLowerCase()}Room`, {
      roomName,
    })
  }

  // TODO: Remove gameID from function arguments. No need to pass gameID to Gameboard component
  const onBlockClick = (gameID: string, rowID: number, columnID: number) => {
    if (isMyTurn) {
      socket.emit('blockClick', { gameID, rowID, columnID });
    }
  }

  const onRoomNameChange = (text: string) => {
    setRoomName(text);
  }

  const onRefreshClick = () => {
    socket.emit('newGame', { gameID });
  }

  return (
    <>
      <div className={styles.container}>
        {gameID
          ? (
            <>
              <header>
                <Button type={'invisible'} onClick={onRefreshClick}>
                  <RefreshIcon title={'Start New Game'} fill={gameFinished ? 'white' : 'transparent'} />
                </Button>
              </header>
              <Gameboard gameID={gameID} gameData={gameData} onBlockClick={onBlockClick} />
              <Scoreboard player1Score={player1Score} player2Score={player2Score} tieScore={tieScore} />
              {<span className={styles.flashing}>{gamePlay && (isMyTurn ? 'Your Turn' : 'Waiting for opponent...')}</span>}
            </>
          )
          : <JoinRoom roomName={roomName} onJoinRoomClick={onJoinRoomClick} onRoomNameChange={onRoomNameChange} />
        }
      </div>
    </>
  );
}

export default App;
