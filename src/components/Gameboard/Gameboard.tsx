import TBlockType from "../../types/blocktype";
import TGameData from "../../types/gameData";
import Button from "../Button/Button";
import styles from "./Gameboard.module.scss";
import { ReactComponent as CrossIcon } from '../../images/icons/cross.svg'
import { ReactComponent as OIcon } from '../../images/icons/circle.svg'

type GameBoardProps = {
    gameID: string;
    gameData: TGameData;
    onBlockClick: (gameID: string, rowID: number, columnID: number) => void
}

const getBlockByType = (type: TBlockType) => {
    switch (type) {
        case 'cross':
            return <CrossIcon fill={'#3a89d5'} />;

        case 'circle':
            return <OIcon fill={'#39bcd4'} />;

        default:
            return '';
    }
}

const Gameboard = ({ gameID, gameData, onBlockClick }: GameBoardProps): JSX.Element => {

    const renderGameBlocks = () => {
        return gameData.map((line, rowID) => {
            return (
                <div className={styles.line} key={rowID}>
                    {line.map((block, blockID) => {
                        const blockStyle = blockID === 1 ? styles.centerBlock : '';
                        return (
                            <Button
                                key={`${rowID}-${blockID}`}
                                onClick={() => onBlockClick(gameID, rowID, blockID)}
                                styleClass={`${rowID < 2 ? styles.bottomBorder : ''} ${blockStyle}`}
                            >
                                {getBlockByType(block.type)}
                            </Button>)
                    })}
                </div >
            )
        })
    }

    return (
        <>
            <div className={styles.container}>
                {renderGameBlocks()}
            </div>
        </>
    )
}

export default Gameboard
