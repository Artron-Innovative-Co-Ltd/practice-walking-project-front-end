import nextConnect from 'next-connect';



handler.get(async (req, res) => {
    

    return res.status(200).json(users);
});

/* Add user */
handler.post(async (req, res) => {
    const userInfo = Object.assign(
        {
            name: null,
            date_of_birth: null,
            hight: null,
        }, 
        req.body
    );

    let addUser = await req.dbClient.query(
        "INSERT INTO general.users (name, username, password, email, tel, permission, location_owner) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;",
        [
            userInfo.name,
            userInfo.username,
            await PasswordHash.hash(userInfo.password),
            userInfo.email,
            userInfo.tel,
            userInfo.permission,
            userInfo.location_owner
        ]
    );

    return res.status(200).json({
        id: addUser.rows[0].id
    });
});

export default handler;