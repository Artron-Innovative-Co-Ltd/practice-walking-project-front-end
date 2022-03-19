import React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListSubheader from '@mui/material/ListSubheader';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';

import PhotoCamera from '@mui/icons-material/PhotoCamera';
import SendIcon from '@mui/icons-material/Send';
import DashboardIcon from '@mui/icons-material/Dashboard';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import AppBarCustom from '../../src/AppBarCustom';


function BoxInfo({ title, value, unit }) {
    return (
        <Paper sx={{ display: "flex", flexDirection: "column", minHeight: 200, padding: 2 }}>
            <Typography variant="h5" gutterBottom component="div">{title}</Typography>
            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                <div>
                    <Typography variant="h3" gutterBottom component="span">{value}</Typography>
                    <Typography variant="h5" gutterBottom component="span" sx={{ paddingLeft: 2 }}>{unit}</Typography>
                </div>
            </Box>
        </Paper>
    )
}

export default function UserDetail() {
    const [tap, setTap] = React.useState(0);

    const handleChangeTap = (event, newValue) => {
        console.log(newValue);
        setTap(newValue);
    };

    const [timeRun, setTimeRun] = React.useState(5);

    const handleChangeTimeRun = (event, newValue) => {
        if (newValue == null) return;

        setTimeRun(newValue);
    }

    const [ selectedIndex, setSelectedIndex ] = React.useState(0);

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };

    const options = {
        chart: {
            height: "100%",
            type: 'area',
            toolbar: {
                show: false,
            }
        },
        /*
        dataLabels: {
            enabled: true
        },
        stroke: {
            curve: 'smooth',
            width: 1,
        },
        xaxis: {
            type: 'datetime',*/
            /* categories: (data || []).map(a => a.timestamp), */
            /*labels: {
                show: true,
                datetimeUTC: false,
            },
            axisBorder: {
                show: true,
            },
            axisTicks: {
                show: true,
            },
            tooltip: {
                enabled: false,
            }
        },
        yaxis: {
            labels: {
                show: true,
                formatter: (val, index) => val.toFixed(2) + " °C"
            },
            axisBorder: {
                show: true,
            },
            axisTicks: {
                show: true,
            },
        },
        grid: {
            show: false,
        },
        tooltip: {
            x: {
                format: 'dd/MM/yy HH:mm:ss'
            },*/
            /*custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                let t = 0;
                try {
                    t = data[dataPointIndex].timestamp;
                } catch(e) {
                }
                // console.log(w.globals.labels, t, dataPointIndex, (data || []).map(a => a.timestamp));
                return `<div class="arrow_box"><span>${new Date(t).toLocaleTimeString()}: ${series[seriesIndex][dataPointIndex]} °C</span></div>`
            }*/
        /*},
        colors: [
            "#00ab55",
            "#FF0000",
            "#0000FF"
        ],*/
        fill: {
            type: ['gradient', 'solid', 'solid'],
            opacity: [0.1, 1, 1],
        },
    };

    return (
        <>
            <AppBarCustom
                title={"สนธยา นงนุช"}
                backLink={"/users"}
            />

            <Grid container spacing={3} p={3}>
                <Grid item sx={{ textAlign: "center" }} pr={3}>
                    <Paper sx={{ marginBottom: 2, overflow: "hidden" }}>
                        <Image
                            src="/elolnnnn.jpg"
                            alt="Picture of the author"
                            width={200}
                            height={200}
                            layout="responsive"
                        />
                    </Paper>
                    <Button variant="contained" startIcon={<PhotoCamera />} disableElevation>เปลี่ยนรูปโปรไฟล์</Button>
                </Grid>
                <Grid item xs={12} lg={10}>
                    <Grid container spacing={3}>
                        <Grid item xs={6} sm={4} lg={3}>
                            <BoxInfo
                                title={"อายุ"}
                                value={12}
                                unit={"ปี"}
                            />
                        </Grid>
                        <Grid item xs={6} sm={4} lg={3}>
                            <BoxInfo
                                title={"น้ำหนัก"}
                                value={54}
                                unit={"กิโลกรัม"}
                            />
                        </Grid>
                        <Grid item xs={6} sm={4} lg={3}>
                            <BoxInfo
                                title={"ส่วนสูง"}
                                value={176}
                                unit={"เซ็นติเมตร"}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tap} onChange={handleChangeTap} aria-label="basic tabs example">
                        <Tab label="เริ่มกายภาพบำบัด" />
                        <Tab label="ประวัติการกายภาพ" />
                    </Tabs>
                </Box>
                <Box>
                    {tap === 0 && <Grid container spacing={3} p={3} alignItems="center">
                        <Grid item flexGrow={1}>
                            <Grid container spacing={3} dir="column">
                                <Grid item xs={12}>
                                    <Typography variant="body1" gutterBottom component="div">น้ำหนัก</Typography>
                                    <TextField
                                        label=""
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1" gutterBottom component="div">ระยะเวลา</Typography>
                                    <ToggleButtonGroup
                                        color="primary"
                                        value={timeRun}
                                        exclusive
                                        onChange={handleChangeTimeRun}
                                    >
                                        <ToggleButton value={5}>5 นาที</ToggleButton>
                                        <ToggleButton value={10}>10 นาที</ToggleButton>
                                        <ToggleButton value={20}>20 นาที</ToggleButton>
                                        <ToggleButton value={30}>30 นาที</ToggleButton>
                                        <ToggleButton value={0}>กำหนดเอง</ToggleButton>
                                    </ToggleButtonGroup>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" endIcon={<SendIcon />}>บันทึกและเริ่ม</Button>
                        </Grid>
                    </Grid>}
                    {tap == 1 && <Grid container spacing={3} p={3}>
                        <Grid item xs={12} sm={4} lg={3} pr={2}>
                            <Paper>
                                <List component="nav">
                                    <ListItemButton
                                        selected={selectedIndex === 0}
                                        onClick={(event) => handleListItemClick(event, 0)}
                                    >
                                        <ListItemIcon>
                                            <DashboardIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="ภาพรวม" />
                                    </ListItemButton>
                                </List>
                                <Divider />
                                <List
                                    component="nav"
                                    subheader={
                                        <ListSubheader component="div">
                                            ประวัติรายครั้ง
                                        </ListSubheader>
                                    }
                                >
                                    {([
                                        {
                                            date: "15/3/2565",
                                            runTime: 10
                                        },
                                        {
                                            date: "16/3/2565",
                                            runTime: 8
                                        },
                                        {
                                            date: "17/3/2565",
                                            runTime: 12
                                        },
                                    ]).map((item, index) =>
                                        <ListItemButton
                                            selected={selectedIndex === (index + 1)}
                                            onClick={(event) => handleListItemClick(event, index + 1)}
                                        >
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: "#2499ef" }}>{index + 1}</Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={`${item?.date || "Unknow"} (${item?.runTime || "Unknow"} นาที)`} />
                                        </ListItemButton>
                                    )}
                                </List>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={8} lg={9}>
                            {selectedIndex === 0 && <Grid container spacing={3}>
                                <Grid item xs={6} lg={3}>
                                    <BoxInfo
                                        title={"ระยะทางรวม"}
                                        value={"15"}
                                        unit={"km"}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={3}>
                                    <BoxInfo
                                        title={"จำนวนก้าวรวม"}
                                        value={"15"}
                                        unit={"Step"}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={3}>
                                    <BoxInfo
                                        title={"เวลารวม"}
                                        value={"180"}
                                        unit={"นาที"}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={3}>
                                    <BoxInfo
                                        title={"เผาผลานแคลเลอรี่รวม"}
                                        value={"15"}
                                        unit={"kcal"}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Paper sx={{ padding: 2}}>
                                        <Chart
                                            options={{
                                                chart: {
                                                    height: "100%",
                                                    type: 'area',
                                                    toolbar: {
                                                        show: false,
                                                    }
                                                }
                                            }}
                                            series={[
                                                {
                                                    name: "เวลา",
                                                    type: 'area',
                                                    data: ([{
                                                        timestamp: 1,
                                                        value: 10
                                                    },{
                                                        timestamp: 2,
                                                        value: 12
                                                    }]).map(a => ({
                                                        x: a.timestamp,
                                                        y: a.value
                                                    }))
                                                },
                                                {
                                                    name: "น้ำหนัก",
                                                    type: 'area',
                                                    data: ([{
                                                        timestamp: 1,
                                                        value: 10
                                                    },{
                                                        timestamp: 2,
                                                        value: 12
                                                    }]).map(a => ({
                                                        x: a.timestamp,
                                                        y: a.value
                                                    }))
                                                },
                                                {
                                                    name: "ระยะทาง",
                                                    type: 'area',
                                                    data: ([{
                                                        timestamp: 1,
                                                        value: 10
                                                    },{
                                                        timestamp: 2,
                                                        value: 12
                                                    }]).map(a => ({
                                                        x: a.timestamp,
                                                        y: a.value
                                                    }))
                                                },
                                                {
                                                    name: "จำนวนก้าว",
                                                    type: 'area',
                                                    data: ([{
                                                        timestamp: 1,
                                                        value: 10
                                                    },{
                                                        timestamp: 2,
                                                        value: 12
                                                    }]).map(a => ({
                                                        x: a.timestamp,
                                                        y: a.value
                                                    }))
                                                },
                                                {
                                                    name: "ความเร็ว",
                                                    type: 'area',
                                                    data: ([{
                                                        timestamp: 1,
                                                        value: 10
                                                    },{
                                                        timestamp: 2,
                                                        value: 12
                                                    }]).map(a => ({
                                                        x: a.timestamp,
                                                        y: a.value
                                                    }))
                                                },
                                                {
                                                    name: "แคลเลอรี่",
                                                    type: 'area',
                                                    data: ([{
                                                        timestamp: 1,
                                                        value: 10
                                                    },{
                                                        timestamp: 2,
                                                        value: 12
                                                    }]).map(a => ({
                                                        x: a.timestamp,
                                                        y: a.value
                                                    }))
                                                },
                                                {
                                                    name: "อัตราการเต้นของหัวใจ",
                                                    type: 'area',
                                                    data: ([{
                                                        timestamp: 1,
                                                        value: 10
                                                    },{
                                                        timestamp: 2,
                                                        value: 12
                                                    }]).map(a => ({
                                                        x: a.timestamp,
                                                        y: a.value
                                                    }))
                                                },
                                            ]}
                                            type="area"
                                            height="100%"
                                            style={{ height: 300 }}
                                        />
                                    </Paper>
                                </Grid>
                            </Grid>}
                            {selectedIndex > 0 && <Grid container spacing={3}>
                                <Grid item xs={6} lg={3}>
                                    <BoxInfo
                                        title={"น้ำหนัก"}
                                        value={"15"}
                                        unit={"kg"}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={3}>
                                    <BoxInfo
                                        title={"อัตราการเต้นของหัวใจเฉลี่ย"}
                                        value={"15"}
                                        unit={"bmp"}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={3}>
                                    <BoxInfo
                                        title={"ความเร็วเฉลี่ย"}
                                        value={"15"}
                                        unit={"km"}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={3}>
                                    <BoxInfo
                                        title={"การเผาผลานเฉลี่ย"}
                                        value={"15"}
                                        unit={"kcal"}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={3}>
                                    <BoxInfo
                                        title={"ระยะทาง"}
                                        value={"15"}
                                        unit={"kcal"}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={3}>
                                    <BoxInfo
                                        title={"เวลาเริ่ม"}
                                        value={"15:00"}
                                        unit={"น."}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={3}>
                                    <BoxInfo
                                        title={"เวลาจบ"}
                                        value={"15:30"}
                                        unit={"น."}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={3}>
                                    <BoxInfo
                                        title={"รวมเวลา"}
                                        value={"30"}
                                        unit={"นาที"}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Paper sx={{ padding: 2}}>
                                        <Chart
                                            options={{
                                                chart: {
                                                    height: "100%",
                                                    type: 'area',
                                                    toolbar: {
                                                        show: false,
                                                    }
                                                }
                                            }}
                                            series={[
                                                {
                                                    name: "ความเร็ว",
                                                    type: 'area',
                                                    data: ([{
                                                        timestamp: 1,
                                                        value: 10
                                                    },{
                                                        timestamp: 2,
                                                        value: 12
                                                    }]).map(a => ({
                                                        x: a.timestamp,
                                                        y: a.value
                                                    }))
                                                },
                                                {
                                                    name: "อัตราการเต้นของหัวใจ",
                                                    type: 'area',
                                                    data: ([{
                                                        timestamp: 1,
                                                        value: 10
                                                    },{
                                                        timestamp: 2,
                                                        value: 12
                                                    }]).map(a => ({
                                                        x: a.timestamp,
                                                        y: a.value
                                                    }))
                                                },
                                                {
                                                    name: "ระยะทาง",
                                                    type: 'area',
                                                    data: ([{
                                                        timestamp: 1,
                                                        value: 10
                                                    },{
                                                        timestamp: 2,
                                                        value: 12
                                                    }]).map(a => ({
                                                        x: a.timestamp,
                                                        y: a.value
                                                    }))
                                                },
                                                {
                                                    name: "การเผาผลานเคอรี่",
                                                    type: 'area',
                                                    data: ([{
                                                        timestamp: 1,
                                                        value: 10
                                                    },{
                                                        timestamp: 2,
                                                        value: 12
                                                    }]).map(a => ({
                                                        x: a.timestamp,
                                                        y: a.value
                                                    }))
                                                },
                                            ]}
                                            type="area"
                                            height="100%"
                                            style={{ height: 300 }}
                                        />
                                    </Paper>
                                </Grid>
                            </Grid>}
                        </Grid>
                    </Grid>}
                </Box>
            </Box>
        </>
    );
}