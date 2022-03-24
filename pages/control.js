import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Link from 'next/link'
import { useRouter } from 'next/router';

import Box from '@mui/material/Box';
import OriginalSlider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// Icon
import HartrateIcon from '../public/images/cardiogram.svg';
import RoadIcon from '../public/images/road.svg';
import CalorieIcon from '../public/images/calories-calculator.svg';
import FootIcon from '../public/images/footsteps-silhouette-variant.svg';

import SocketIO from 'socket.io-client';

import style from '../styles/control.module.scss';

const Slider = styled(OriginalSlider)({
    color: '#2f3546',
    height: 12,
    '& .MuiSlider-track': {
        border: 'none',
    },
    '& .MuiSlider-thumb': {
        height: 32,
        width: 32,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit',
        },
        '&:before': {
            display: 'none',
        },
    },
    '& .MuiSlider-valueLabel': {
        lineHeight: 1.2,
        fontSize: 16,
        background: 'unset',
        padding: 0,
        width: 40,
        height: 40,
        borderRadius: '50% 50% 50% 0',
        backgroundColor: '#52af77',
        transformOrigin: 'bottom left',
        transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
        '&:before': { display: 'none' },
        '&.MuiSlider-valueLabelOpen': {
            transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
        },
        '& > *': {
            transform: 'rotate(45deg)',
        },
    },
});

const PauseButton = styled(LoadingButton)({
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderColor: '#FFF',
    color: "#FFF",
    width: "100%",
    fontSize: 22,
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        borderColor: '#FFF',
        boxShadow: 'none',
    },
    '&:active': {
        boxShadow: 'none',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderColor: '#FFF',
    },
    '&:focus': {
        boxShadow: 'none',
    },
    '.MuiLoadingButton-loadingIndicator': {
        color: "#FFF",
    },
    '&.Mui-disabled': {
        borderColor: '#FFF',
        backgroundColor: "rgba(255, 255, 255, 0.4)"
    }
});

const StopButton = styled(LoadingButton)({
    backgroundColor: '#E74C3C',
    border: "none",
    color: "#FFF",
    width: "100%",
    fontSize: 22,
    '&:hover': {
        backgroundColor: '#E74C3C',
        border: "none",
        boxShadow: 'none',
    },
    '&:active': {
        boxShadow: 'none',
        backgroundColor: '#E74C3C',
        borderColor: '#FFF',
    },
    '&:focus': {
        boxShadow: 'none',
    },
    '.MuiLoadingButton-loadingIndicator': {
        color: "#FFF"
    },
    '&.Mui-disabled': {
        backgroundColor: '#F1948A',
        color: "rgba(255, 255, 255, 0.6)"
    }
});


