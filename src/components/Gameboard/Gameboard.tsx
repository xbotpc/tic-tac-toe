import TBlockType from "../../types/blocktype";
import TGameData from "../../types/gameData";
import Button from "../Button/Button";
import styles from "./Gameboard.module.scss";
import { ReactComponent as CrossIcon } from '../../images/icons/cross.svg'
import { ReactComponent as OIcon } from '../../images/icons/circle.svg';
import cx from 'classnames';

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
        return gameData.map((line, rowID, arr) => {
            const horizontalStrike = line.every(x => (x.type === line[0].type) && (x.type !== ''));
            return (
                <div className={styles.line} key={rowID}>
                    {line.map((block, blockID) => {
                        let verticalStrike = false;
                        let rightDiagonalStrike = false;
                        let leftDiagonalStrike = false;
                        if (!horizontalStrike && arr[rowID][blockID].type !== '') {
                            verticalStrike = arr.every(x => (x[blockID].type === line[blockID].type));
                        }
                        if (!verticalStrike && arr[0][0].type !== '') {
                            if ((rowID === 0 && blockID === 0) || (rowID === 1 && blockID === 1) || (rowID === 2 && blockID === 2)) {
                                const topLeftBoxType = arr[0][0].type;
                                const leftDiagonalData = [arr[0][0], arr[1][1], arr[2][2]];
                                leftDiagonalStrike = leftDiagonalData.length === 3 && leftDiagonalData.every(x => x.type === topLeftBoxType);
                            }
                        }
                        if (!leftDiagonalStrike && arr[0][2].type !== '') {
                            if ((rowID === 0 && blockID === 2) || (rowID === 1 && blockID === 1) || (rowID === 2 && blockID === 0)) {
                                const topRightBoxType = arr[0][2].type;
                                const rightDiagonalData = [arr[0][2], arr[1][1], arr[2][0]];
                                rightDiagonalStrike = rightDiagonalData.length === 3 && rightDiagonalData.every(x => x.type === topRightBoxType);
                            }
                        }
                        const blockStyle = blockID === 1 ? styles.centerBlock : '';
                        return (
                            <Button
                                key={`${rowID}-${blockID}`}
                                onClick={() => onBlockClick(gameID, rowID, blockID)}
                                styleClass={cx({
                                    [styles.bottomBorder]: rowID < 2,
                                    [styles.verticalStrike]: verticalStrike,
                                    [styles.horizontalStrike]: horizontalStrike,
                                    [styles.rightDiagonalStrike]: rightDiagonalStrike,
                                    [styles.leftDiagonalStrike]: leftDiagonalStrike,
                                    [styles.striked]: verticalStrike || horizontalStrike || rightDiagonalStrike || leftDiagonalStrike,
                                }, blockStyle)}
                            >
                                {getBlockByType(block.type)}
                            </Button>)
                    })
                    }
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
