const onvif = require("node-onvif");
const prompt = require("electron-prompt");

async function getCamUsername() {
  try {
    const r = await prompt({
      title: 'Camera credentials',
      label: 'username:',
      inputAttrs: {
        type: 'text',
        required: true
      },
      type: 'input'
    });
    return r;
  } catch (message) {
    return console.error(message);
  }
};

async function getCamPassword() {
  try {
    const r = await prompt({
      title: 'Camera credentials',
      label: 'password:',
      inputAttrs: {
        type: 'text',
        required: true
      },
      type: 'input'
    });
    return r;
  } catch (message) {
    return console.error(message);
  }
};


// Function to scan the network for ONVIF cameras
const scanCameras = async () => {
  console.log("Сканируем сеть на наличие камер с ONVIF...");
  
  // Ищем камеры в сети по протоколу ONVIF
  const devices = await onvif.startProbe();

  if (devices.length === 0) {
    return { success: false, message: 'No ONVIF cameras found.' };
  }

  let message = 'Найденные ONVIF устройства:\n\n';
  const cameras = [];

  for (const device of devices) {
    try {
      console.log(`Found device: ${device.urn}`);
      const camera = new onvif.OnvifDevice({
        xaddr: device.xaddrs[0],
        user: await getCamUsername(),     
        pass: await getCamPassword()});
      await camera.init();
      const url = camera.rtspUri;
      message += `${device.urn}: ${url}\n`;
      console.log(`RTSP link: ${url}\n`);
      cameras.push({ urn: device.urn, url });
    } catch (error) {
      console.error(`Error retrieving RTSP link for device ${device.urn}: ${error}\n`);
      message += `Error retrieving RTSP link for device ${device.urn}: ${error}\n`;
    }
  }

  return { success: true, message, cameras };
};

module.exports = scanCameras;
