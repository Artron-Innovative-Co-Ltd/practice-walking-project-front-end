import { useRouter } from 'next/router';
/* import cookieCutter from 'cookie-cutter'; */

let goToAuth = () => {
    if (process.browser) {
        const router = useRouter();

        router.push("/auth");
        return true;
    }

    return false;
};

async function WebCallAPI(option) {
    option = Object.assign({
        endpoint: "",
        method: "GET",
        data: null,
        auth: true
    }, option);

    let { endpoint, method, data, auth } = option;

    if (typeof data === "object" && data !== null) {
        data = JSON.stringify(data);
    }

    const body = data;

    let headers = {
        "Content-Type": "application/json"
    };

    if (auth) {
        /*
        const token = cookieCutter.get("token");
        if (!token) {
            if (!goToAuth()) {
                throw "authorization fail";
            }
        }

        headers["Authorization"] = "Bearer " + token;
        */
    }

    let callAPI = await fetch("/api/" + endpoint, {
        method,
        headers,
        body,
    });

    if (callAPI.status !== 200) {
        if (callAPI.status === 401 && auth) {
            if (!goToAuth()) {
                throw "authorization fail";
            }
        }
        
        throw { code: callAPI.status, message: await callAPI.text() };
    }

    let res = await callAPI.text();
    try {
        res = JSON.parse(res);
    } catch(e) {
        
    }

    return res;
}

export default WebCallAPI;