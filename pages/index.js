import React from 'react';
import { useRouter } from 'next/router'
import Head from 'next/head';
import Image from 'next/image'

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import OriginalButton from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import md5 from 'md5';

import style from '../styles/index.module.scss';

const Button = styled(OriginalButton)(({ theme }) => ({
    borderRadius: 500,
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 0,
    width: 52,
    height: 52,
    fontSize: 28
}));

export default function Index({ passwordEncrypted }) {
    const router = useRouter();

    const [ enterPassword, setPassword ] = React.useState("");
    const [ passwordError, setPasswordError ] = React.useState(false);

    const enterPasswordHandle = ch => e => {
        e.preventDefault();

        let newPassword = enterPassword;
        if (ch === "x") {
            newPassword = "";
            setPasswordError(false);
        } else if (ch === "?") {

        } else {
            if (enterPassword.length < 4) {
                newPassword = enterPassword + ch;
            }

            if (newPassword.length >= 4) {
                if (md5(newPassword) === passwordEncrypted) {
                    console.log("OK !");
                    router.push("/users");
                } else {
                    setPasswordError(true);
                }
            }
        }

        setPassword(newPassword);
    };

    return (
        <>
            <div className={style.contener}>
                <div className={style.formPassword}>
                    <Paper>
                        <div className={style.topLogo}>
                            <img
                                src="/logo.png"
                                alt="Logo"
                                width={120}
                            />
                        </div>
                        <Box p={2}>
                            <div className={style.boxPassword}>
                                {[...Array(4).keys()].map(index =>
                                    <div key={index}>
                                        <div className={style.boxCharPassword} style={{ borderColor: passwordError && "#F00" }}>
                                            <span>{enterPassword.charAt(index) || ""}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Box>
                        <Typography variant="body1" gutterBottom component="div" sx={{ textAlign: "center" }}>{!passwordError ? "กรุณากดรหัสผ่าน" : "รหัสผ่านไม่ถูกต้อง"}</Typography>
                        <Box p={2}>
                            {["123", "456", "789", "x0?"].map(gropRow =>
                                <div className={style.boxButton} key={gropRow}>
                                    {gropRow.split("").map((charNumber, index) =>
                                        <div key={index}>
                                            <div className={style.boxCharButton}>
                                                <Button
                                                    variant="outlined"
                                                    onClick={enterPasswordHandle(charNumber)}
                                                >{charNumber}</Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Box>
                    </Paper>
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps() {
    return {
        props: {
            passwordEncrypted: md5(process.env.PASSWORD)
        }
    };
}
