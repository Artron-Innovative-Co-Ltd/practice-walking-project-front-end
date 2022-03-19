import React from 'react';
import Link from 'next/link'

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import AppBarCustom from '../../src/AppBarCustom';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function Users() {
    return (
        <>
            <AppBarCustom 
                title={"รายชื่อ"}
                backLink={"/"}
            />

            <Grid container spacing={3} p={3}>
                <Grid item xs={12} sm={6} lg={4}>
                    <Link href={"/users/1"} passHref>
                        <Card sx={{ display: 'flex', textDecoration: "none" }} component={"a"}>
                            <CardActionArea sx={{ display: 'flex', flexDirection: 'row', alignItems: "flex-start" }}>
                                <CardMedia
                                    component="img"
                                    sx={{ width: 200, height: 200 }}
                                    image="/elolnnnn.jpg"
                                    alt="green iguana"
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5" component="div">สนธยา นงนุช</Typography>
                                    <Typography variant="body2" color="text.secondary">อายุ <b>54</b> ปี</Typography>
                                    <Typography variant="body2" color="text.secondary">น้ำหนัก <b>54</b> กิโลกรัม</Typography>
                                    <Typography variant="body2" color="text.secondary">ส่วนสูง <b>54</b> เซ็นติเมตร</Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Link>
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                    <Card sx={{ display: 'flex' }}>
                        <CardActionArea sx={{ display: 'flex', flexDirection: 'row', alignItems: "flex-start" }}>
                            <Box sx={{ height: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                <AddCircleOutlineIcon sx={{ fontSize: 60 }} />
                                <Typography gutterBottom variant="h5" component="div">เพิ่มใหม่</Typography>
                            </Box>
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}