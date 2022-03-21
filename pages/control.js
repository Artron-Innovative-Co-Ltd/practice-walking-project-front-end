import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import Box from '@mui/material/Box';
import OriginalSlider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

// Icon
import HartrateIcon from '../public/images/cardiogram.svg';
import RoadIcon from '../public/images/road.svg';
import CalorieIcon from '../public/images/calories-calculator.svg';
import FootIcon from '../public/images/footsteps-silhouette-variant.svg';

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

const PauseButton = styled(Button)({
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
});

const StopButton = styled(Button)({
    backgroundColor: '#dc3545',
    border: "none",
    color: "#FFF",
    width: "100%",
    fontSize: 22,
    '&:hover': {
        backgroundColor: '#dc3545',
        border: "none",
        boxShadow: 'none',
    },
    '&:active': {
        boxShadow: 'none',
        backgroundColor: '#dc3545',
        borderColor: '#FFF',
    },
    '&:focus': {
        boxShadow: 'none',
    },
});

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Index() {
    const [currentSpeed, setCurrentSpeed] = React.useState(0);

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
                                    <div>123</div>
                                    <div>bpm</div>
                                </li>
                                <li>
                                    <div>
                                        <RoadIcon />
                                    </div>
                                    <div>1</div>
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
                                defaultValue={70}
                                valueLabelDisplay="auto"
                            />
                        </div>
                        <div><PauseButton variant="outlined">พักชั่วคราว</PauseButton></div>
                        <div><StopButton variant="contained">หยุดการทำงาน</StopButton></div>
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
        </>
    );
}