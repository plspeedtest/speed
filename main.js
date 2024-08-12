const fs = require("fs");
const axios = require("axios");

const currentTime = new Intl.DateTimeFormat("zh-CN", {
  hour12: false,
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
}).format(new Date());

const urllist = [
  "http://physics-api.turtlesim.com/Users",
  "http://physics-api-cn.turtlesim.com/Users",
  "http://nlm-api-cn.turtlesim.com/Users",
  "http://nlm-api.turtlesim.com/Users",
  "http://tu.netlogo.org",
  "http://tu.netlogo.org",
  "http://pl.turtlesim.com",
  "http://physics-api-cn.turtlesim.com/Contents"
];

const TIMEOUT_THRESHOLD = 10000;

async function measureSpeed(url) {
  const apiUrl = `https://v2.api-m.com/api/speed?url=${encodeURIComponent(
    url
  )}`;

  try {
    const response = await Promise.race([
      axios.get(apiUrl),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), TIMEOUT_THRESHOLD)
      ),
    ]);

    const speed = response.data.data;
    const speedResult = `${currentTime} ${url} ${speed}s\n`;

    return speedResult;
  } catch (error) {
    const speedResult = `${currentTime} ${url} timeout\n`;

    return speedResult;
  }
}

async function main() {
  try {
    const speedResults = await Promise.all(
      urllist.map((url) => measureSpeed(url))
    );

    console.log(speedResults);

    const logContent = speedResults.join("");
    fs.appendFileSync("log.txt", "\n" + logContent);

    console.log("写入成功");
  } catch (error) {
    console.error(error.message);
  }
}

main().then(() => {
  process.exit(0);
});
