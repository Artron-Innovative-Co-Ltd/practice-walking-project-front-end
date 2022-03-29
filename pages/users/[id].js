import React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Link from 'next/link'
import { useRouter } from 'next/router';
import axios from 'axios';

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
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import PhotoCamera from '@mui/icons-material/PhotoCamera';
import SendIcon from '@mui/icons-material/Send';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EditIcon from '@mui/icons-material/Edit';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import AppBarCustom from '../../src/AppBarCustom';
import CalculateAge from '../../src/CalculateAge';
import CallAPI from '../../src/WebCallAPI';

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

const TextFieldCustom = props => <TextField
    variant="outlined"
    InputLabelProps={{
        shrink: true,
    }}
    sx={{ width: "100%" }}
    {...props}
/>;

const MeanSample = (data) => {
    let sum = 0.0, mean = 0.0;
  
    sum = 0;
    mean = 0;
    for (let i=0;i<data.length;i++) {
      sum += data[i];
    }
    mean = sum / data.length;
  
    // Calc SD
    sum = 0.0;
    for (let i=0;i<data.length;i++) {
      sum += Math.pow(data[i] - mean, 2);
    }
    let SD = Math.sqrt(sum / (data.length - 1));
    
  
    // Calc Normal Mean
    sum = 0;
    let windowMin = mean - SD;
    let windowMax = mean + SD;
    let nGot = 0;
    let a = 0;
    for (let i=0;i<data.length;i++) {
      a = data[i];
      if ((a >= windowMin) && (a <= windowMax)) { // Check value are window
        sum += a;
        nGot++;
      }
    }
    mean = sum / nGot;
    return mean;
}

const zeroPad = (num, places) => String(num).padStart(places, '0');

