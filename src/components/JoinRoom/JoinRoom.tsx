import cx from 'classnames';
import { useState } from "react";
import { RoomAction } from '../../types/roomAction';
import isEmpty from "../../utils/isEmpty";
import Button from "../Button/Button";
import styles from './JoinRoom.module.scss';

type JoinRoomProps = {
    roomName: string;
    onJoinRoomClick: (action: RoomAction) => void;
    onRoomNameChange: (text: string) => void;
}

const JoinRoom = ({ roomName = '', onJoinRoomClick, onRoomNameChange }: JoinRoomProps): JSX.Element => {
    const [action, setAction] = useState<RoomAction>('');

    const onActionClick = (_action: typeof action) => {
        setAction(_action);
    }

    return (
        <div className={styles.container}>
            {isEmpty(action) ? (
                <div className={styles.split}>
                    <Button styleClass={cx(styles.option, styles.create)} onClick={() => onActionClick('Create')}>
                        CREATE
                    </Button>
                    <span>OR</span>
                    <Button styleClass={cx(styles.option, styles.join)} onClick={() => onActionClick('Join')}>
                        JOIN
                    </Button>
                </div>
            ) :
                <>
                    <div className={styles.stack}>
                        <input id="roomID" type="text" placeholder="Room Name" onChange={(e) => onRoomNameChange(e.target.value)} value={roomName} />
                        <Button styleClass={styles.roomAction} onClick={() => onJoinRoomClick(action)}>
                            {action} Room
                        </Button>
                    </div>
                </>
            }
        </div>
    )
}

export default JoinRoom
