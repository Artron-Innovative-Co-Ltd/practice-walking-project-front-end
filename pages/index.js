import React from 'react';
import Box from '@mui/material/Box';
import style from '../styles/index.module.scss';
import Head from 'next/head';

// Icon
import HartrateIcon from '../public/images/cardiogram.svg';
import RoadIcon from '../public/images/road.svg';
import CalorieIcon from '../public/images/calories-calculator.svg';
import FootIcon from '../public/images/footsteps-silhouette-variant.svg';

export default function Index() {
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
            </div>
        </>
    );
}