export default function UserDetail({ userInfoFromServer, logInfoFromServer }) {
    const router = useRouter();

    const [ userInfo, setUserInfo ] = React.useState(userInfoFromServer);

    const [ openEditUserDialog, setOpenEditUserDialog ] = React.useState(false);
    const openEditUserDialogHandle = () => setOpenEditUserDialog(true);
    const closeEditUserDialogHandle = () => setOpenEditUserDialog(false);

    const [ editUserInfo, setEditUserInfo ] = React.useState(Object.assign(userInfoFromServer, {
        date_of_birth: new Date(userInfoFromServer?.date_of_birth).toISOString().split('T')[0]
    }));

    const userInfoChangeHandle = key => e => {
        let newUserInfo = { ...editUserInfo };
        newUserInfo[key] = e.target.value;
        setEditUserInfo(newUserInfo)
    }

    const editUserHandle = e => {
        CallAPI({
            endpoint: "users/" + userInfo?.id,
            method: "PUT",
            data: {
                name: editUserInfo.name,
                date_of_birth: new Date(editUserInfo.date_of_birth).toISOString(),
                height: +editUserInfo.height
            },
            auth: false
        }).then(() => {
            setUserInfo(Object.assign(userInfo, editUserInfo));
            setOpenEditUserDialog(false);
        }).catch(err => {
            console.log(err);
        });
    }

    const [tap, setTap] = React.useState(0);

    const handleChangeTap = (event, newValue) => {
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


    const [ showDeleteUserDialog, setShowDeleteUserDialog] = React.useState(false);
    const handleCloseDeleteUserDialog = () => {
        setShowDeleteUserDialog(false);
    };

    const handleClickDelete = () => {
        setShowDeleteUserDialog(true);
    };

    const handleClickDeleteUser = () => {
        CallAPI({
            endpoint: "users/" + userInfo?.id,
            method: "DELETE",
        }).then(() => {
            router.push("/users");
        }).catch(err => {
            console.error(err);
        })
    };

    const handleClickUploadNewImage = async () => {
        let inp = document.createElement("input");
        inp.setAttribute("type", "file");
        inp.setAttribute("accept", "image/\*");
        inp.addEventListener("change", async e => {
            /*if (props.data?.image) {
                await fetch(`/api/upload/${props.data?.image}`, {
                    method: "DELETE",
                });
            }*/

            const formData = new FormData();
            formData.append("image", e.target.files[0]);

            try {
                let uploadImage = await axios.request({
                    method: "POST",
                    url: "/api/upload",
                    headers: {
                        "content-type": "multipart/form-data",
                    },
                    data: formData,
                    onUploadProgress: p => {
                        console.log("Image Upload Progress", p.loaded / p.total * 100.0);
                    }
                });

                if (uploadImage.status !== 200) {
                    throw uploadImage.status;
                }

                CallAPI({
                    endpoint: "users/" + userInfo?.id,
                    method: "PUT",
                    data: {
                        image: uploadImage.data.file,
                    },
                    auth: false
                }).then(() => {
                    let newUserInfo = { ...userInfo };
                    newUserInfo.image = uploadImage.data.file;
                    setUserInfo(newUserInfo);
                }).catch(err => {
                    console.log(err);
                });
            } catch (e) {
                console.log(e);
            }
        })
        inp.click();
    }

    const [ weight, setWeight ] = React.useState("");
    const weightChangeHandle = e => setWeight(+e.target.value);

    const totalDistance = logInfoFromServer.map(logItem => {
        const controlLog = JSON.parse(logItem?.control_log);
        const distance = +controlLog[controlLog.length - 1].distance;
        return distance;
    }).reduce((partialSum, a) => partialSum + a, 0);

    const totalRunTimeInSec = logInfoFromServer.map(logItem => {
        const controlLog = JSON.parse(logItem?.control_log);
        const logTimeUseInSec = (new Date(controlLog[controlLog.length - 1]?.time).getTime() / 1000) - (new Date(controlLog[0]?.time).getTime() / 1000);
        return logTimeUseInSec;
    }).reduce((partialSum, a) => partialSum + a, 0);

    const totalCalorie = logInfoFromServer.map(logItem => {
        const controlLog = JSON.parse(logItem?.control_log);
        const distance = +controlLog[controlLog.length - 1].distance;
        const weight = logItem.weight;
        return distance * weight * 1.036;
    }).reduce((partialSum, a) => partialSum + a, 0);

    const logSelect = logInfoFromServer?.[selectedIndex - 1];
    const controlLog = JSON.parse(logInfoFromServer?.[selectedIndex - 1]?.control_log || "[]");
    const logTimeUseInSec = (new Date(controlLog[controlLog.length - 1]?.time).getTime() / 1000) - (new Date(controlLog[0]?.time).getTime() / 1000);
    
    return (
        <>
            <AppBarCustom
                title={userInfo?.name || "?"}
                handleClickEdit={openEditUserDialogHandle}
                handleClickDelete={handleClickDelete}
                backLink={"/users"}
            />

            <Grid container spacing={3} p={3}>
                <Grid item sx={{ textAlign: "center" }} pr={3}>
                    <Paper sx={{ marginBottom: 2, overflow: "hidden" }}>
                        <Image
                            src={(userInfo?.image && ("/api/upload/" + userInfo?.image)) || "/user.png"}
                            alt={userInfo?.name || ""}
                            width={200}
                            height={200}
                            layout="responsive"
                        />
                    </Paper>
                    <Button variant="contained" startIcon={<PhotoCamera />} onClick={handleClickUploadNewImage} disableElevation>เปลี่ยนรูปโปรไฟล์</Button>
                </Grid>
                <Grid item flexGrow={1}>
                    <Grid container spacing={3}>
                        <Grid item xs={6} sm={4} lg={3}>
                            <BoxInfo
                                title={"อายุ"}
                                value={CalculateAge(userInfo?.date_of_birth || 0)}
                                unit={"ปี"}
                            />
                        </Grid>
                        {logInfoFromServer.length > 0 && <Grid item xs={6} sm={4} lg={3}>
                            <BoxInfo
                                title={"น้ำหนัก"}
                                value={logInfoFromServer?.[logInfoFromServer.length -1]?.weight || "?"}
                                unit={"kg"}
                            />
                        </Grid>}
                        <Grid item xs={6} sm={4} lg={3}>
                            <BoxInfo
                                title={"ส่วนสูง"}
                                value={userInfo?.height || "?"}
                                unit={"cm"}
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
                                        value={weight}
                                        onChange={weightChangeHandle}
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
                            <Link href={{ pathname: '/control', query: { 
                                uid: userInfo?.id || 0,
                                weight,
                                time: timeRun
                            }}} passHref>
                                <Button 
                                    variant="contained" 
                                    endIcon={<SendIcon />}
                                    component="a"
                                >บันทึกและเริ่ม</Button>
                            </Link>
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
                                    {logInfoFromServer.map((item, index) =>
                                        <ListItemButton
                                            selected={selectedIndex === (index + 1)}
                                            onClick={(event) => handleListItemClick(event, index + 1)}
                                        >
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: "#2499ef" }}>{index + 1}</Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={`${new Date(item?.date_of_start).toLocaleDateString() || "Unknow"} (${(raw_control_log => {
                                                            const controlLog = JSON.parse(raw_control_log);
                                                            const logTimeUseInSec = (new Date(controlLog[controlLog.length - 1]?.time).getTime() / 1000) - (new Date(controlLog[0]?.time).getTime() / 1000);
                                                            return (Math.round(logTimeUseInSec + 1) / 60).toFixed(0);
                                                        })(item?.control_log)} นาที)`} />
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
                                        value={totalDistance.toFixed(2)}
                                        unit={"km"}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={3}>
                                    <BoxInfo
                                        title={"จำนวนก้าวรวม"}
                                        value={(((totalDistance || 0) / 0.79) * 1000).toFixed(0)}
                                        unit={"Step"}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={3}>
                                    <BoxInfo
                                        title={"เวลารวม"}
                                        value={zeroPad(Math.floor(totalRunTimeInSec / 60), 2) + ":" + zeroPad(Math.ceil(totalRunTimeInSec) % 60, 2)}
                                        unit={"นาที"}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={3}>
                                    <BoxInfo
                                        title={"เผาผลานแคลเลอรี่รวม"}
                                        value={totalCalorie.toFixed(0)}
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
                                                },
                                                xaxis: {
                                                    type: 'datetime',
                                                    labels: {
                                                      format: 'dd/mm/yyyy'
                                                    }
                                                }
                                            }}
                                            series={[
                                                {
                                                    name: "เวลา",
                                                    type: 'area',
                                                    data: logInfoFromServer.map(a => ({
                                                        x: new Date(a.date_of_start),
                                                        y: (raw_control_log => {
                                                            const controlLog = JSON.parse(raw_control_log);
                                                            const logTimeUseInSec = (new Date(controlLog[controlLog.length - 1]?.time).getTime() / 1000) - (new Date(controlLog[0]?.time).getTime() / 1000);
                                                            return (Math.round(logTimeUseInSec + 1) / 60).toFixed(0);
                                                        })(a.control_log)
                                                    }))
                                                },
                                                {
                                                    name: "น้ำหนัก",
                                                    type: 'area',
                                                    data: logInfoFromServer.map(a => ({
                                                        x: new Date(a.date_of_start),
                                                        y: (+a.weight).toFixed(0)
                                                    }))
                                                },
                                                {
                                                    name: "ระยะทาง",
                                                    type: 'area',
                                                    data: logInfoFromServer.map(a => ({
                                                        x: new Date(a.date_of_start),
                                                        y: (raw_control_log => {
                                                            const controlLog = JSON.parse(raw_control_log);
                                                            const distance = +controlLog[controlLog.length - 1].distance;
                                                            return distance.toFixed(2);
                                                        })(a.control_log)
                                                    }))
                                                },
                                                {
                                                    name: "จำนวนก้าว",
                                                    type: 'area',
                                                    data: logInfoFromServer.map(a => ({
                                                        x: new Date(a.date_of_start),
                                                        y: (raw_control_log => {
                                                            const controlLog = JSON.parse(raw_control_log);
                                                            const distance = +controlLog[controlLog.length - 1].distance;
                                                            return ((distance / 0.79) * 1000).toFixed(0);
                                                        })(a.control_log)
                                                    }))
                                                },
                                                {
                                                    name: "ความเร็ว",
                                                    type: 'area',
                                                    data: logInfoFromServer.map(a => ({
                                                        x: new Date(a.date_of_start),
                                                        y: (raw_control_log => {
                                                            const controlLog = JSON.parse(raw_control_log);
                                                            const speed = MeanSample(controlLog.map(i => +i.speed));
                                                            return speed.toFixed(0);
                                                        })(a.control_log)
                                                    }))
                                                },
                                                {
                                                    name: "แคลเลอรี่",
                                                    type: 'area',
                                                    data: logInfoFromServer.map(a => ({
                                                        x: new Date(a.date_of_start),
                                                        y: ((raw_control_log, logItem) => {
                                                            const controlLog = JSON.parse(raw_control_log);
                                                            const distance = +controlLog[controlLog.length - 1].distance;
                                                            const weight = logItem.weight;
                                                            return (distance * weight * 1.036).toFixed(0);
                                                        })(a.control_log, a)
                                                    }))
                                                },
                                                {
                                                    name: "อัตราการเต้นของหัวใจ",
                                                    type: 'area',
                                                    data: logInfoFromServer.map(a => ({
                                                        x: new Date(a.date_of_start),
                                                        y: (raw_control_log => {
                                                            const controlLog = JSON.parse(raw_control_log);
                                                            const heartRate = MeanSample(controlLog.map(i => +i.heartRate));
                                                            return heartRate.toFixed(0);
                                                        })(a.control_log)
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
                                        value={logSelect?.weight || "?"}
                                        unit={"kg"}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={3}>
                                    <BoxInfo
                                        title={"อัตราการเต้นของหัวใจเฉลี่ย"}
                                        value={MeanSample(controlLog.map(i => +i?.heartRate)).toFixed(0)}
                                        unit={"bmp"}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={3}>
                                    <BoxInfo
                                        title={"ความเร็วเฉลี่ย"}
                                        value={MeanSample(controlLog.map(i => +i?.speed)).toFixed(2)}
                                        unit={"km"}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={3}>
                                    <BoxInfo
                                        title={"การเผาผลาน"}
                                        value={(controlLog[controlLog.length - 1]?.distance * logSelect?.weight * 1.036).toFixed(2)}
                                        unit={"kcal"}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={3}>
                                    <BoxInfo
                                        title={"ระยะทาง"}
                                        value={(+controlLog[controlLog.length - 1]?.distance).toFixed(3)}
                                        unit={"km"}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={3}>
                                    <BoxInfo
                                        title={"เวลาเริ่ม"}
                                        value={new Date(controlLog[0]?.time).toLocaleTimeString()}
                                        unit={""}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={3}>
                                    <BoxInfo
                                        title={"เวลาจบ"}
                                        value={new Date(new Date(controlLog[controlLog.length - 1]?.time).getTime() + 1000).toLocaleTimeString()}
                                        unit={""}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={3}>
                                    <BoxInfo
                                        title={"รวมเวลา"}
                                        value={zeroPad(Math.floor(logTimeUseInSec / 60), 2) + ":" + zeroPad(Math.ceil(logTimeUseInSec) % 60, 2)}
                                        unit={""}
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
                                                    name: "ความเร็ว",
                                                    type: 'area',
                                                    data: controlLog.map(a => ({
                                                        x: new Date(a?.time),
                                                        y: a.speed
                                                    }))
                                                },
                                                {
                                                    name: "อัตราการเต้นของหัวใจ",
                                                    type: 'area',
                                                    data: controlLog.map(a => ({
                                                        x: new Date(a?.time),
                                                        y: a.heartRate
                                                    }))
                                                },
                                                {
                                                    name: "ระยะทาง",
                                                    type: 'area',
                                                    data: controlLog.map(a => ({
                                                        x: new Date(a?.time),
                                                        y: a.distance
                                                    }))
                                                },
                                                {
                                                    name: "การเผาผลานเคอรี่",
                                                    type: 'area',
                                                    data: controlLog.map(a => ({
                                                        x: new Date(a?.time),
                                                        y: (+a.distance * +logSelect?.weight * 1.036).toFixed(2)
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

            {/* Dialog */}
            <Dialog
                fullWidth={true}
                maxWidth={"sm"}
                open={openEditUserDialog}
                onClose={closeEditUserDialogHandle}
            >
                <DialogTitle>แก้ไขข้อมูลผู้ใช้</DialogTitle>
                <DialogContent>
                    <Box pt={3}>
                        <TextFieldCustom
                            label="ชื่อ-นามสกุล"
                            type="text"
                            value={editUserInfo?.name}
                            onChange={userInfoChangeHandle("name")}
                        />
                    </Box>
                    <Box pt={3}>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <TextFieldCustom
                                    label="วัน เดือน ปีเกิด"
                                    type="date"
                                    value={editUserInfo?.date_of_birth}
                                    onChange={userInfoChangeHandle("date_of_birth")}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextFieldCustom
                                    label="ส่วนสูง"
                                    type="number"
                                    min={50}
                                    max={300}
                                    value={editUserInfo?.height}
                                    onChange={userInfoChangeHandle("height")}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={editUserHandle} disableElevation>บันทึก</Button>
                    <Button variant="text" onClick={closeEditUserDialogHandle}>ยกเลิก</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={showDeleteUserDialog}
                onClose={handleCloseDeleteUserDialog}
            >
                <DialogTitle>ยืนยันการลบ</DialogTitle>
                <DialogContent>
                    <DialogContentText>ผู้ใช้ <b>{userInfo?.name}</b> จะถูกลบอย่างถาวร และไม่สามารถกู้คืนข้อมูลได้</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickDeleteUser}>ลบผู้ใช้นี้</Button>
                    <Button onClick={handleCloseDeleteUserDialog} autoFocus>ยกเลิก</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

import { connect as DatabaseConnect } from '../../src/DatabaseUtility';

export async function getServerSideProps({ req, res, query }) {
    const userId = query.id;

    const db = await DatabaseConnect();

    const userInfo = await db.getPromise(
        "SELECT * FROM users WHERE id = ? LIMIT 1;", 
        [ 
            userId
        ]
    );

    const logInfo = await db.allPromise(
        "SELECT * FROM log WHERE uid = ?", 
        [ 
            userId
        ]
    );

    db.close();

    return {
        props: {
            userInfoFromServer: userInfo || { },
            logInfoFromServer: logInfo || [],
        }
    };
}

