import styles from './Scoreboard.module.scss';

interface ScoreBoardProps {
    player1Score: string | number;
    tieScore: string | number;
    player2Score: string | number;
}

const Scoreboard = ({ player1Score, tieScore, player2Score }: ScoreBoardProps): JSX.Element => {
    return (
        <>
            <div className={styles.container}>
                <div className={styles.scoreContainer}>
                    <div className={styles.title}>PLAYER 1 (X)</div>
                    <div className={styles.score}>{player1Score}</div>
                </div>
                <div className={styles.scoreContainer}>
                    <div className={styles.title}>TIE</div>
                    <div className={styles.score}>{tieScore}</div>
                </div>
                <div className={styles.scoreContainer}>
                    <div className={styles.title}>PLAYER 2 (O)</div>
                    <div className={styles.score}>{player2Score}</div>
                </div>
            </div>
        </>
    )
}

export default Scoreboard;
