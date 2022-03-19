import Link from 'next/link'

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function AppBarCustom({ title, backLink }) {
    return (
        <AppBar position="static">
            <Toolbar>
                <Link href={backLink} passHref>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        component={"a"}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                </Link>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>{title}</Typography>
            </Toolbar>
        </AppBar>
    );
}
