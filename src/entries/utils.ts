import { useEffect, useState } from "react";

const createVibrantGradient = (dominantColor: string): string => {
  // 生成鲜艳的颜色和更深的颜色
  const enhanceAndDarkenColor = (
    color: string,
    lightAdjust: number,
    satAdjust: number
  ): { vibrant: string; dark: string } => {
    // RGB 转换为 HSL
    const rgbToHsl = (r: number, g: number, b: number) => {
      r /= 255;
      g /= 255;
      b /= 255;
      const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
      let h = 0,
        s = 0;
      const l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
      }
      return [h * 360, s * 100, l * 100];
    };

    // HSL 转换回 RGB
    const hslToRgb = (h: number, s: number, l: number) => {
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = l - c / 2;
      let r = 0,
        g = 0,
        b = 0;
      if (h >= 0 && h < 60) {
        r = c;
        g = x;
        b = 0;
      } else if (h >= 60 && h < 120) {
        r = x;
        g = c;
        b = 0;
      } else if (h >= 120 && h < 180) {
        r = 0;
        g = c;
        b = x;
      } else if (h >= 180 && h < 240) {
        r = 0;
        g = x;
        b = c;
      } else if (h >= 240 && h < 300) {
        r = x;
        g = 0;
        b = c;
      } else if (h >= 300 && h < 360) {
        r = c;
        g = 0;
        b = x;
      }
      r = Math.round((r + m) * 255);
      g = Math.round((g + m) * 255);
      b = Math.round((b + m) * 255);
      return `rgb(${r}, ${g}, ${b})`;
    };

    // 获取主色的 HSL 值
    const rgb = color.match(/\d+/g)?.map(Number) || [0, 0, 0];
    // eslint-disable-next-line prefer-const
    let [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);

    // 生成鲜艳的颜色（增加饱和度）
    s = Math.min(s + satAdjust, 100); // 增加饱和度至上限
    const vibrantColor = hslToRgb(h, s / 100, l / 100);

    // 生成更深的颜色（适度降低亮度）
    l = Math.max(l - lightAdjust, 0); // 降低亮度
    const darkColor = hslToRgb(h, s / 100, l / 100);

    return { vibrant: vibrantColor, dark: darkColor };
  };

  const { vibrant, dark } = enhanceAndDarkenColor(dominantColor, 20, 30); // 调整亮度和饱和度
  return `linear-gradient(${dark}, ${vibrant}, ${dark})`; // 生成渐变
};

const getMostFrequentColor = (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // 允许跨域
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);

        const imageData = context.getImageData(
          0,
          0,
          img.width,
          img.height
        ).data;
        const colorCount: { [key: string]: number } = {};
        const colors: string[] = [];

        // 逐像素分析颜色
        for (let i = 0; i < imageData.length; i += 4) {
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];
          const color = `rgb(${r},${g},${b})`;

          colorCount[color] = (colorCount[color] || 0) + 1;
        }

        // 按照占比从高到低排序
        // eslint-disable-next-line guard-for-in
        for (const color in colorCount) {
          colors.push(color);
        }
        colors.sort((a, b) => colorCount[b] - colorCount[a]);

        // 检查颜色是否接近黑色或白色
        const isCloseToBlackOrWhite = (color: string) => {
          const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
          if (match) {
            const r = parseInt(match[1]);
            const g = parseInt(match[2]);
            const b = parseInt(match[3]);

            // 判断非常接近黑色或白色
            const isBlack = r < 15 && g < 15 && b < 15;
            const isWhite = r > 240 && g > 240 && b > 240;

            return isBlack || isWhite;
          }
          return false;
        };

        // 找到合适的颜色
        for (const color of colors) {
          if (!isCloseToBlackOrWhite(color)) {
            resolve(color);
            return;
          }
        }

        // 如果所有颜色都接近黑色或白色，返回默认颜色
        resolve("rgb(21, 108, 117)");
      } else {
        reject("Canvas context not supported");
      }
    };

    img.onerror = () => reject("Image load error");
  });
};

export const useBackGroundColor = (picUrl: string, id: string) => {
  const [themeColor, seThemeColor] = useState("");

  useEffect(() => {
    if (picUrl && id) {
      getMostFrequentColor(picUrl).then((color) => {
        const backElement = document.getElementById(`${id}`);

        if (backElement) {
          backElement.style.background = createVibrantGradient(color);
        } else {
          // 用于弹窗首测的背景颜色
          seThemeColor(createVibrantGradient(color));
        }
      });
    }
  }, [picUrl, id]);

  return themeColor;
};
