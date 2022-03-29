import React from 'react';
import Link from 'next/link'
import { useRouter } from 'next/router';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import AppBarCustom from '../../src/AppBarCustom';
import CallAPI from '../../src/WebCallAPI';
import CalculateAge from '../../src/CalculateAge';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const TextFieldCustom = props => <TextField
    variant="outlined"
    InputLabelProps={{
        shrink: true,
    }}
    sx={{ width: "100%" }}
    {...props}
/>;

export default function Users({ usersFromServer }) {
    const router = useRouter();

    const [ openAddUserDialog, setOpenAddUserDialog ] = React.useState(false);
    const openAddUserDialogHandle = () => setOpenAddUserDialog(true);
    const closeAddUserDialogHandle = () => setOpenAddUserDialog(false);

    const [ users, setUsers ] = React.useState(usersFromServer);

    const [ userInfo, setUserInfo ] = React.useState({
        name: "",
        date_of_birth: "",
        height: ""
    });

    const userInfoChangeHandle = key => e => {
        let newUserInfo = { ...userInfo };
        newUserInfo[key] = e.target.value;
        setUserInfo(newUserInfo)
    }

    const addUserHandle = e => {
        CallAPI({
            endpoint: "users",
            method: "POST",
            data: {
                name: userInfo.name,
                date_of_birth: new Date(userInfo.date_of_birth).toISOString(),
                height: +userInfo.height
            },
            auth: false
        }).then(({ id }) => {
            router.push("/users/" + id);
        }).catch(err => {
            console.log(err);
        });
    }

    return (
        <>
            <AppBarCustom
                title={"รายชื่อ"}
                backLink={"/"}
            />

            <Grid container spacing={3} p={3}>
                {users.map(item => 
                    <Grid item xs={12} sm={6} lg={4} key={item?.id || 0}>
                        <Link href={"/users/" + item?.id || 0} passHref>
                            <Card sx={{ display: 'flex', textDecoration: "none" }} component={"a"}>
                                <CardActionArea sx={{ display: 'flex', flexDirection: 'row', alignItems: "flex-start" }}>
                                    <CardMedia
                                        component="img"
                                        sx={{ width: 200, height: 200 }}
                                        image={(item?.image && ("/api/upload/" + item?.image)) || "/user.png"}
                                        alt={item?.name || "?"}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5" component="div">{item?.name || "?"}</Typography>
                                        <Typography variant="body2" color="text.secondary">อายุ <b>{CalculateAge(item?.date_of_birth || 0)}</b> ปี</Typography>
                                        <Typography variant="body2" color="text.secondary">ส่วนสูง <b>{item?.height || "?"}</b> เซ็นติเมตร</Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Link>
                    </Grid>
                )}
                <Grid item xs={12} sm={6} lg={4}>
                    <Card sx={{ display: 'flex' }}>
                        <CardActionArea sx={{ display: 'flex', flexDirection: 'row', alignItems: "flex-start" }} onClick={openAddUserDialogHandle}>
                            <Box sx={{ height: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                <AddCircleOutlineIcon sx={{ fontSize: 60 }} />
                                <Typography gutterBottom variant="h5" component="div">เพิ่มใหม่</Typography>
                            </Box>
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grid>


            <Dialog
                fullWidth={true}
                maxWidth={"sm"}
                open={openAddUserDialog}
                onClose={closeAddUserDialogHandle}
            >
                <DialogTitle>เพิ่มผู้ใช้ใหม่</DialogTitle>
                <DialogContent>
                    <Box pt={3}>
                        <TextFieldCustom
                            label="ชื่อ-นามสกุล"
                            type="text"
                            value={userInfo?.name}
                            onChange={userInfoChangeHandle("name")}
                        />
                    </Box>
                    <Box pt={3}>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <TextFieldCustom
                                    label="วัน เดือน ปีเกิด"
                                    type="date"
                                    value={userInfo?.date_of_birth}
                                    onChange={userInfoChangeHandle("date_of_birth")}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextFieldCustom
                                    label="ส่วนสูง"
                                    type="number"
                                    min={50}
                                    max={300}
                                    value={userInfo?.height}
                                    onChange={userInfoChangeHandle("height")}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={addUserHandle} disableElevation>บันทึก</Button>
                    <Button variant="text" onClick={closeAddUserDialogHandle}>ยกเลิก</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

import { connect as DatabaseConnect } from '../../src/DatabaseUtility';

export async function getServerSideProps({ req, res, query }) {
    const userId = query.id;

    const db = await DatabaseConnect();

    const users = await db.allPromise(
        "SELECT * FROM users"
    );

    db.close();

    return {
        props: {
            usersFromServer: users || { },
        }
    };
}