const StartButton = styled(LoadingButton)({
    backgroundColor: '#52af77',
    border: "none",
    color: "#FFF",
    width: "100%",
    fontSize: 22,
    '&:hover': {
        backgroundColor: '#52af77',
        border: "none",
        boxShadow: 'none',
    },
    '&:active': {
        boxShadow: 'none',
        backgroundColor: '#52af77',
        borderColor: '#FFF',
    },
    '&:focus': {
        boxShadow: 'none',
    },
    '.MuiLoadingButton-loadingIndicator': {
        color: "#FFF"
    },
    '&.Mui-disabled': {
        backgroundColor: '#ABEBC6',
    }
});

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function ControlPage() {
    const router = useRouter();
    const userId = router.query?.uid;

    const State = {
        BEFORE_START: 0,
        STARTING: 1,
        RUNNING: 2,
        PAUSEING: 3,
        PAUSE: 4,
        STOPING: 5,
        STOP: 6
    };

    const [socket, setSocket] = React.useState(null);

    const [runState, setRunState] = React.useState(State.BEFORE_START);
    const [currentSpeed, setCurrentSpeed] = React.useState(0);
    const [preSetSpeed, setPreSetSpeed] = React.useState(0);

    const [openConfirmChangeSpeedDialog, setOpenConfirmChangeSpeedDialog] = React.useState(false);

    const speedChangeHandle = (e, newValue) => {
        setPreSetSpeed(newValue);
    }

    const speedChangeCommittedHandle = (e) => {
        if (runState === State.BEFORE_START) {
            if (socket) {
                socket.emit("set_speed", preSetSpeed);
            } else {
                console.warn("SocketIO disconnect");
            }
        } else {
            setOpenConfirmChangeSpeedDialog(true);
        }
    }

    const confirmChangeSpeedHandle = () => {
        setOpenConfirmChangeSpeedDialog(false);
        if (socket) {
            socket.emit("set_speed", preSetSpeed);
        } else {
            console.warn("SocketIO disconnect");
        }
    }

    const cancelChangeSpeedHandle = () => {
        setOpenConfirmChangeSpeedDialog(false);
        setPreSetSpeed(currentSpeed);
    }

    const startHandle = () => {
        setRunState(State.STARTING);

        setTimeout(() => {
            setRunState(State.RUNNING);
        }, 3000);
    }

    const pauseHandle = () => setRunState(State.PAUSEING);

    const stopHandle = () => {
        setRunState(State.STOPING);
        // router.push("/users/" + userId);
    }

    const [sensorValue, setSensorValue] = React.useState({
        heartRate: 0,
        distance: 0
    });
    const [distance, setDistance] = React.useState(0);

    React.useEffect(() => {
        if (socket) {
            return () => {
                socket.disconnect();
            }
        }

        const socketIo = SocketIO("http://localhost:3002", {
            transports: ['websocket']
        });
        setSocket(socketIo);

        socketIo.on("value_update", data => {
            console.log("New Data", data);

            setSensorValue(data);
        });

        socketIo.on("new_speed", newSpeed => {
            console.log("New Speed", newSpeed);

            setCurrentSpeed(newSpeed);
            setPreSetSpeed(newSpeed);
        });

        return () => {
            socketIo.disconnect();
        }
    }, []);

    return (
        <>
            <div className={style.contener}>
                <div className={style.topStatus}>
                    <div>
                        <div className={style.left}>
                            <ul>
                                <li>
                                    <div>
                                        <HartrateIcon />
                                    </div>
                                    <div>{sensorValue?.heartRate || "?"}</div>
                                    <div>bpm</div>
                                </li>
                                <li>
                                    <div>
                                        <RoadIcon />
                                    </div>
                                    <div>{sensorValue?.distance || "?"}</div>
                                    <div>km</div>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <div className={style.circleCenter}>
                                <div className={style.processBar}></div>
                                <div className={style.processContent}>
                                    <div className={style.processText}>
                                        <span>30</span>
                                        <span>%</span>
                                    </div>
                                    <div className={style.processTime}>00:20</div>
                                </div>
                            </div>
                        </div>
                        <div className={style.right}>
                            <ul>
                                <li>
                                    <div>
                                        <CalorieIcon />
                                    </div>
                                    <div>123</div>
                                    <div>kcal</div>
                                </li>
                                <li>
                                    <div>
                                        <FootIcon />
                                    </div>
                                    <div>1</div>
                                    <div>step</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={style.controlMainBox}>
                    <div className={style.controlLeft}>
                        <div>ความเร็ว : <span>{currentSpeed} km/h</span></div>
                        <div className={style.boxSlider}>
                            <Slider
                                value={preSetSpeed}
                                onChange={speedChangeHandle}
                                onChangeCommitted={speedChangeCommittedHandle}
                                valueLabelDisplay="auto"
                            />
                        </div>
                        {(runState == State.BEFORE_START || runState == State.STARTING) &&
                            <>
                                <div><StartButton loading={runState == State.STARTING} variant="contained" onClick={startHandle}>เริ่มการทำงาน</StartButton></div>
                            </>
                        }
                        {(runState == State.RUNNING || runState == State.PAUSEING || runState == State.PAUSE || runState == State.STOPING || runState == State.STOP) &&
                            <>
                                <div><PauseButton loading={runState == State.PAUSEING} disabled={runState == State.STOPING} variant="outlined" onClick={pauseHandle}>พักชั่วคราว</PauseButton></div>
                                <div><StopButton loading={runState == State.STOPING} disabled={runState == State.PAUSEING} variant="contained" onClick={stopHandle}>หยุดการทำงาน</StopButton></div>
                            </>
                        }
                    </div>
                    <div className={style.controlChart}>
                        <Chart
                            options={{
                                chart: {
                                    toolbar: {
                                        show: false,
                                    },
                                    foreColor: '#FFF',
                                },
                                stroke: {
                                    curve: 'smooth',
                                },
                                // colors: [ "#FFF" ],
                                grid: {
                                    borderColor: "#000",
                                },
                                tooltip: {
                                    enabled: false,
                                },
                                /*markers: {
                                    size: 4,
                                },*/
                                yaxis: {
                                    max: 160,
                                    min: 60,
                                }
                            }}
                            series={[
                                {
                                    name: "อัตราการเต้นของหัวใจ",
                                    type: 'area',
                                    data: ([{
                                        timestamp: 1,
                                        value: 96
                                    }, {
                                        timestamp: 2,
                                        value: 98
                                    }, {
                                        timestamp: 3,
                                        value: 100
                                    }, {
                                        timestamp: 4,
                                        value: 103
                                    }, {
                                        timestamp: 5,
                                        value: 110
                                    }]).map(a => ({
                                        x: a.timestamp,
                                        y: a.value
                                    }))
                                }
                            ]}
                            type="area"
                            height="100%"
                            style={{ height: "100%" }}
                        />
                    </div>
                </div>
            </div>


            <Dialog
                open={openConfirmChangeSpeedDialog}
                onClose={cancelChangeSpeedHandle}
            >
                <DialogTitle>ยืนยันการปรับความเร็ว?</DialogTitle>
                <DialogContent>
                    <DialogContentText>ความเร็วจะเปลี่ยนเป็น <b>{preSetSpeed} km/h</b> ยืนยันการเปลี่ยนความเร็วหรือไม่?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelChangeSpeedHandle}>ยกเลิก</Button>
                    <Button onClick={confirmChangeSpeedHandle} autoFocus>
                        ยืนยัน
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}