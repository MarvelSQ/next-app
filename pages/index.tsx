import { useLayoutEffect, useRef } from "react";
import { Gradient } from "../components/stripe.gradient";
import style from "../styles/Main.module.css";

const asetcolors = ["#eb75b6", "#ddf3ff", "#6e3deb", "#c92f3c"];
const bsetcolors = ["#ff004c", "#ffdb9e", "#00d6b3", "#66d1ff"];

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : {
        r: 255,
        g: 255,
        b: 255,
      };
}

const asetcolorinrgb = asetcolors.map((color) => {
  return hexToRgb(color);
});

const bsetcolorinrgb = bsetcolors.map((color) => {
  return hexToRgb(color);
});

function getBetweenColor(offset: number) {
  const colorOffset = offset % 2 > 1 ? 1 - (offset % 1) : offset % 1;

  return asetcolorinrgb.map((color, index) => {
    const r = Math.floor(
      color.r + (bsetcolorinrgb[index].r - color.r) * colorOffset
    );
    const g = Math.floor(
      color.g + (bsetcolorinrgb[index].g - color.g) * colorOffset
    );
    const b = Math.floor(
      color.b + (bsetcolorinrgb[index].b - color.b) * colorOffset
    );
    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  });
}

function Main() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    // const rect = container.getBoundingClientRect();

    const canvasSize = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    function resizeListener() {
      // const rect = container.getBoundingClientRect();
      // canvasSize.width = rect.width;
      // canvasSize.height = rect.height;
      canvasSize.width = window.innerWidth;
      canvasSize.height = window.innerHeight;
    }

    window.addEventListener("resize", resizeListener);

    const gradient = new Gradient();

    // @ts-ignore
    gradient.initGradient("#stripe-canvas", asetcolors);

    gradient.setCanvasSize(canvasSize.width, canvasSize.height);

    let base = 0;
    let linear = 0;

    function animate() {
      if (base % 2 === 0) {
        //   //   const colors = getBetweenColor((linear += 0.01));
        //   //   console.log(
        //   //     `%c${colors.map((color) => color).join("%c")}%c`,
        //   //     ...colors.map((color) => `color: ${color};`)
        //   //   );
        //   console.log("change color");
        gradient.changeGradientColors(getBetweenColor((linear += 0.01)));
      }
      gradient.setCanvasSize(canvasSize.width, canvasSize.height);
      gradient.changePosition((base += 1) / 66);
    }

    console.log("start animation");
    const id = setInterval(() => {
      requestAnimationFrame(animate);
    }, 16);

    return () => {
      console.log("canceling animation frame");
      window.removeEventListener("resize", resizeListener);
      clearInterval(id);
    };
  }, []);

  return (
    <div className={style.container}>
      <canvas id="stripe-canvas" className={style.bg_canvas}></canvas>
      <div className={style.grid}>
        <div className={style.main} ref={containerRef}>
          MarvelSQ
        </div>
      </div>
    </div>
  );
}

export default Main;
