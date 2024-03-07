import React, { useEffect, useState } from "react";
import dfData from "../../Common/DefaultConfig.json";
const WheelComponent = ({
  segments,
  segColors,
  winningSegment,
  onFinished,
  primaryColor,
  contrastColor,
  buttonText,
  isOnlyOnce,
  needleColor,
  timeUp,
  onClickSpin,
  isSpinAllow,
  alertSpin,
  imageGift,
  imageSniper,
  smallSpinColor,
  petesdalImage,
}) => {
  let currentSegment = "";
  let isStarted = false;
  const [isFinished, setFinished] = useState(false);
  let timerHandle = 0;
  const timerDelay = segments.length;
  let angleCurrent = 0;
  let angleDelta = 0;
  const size = 176;
  let canvasContext = null;
  let maxSpeed = Math.PI / `${segments.length}`;
  const upTime = timeUp ?? segments.length * 1000;
  const downTime = segments.length * 1000;
  let spinStart = 0;
  let frames = 0;

  const centerX = 200;
  const centerY = 200;

  let base_image = new Image();
  base_image.src =
    imageGift || "https://blog-manager-test.incom.vn/images/winmart/1.png";

  let sniper_img = new Image();
  sniper_img.src =
    imageSniper ||
    "https://blog-manager-test.incom.vn/images/winmart/test_spinner_2.png";

  useEffect(() => {
    wheelInit();
    setTimeout(() => {
      window.scrollTo(0, 1);
    }, 0);
  }, []);

  const wheelInit = () => {
    initCanvas();
    wheelDraw();
  };

  const initCanvas = () => {
    let canvas = document.getElementById("canvas");
    canvas.addEventListener("click", spin, false);
    canvasContext = canvas.getContext("2d");
    base_image.onload = function () {
      drawWheel();
      drawNeedle();
    };
    sniper_img.onload = function () {
      drawWheel();
      drawNeedle();
    };
  };

  const spin = () => {
    onClickSpin();
    document.getElementById("canvas").style.pointerEvents = "none";
    isStarted = true;
    if (timerHandle === 0) {
      spinStart = new Date().getTime();
      maxSpeed = Math.PI / (segments.length * 2 + Math.random());
      //maxSpeed = Math.PI / segments.length;
      frames = 0;
      timerHandle = setInterval(onTimerTick, timerDelay);
    }
  };

  const onTimerTick = () => {
    frames++;
    draw();
    const duration = new Date().getTime() - spinStart;
    let progress = 0;
    let finished = false;
    if (duration < upTime) {
      progress = duration / upTime;
      angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2);
    } else {
      if (winningSegment) {
        if (currentSegment === winningSegment && frames > segments.length) {
          progress = duration / upTime;
          angleDelta =
            maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
          progress = 1;
        } else {
          progress = duration / downTime;
          angleDelta =
            maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
        }
      } else {
        progress = duration / downTime;
        angleDelta =
          maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
      }
      if (progress >= 1) {
        finished = true;
      }
    }

    angleCurrent += angleDelta;
    while (angleCurrent >= Math.PI * 2) angleCurrent -= Math.PI * 2;
    if (finished) {
      document.getElementById("canvas").style.pointerEvents = "auto";
      setFinished(true);
      onFinished(currentSegment);
      clearInterval(timerHandle);
      timerHandle = 0;
      angleDelta = 0;
    }
  };

  const wheelDraw = () => {
    clear();
    drawWheel();
    drawNeedle();
  };

  const draw = () => {
    clear();
    drawWheel();
    drawNeedle();
  };

  const drawImageCentered = (image, ctx) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const imageWidth = image.width + 25;
    const imageHeight = image.height + 25;

    const x = centerX - imageWidth / 2;
    const y = centerY - imageHeight / 2 + 3;

    ctx.drawImage(image, x, y, imageWidth, imageHeight);
  };

  const drawSegment = (
    key,
    lastAngle,
    angle,
    gradientStartColor,
    gradientEndColor,
  ) => {
    const ctx = canvasContext;
    const value = segments[key];
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, size, lastAngle, angle, false);
    ctx.lineTo(centerX, centerY);

    ctx.closePath();
    // const gradient = ctx.createLinearGradient(
    //   centerX,
    //   centerY - size,
    //   centerX,
    //   centerY + size
    // );
    // gradient.addColorStop(0, gradientStartColor);
    // gradient.addColorStop(1, gradientEndColor);
    ctx.fillStyle = gradientStartColor;
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((lastAngle + angle) / 2);

    ctx.font = "bold 50px proxima-nova";

    // ctx.fillText(".", size + 5, -15);

    // Adjust the factor according to your needs
    //Gán ảnh
    const imageSize = size * 0.3;

    ctx.drawImage(base_image, size / 2, -28, imageSize, imageSize);
    ctx.restore();
  };

  const drawWheel = () => {
    const ctx = canvasContext;
    const len = segments.length;
    const PI2 = Math.PI * 2;

    // Ảnh vòng tròn
    ctx.beginPath();
    ctx.arc(centerX, centerY, 0, 0, PI2, false);
    ctx.closePath();
    //ctx.fill();
    drawImageCentered(sniper_img, ctx); // Use the centered drawImage function
    ctx.stroke();

    let lastAngle = angleCurrent;

    for (let i = 1; i <= len; i++) {
      const angle = PI2 * (i / len) + angleCurrent;
      drawSegment(
        i - 1,
        lastAngle,
        angle,
        segColors[i - 1],
        "rgba(255, 0, 0, 0)",
      );

      lastAngle = angle;
    }

    //vòng kế tiếp vòng ngoài
    ctx.beginPath();
    ctx.arc(centerX, centerY, size, 0, PI2, false);
    ctx.closePath();
    ctx.lineWidth = 0;
    ctx.strokeStyle = "#F7E3A1" || "black";
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.strokeStyle = primaryColor || "black";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = "1em proxima-nova";

    ctx.stroke();

    // Vòng tròn nhỏ chỗ xoay
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, PI2, false);
    ctx.closePath();
    ctx.fillStyle = smallSpinColor || "#FF0000";
    ctx.lineWidth = 5;
    ctx.strokeStyle = needleColor || "white";
    ctx.fill();
    ctx.font = "bold 1.3em proxima-nova";
    ctx.fillStyle = needleColor || "white";
    ctx.textAlign = "center";
    ctx.fillText(buttonText || "Spin", centerX, centerY + 3);
    ctx.stroke();
  };

  const drawNeedle = () => {
    const ctx = canvasContext;
    ctx.lineWidth = 1;
    ctx.strokeStyle = contrastColor || "white";
    ctx.fileStyle = contrastColor || "white";
    ctx.beginPath();
    //Chỗ mũi tên chỉ ra
    ctx.moveTo(centerX + 10, centerY - 30);
    ctx.lineTo(centerX - 10, centerY - 30);
    ctx.lineTo(centerX, centerY - 40);
    ctx.closePath();
    ctx.fill();
    const change = angleCurrent + Math.PI / 2;

    //Chỗ này quay may mắn
    let i =
      segments.length -
      Math.floor((change / (Math.PI * 2)) * segments.length) -
      1;

    if (i < 0) i = i + segments.length;
    ctx.textAlign = "center";
    ctx.textBaseline = "small";
    ctx.fillStyle = primaryColor || "black";
    ctx.font = "bold 1em proxima-nova";
    currentSegment = segments[i];
    isFinished &&
      ctx.fillText(currentSegment, centerX + 10, centerY + size + 50);
  };

  const clear = () => {
    const ctx = canvasContext;
    ctx.clearRect(0, 0, 1000, 500);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={() => {
        if (alertSpin && !isSpinAllow) {
          alertSpin();
        }
      }}
    >
      <div
        style={{
          width: "85vw",
          height: "85vw",
          position: "relative",
        }}
      >
        <canvas
          id="canvas"
          width="400"
          height="400"
          style={{
            pointerEvents: !isSpinAllow ? "none" : "auto",
            width: "100%",
            height: "100%",
            zIndex: 10,
            position: "relative",
            // backgroundColor: "#FFF7AF",

            // borderRadius: "50%",

            // boxShadow: "0px 4px 4px 0px #00000040",
          }}
        />

        {/* mau 2 */}
      </div>

      <div style={{ marginTop: -10, marginBottom: 10, padding: 0, zIndex: 1 }}>
        <img
          style={{ width: "350px", height: "80px", marginBottom: 15 }}
          src={
            petesdalImage
              ? petesdalImage
              : `${dfData.url}/images/winmart/wheel_pedestal.png`
          }
        />
      </div>
    </div>
  );
};
export default WheelComponent;
