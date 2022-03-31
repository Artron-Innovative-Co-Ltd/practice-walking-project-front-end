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
import Grid from '@mui/material/Grid';

// Icon
import HartrateIcon from '../public/images/cardiogram.svg';
import RoadIcon from '../public/images/road.svg';
import CalorieIcon from '../public/images/calories-calculator.svg';
import FootIcon from '../public/images/footsteps-silhouette-variant.svg';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import SocketIO from 'socket.io-client';

import CallAPI from '../src/WebCallAPI';

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

const BackButton = styled(LoadingButton)({
    backgroundColor: '#F1C40F',
    border: "none",
    color: "#FFF",
    width: "100%",
    fontSize: 22,
    '&:hover': {
        backgroundColor: '#F1C40F',
        border: "none",
        boxShadow: 'none',
    },
    '&:active': {
        boxShadow: 'none',
        backgroundColor: '#F1C40F',
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

const zeroPad = (num, places) => String(num).padStart(places, '0')

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function ControlPage() {
    const router = useRouter();
    const userId = router.query?.uid;
    const { weight } = router.query; 
    const planTime = router.query?.time * 60;

    const State = {
        BEFORE_START: 0,
        STARTING: 1,
        RUNNING: 2,
        PAUSEING: 3,
        PAUSE: 4,
        STOPING: 5,
        STOP: 6
    };

    const [ socket, setSocket ] = React.useState(null);

    const [ logId, setLogId ] = React.useState(0);
    const [ timeRun, setTimeRun ] = React.useState(0);
    const [ heartRateLog, setHeartRateLog ] = React.useState([ ]);
    const [ runState, setRunState ] = React.useState(State.BEFORE_START);
    const [ currentSpeed, setCurrentSpeed ] = React.useState(0);
    const [ preSetSpeed, setPreSetSpeed ] = React.useState(0);
    const [ speedChangeing, setSpeedChangeing ] = React.useState(false);
    const [ timer, setTimer ] = React.useState(null);
    const [ logDetail, setLogDetail ] = React.useState([ ]);

    const [openConfirmChangeSpeedDialog, setOpenConfirmChangeSpeedDialog] = React.useState(false);

    const speedChangeHandle = (e, newValue) => {
        setPreSetSpeed(newValue);
    }

    const speedChangeCommittedHandle = (e) => {
        if (runState === State.BEFORE_START || runState === State.PAUSE) {
            if (socket) {
                // socket.emit("set_speed", preSetSpeed);
            } else {
                console.warn("SocketIO disconnect");
            }
            setSpeedChangeing(false);
        } else {
            setOpenConfirmChangeSpeedDialog(true);
        }
    }

    const startSpeedChangeHandle = () => {
        console.log("Start");
        setSpeedChangeing(true);
    }

    const confirmChangeSpeedHandle = () => {
        setOpenConfirmChangeSpeedDialog(false);
        if (socket) {
            socket.emit("control", {
                speed: preSetSpeed,
            });
        } else {
            console.warn("SocketIO disconnect");
        }
        setSpeedChangeing(false);
    }

    const cancelChangeSpeedHandle = () => {
        setOpenConfirmChangeSpeedDialog(false);
        setPreSetSpeed(currentSpeed);
    }

    const startHandle = () => {
        if (runState === State.BEFORE_START) {
            setRunState(State.STARTING);

            CallAPI({
                endpoint: "log?uid=" + userId,
                method: "POST",
                data: {
                    date_of_start: new Date().toISOString(),
                    weight: +weight
                }
            }).then(async ({ id }) => {
                socket.emit("control", {
                    speed: preSetSpeed,
                });
                setLogId(id);
                setRunState(State.RUNNING);
            }).catch(err => {
                console.log(err);
            });
        } else if (runState === State.PAUSE) {
            socket.emit("control", {
                speed: preSetSpeed,
            });
            setRunState(State.RUNNING);
        }
    }

    const pauseHandle = () => {
        socket.emit("control", {
            speed: 0,
        });
        setRunState(State.PAUSE);
    }

    const stopHandle = () => {
        socket.emit("control", {
            speed: 0,
        });
        setRunState(State.STOPING);
        // router.push("/users/" + userId);

        CallAPI({
            endpoint: "log/" + logId,
            method: "PUT",
            data: {
                date_of_end: new Date().toISOString(),
                control_log: JSON.stringify(logDetail),
                ended: 1
            }
        }).then(async ({ id }) => {
            setRunState(State.STOP);
        }).catch(err => {
            console.log(err);
        });
    }

    const [sensorValue, setSensorValue] = React.useState({
        heartRate: 0,
        distance: 0
    });

    React.useEffect(() => {
        let socketIo;
        if (!socket) {
            let hostname;
            if (typeof window !== 'undefined') {
                hostname = window.location.hostname;
            } else {
                hostname = "127.0.0.1";
            }
            // console.log(hostname);
                
            socketIo = SocketIO("http://" + hostname + ":3002", {
                transports: ['websocket']
            });
            setSocket(socketIo);
        } else {
            socketIo = socket;
        }

        return () => {
            socketIo.disconnect();
        }
    }, [ ]);

    React.useEffect(() => {
        if (!socket) {
            return;
        }

        socket.off("value_update");
        socket.on("value_update", data => {
            console.log("New Data", data);
            console.log("runState", runState);

            setSensorValue(data);
            if ((data?.speed > 0 || data?.distance > 0) && runState === State.BEFORE_START) {
                socket.emit("control", {
                    speed: 0,
                    reset: true
                });
            } else {
                setCurrentSpeed(data?.speed || 0);
                /*if ((!speedChangeing) && runState !== State.BEFORE_START) {
                    setPreSetSpeed(data?.speed || 0);
                }*/
            }
            if (data?.emergency === 1 && runState === State.RUNNING) {
                stopHandle();
            }
        });
    }, [ runState, socket, speedChangeing ]); 

    React.useEffect(() => {
        if (runState !== State.RUNNING) {
            return;
        }

        let newLogDetail = [ ...logDetail ];
        newLogDetail.push({
            time: new Date(),
            heartRate: sensorValue?.heartRate,
            distance: sensorValue?.distance,
            speed: sensorValue?.speed,
        });
        setLogDetail(newLogDetail);

        let newHeartRateLog = [ ...heartRateLog ];
        newHeartRateLog.push({
            x: new Date(),
            y: sensorValue?.heartRate
        });
        setHeartRateLog(newHeartRateLog);
    }, [ sensorValue ]); 



    React.useEffect(() => {
        if (runState === State.RUNNING && ((planTime - timeRun) > 0)) {
            const timer_init = setTimeout(() => {
                const newTimeRun = timeRun + 1;
                setTimeRun(newTimeRun);
                if ((planTime - newTimeRun) <= 0) {
                    stopHandle();
                }
            }, 1000);
            setTimer(timer_init);
        } else {
            clearTimeout(timer);
            setTimer(null);
        }

    }, [ runState, timeRun ]); 

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
                                        <span>{Math.round(timeRun / planTime  * 100)}</span>
                                        <span>%</span>
                                    </div>
                                    <div className={style.processTime}>{zeroPad(Math.floor((planTime - timeRun) / 60), 2)}:{zeroPad((planTime - timeRun) % 60, 2)}</div>
                                </div>
                            </div>
                        </div>
                        <div className={style.right}>
                            <ul>
                                <li>
                                    <div>
                                        <CalorieIcon />
                                    </div>
                                    <div>{((sensorValue?.distance || 0) * weight * 1.036).toFixed(2)}</div>
                                    <div>kcal</div>
                                </li>
                                <li>
                                    <div>
                                        <FootIcon />
                                    </div>
                                    <div>{(((sensorValue?.distance || 0) / 0.79) * 1000).toFixed(2)}</div>
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
                            {runState !== State.STOP && <Slider
                                value={preSetSpeed}
                                onChange={speedChangeHandle}
                                onChangeCommitted={speedChangeCommittedHandle}
                                valueLabelDisplay="auto"
                                min={0}
                                max={2}
                                step={0.1}
                                onDragEnter={startSpeedChangeHandle}
                            />}
                        </div>
                        {(runState == State.BEFORE_START || runState == State.STARTING || runState == State.PAUSE) &&
                            <>
                                <div><StartButton 
                                    loading={runState == State.STARTING} 
                                    variant="contained" 
                                    onClick={startHandle}
                                    disabled={preSetSpeed === 0}
                                >เริ่มการทำงาน</StartButton></div>
                            </>
                        }
                        {(runState == State.RUNNING) &&
                            <>
                                <div><PauseButton 
                                    loading={runState == State.PAUSEING} 
                                    disabled={runState == State.STOPING} 
                                    variant="outlined" 
                                    onClick={pauseHandle}
                                >พักชั่วคราว</PauseButton></div>
                            </>
                        }
                        {(runState == State.RUNNING || runState == State.PAUSEING || runState == State.PAUSE) &&
                            <>
                                <div><StopButton 
                                    loading={runState == State.STOPING} 
                                    disabled={runState == State.PAUSEING} 
                                    variant="contained" 
                                    onClick={stopHandle}
                                >หยุดการทำงาน</StopButton></div>
                            </>
                        }
                        {(runState == State.STOP) &&
                            <>
                                <div>
                                    <Link href={'/users/' + userId} passHref>
                                        <BackButton 
                                            variant="contained" 
                                        >ย้อนกลับ</BackButton>
                                    </Link>
                                </div>
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
                                yaxis: {
                                    max: 160,
                                    min: 60,
                                },
                                xaxis: {
                                    type: 'datetime',
                                    labels: {
                                      format: 'HH:mm:ss'
                                    }
                                }
                            }}
                            series={[
                                {
                                    name: "อัตราการเต้นของหัวใจ",
                                    type: 'area',
                                    data: heartRateLog
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
                    <Button onClick={confirmChangeSpeedHandle} autoFocus>ยืนยัน</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={sensorValue?.emergency === 1}
                onClose={() => 1}
            >
                <DialogTitle>
                    <Grid container alignItems={"center"}>
                        <ErrorOutlineIcon sx={{ color: "rgb(239, 83, 80)" }} />
                        <Grid item pl={1} sx={{ color: "rgb(239, 83, 80)" }}>หยุดฉุกเฉิน</Grid>
                    </Grid>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>การทำกายภาพรอบนี้จะถูกยกเลิกอัตโนมัติ ปลดสวิตช์ฉุกเฉินเพื่อดำเนินการต่อ</DialogContentText>
                </DialogContent>
            </Dialog>
        </>
    );
}