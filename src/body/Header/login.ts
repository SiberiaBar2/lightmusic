import axios from "axios";

const api = process.env.REACT_APP_API_URL;

async function checkStatus(key: string) {
  console.log("checkStatus");
  const res = await axios({
    url: `${api}/login/qr/check?key=${key}&timerstamp=${Date.now()}`,
  });
  return res.data;
}
async function getLoginStatus(cookie = "") {
  const res = await axios({
    url: `${api}/login/status?timerstamp=${Date.now()}`,
    method: "post",
    data: {
      cookie,
    },
  });

  console.log("userinfo res.data", res.data);
  //   document.querySelector("#info").innerText = JSON.stringify(res.data, null, 2);
}
export async function login(ref: any) {
  let timer: any;
  const timestamp = Date.now();
  const cookie = localStorage.getItem("cookie");
  getLoginStatus(cookie as string);
  const res = await axios({
    url: `${api}/login/qr/key?timerstamp=${Date.now()}`,
  });
  const key = res.data.data.unikey;
  const res2 = await axios({
    url: `${api}/login/qr/create?key=${key}&qrimg=true&timerstamp=${Date.now()}`,
  });

  //   console.log("ref.currtet.src", ref.current);
  //   console.log(
  //     'document.querySelector("#qrImg")',
  //     document.querySelector("#qrImg")
  //   );

  //   console.log("res2.data.data.qrimg", res2.data.data.qrimg);

  //   if (ref.currtet.src) ref.currtet.src = res2.data.data.qrimg;
  //   document.querySelector("#qrImg").src = res2.data.data.qrimg;
  // eslint-disable-next-line prefer-const
  timer = setInterval(async () => {
    const statusRes = await checkStatus(key);
    if (statusRes.code === 800) {
      alert("二维码已过期,请重新获取");
      clearInterval(timer);
    }
    if (statusRes.code === 803) {
      // 这一步会返回cookie
      clearInterval(timer);
      alert("授权登录成功");
      await getLoginStatus(statusRes.cookie);
      localStorage.setItem("cookie", statusRes.cookie);
    }
  }, 3000);
}
// login();
