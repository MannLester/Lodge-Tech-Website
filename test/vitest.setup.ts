import "@testing-library/jest-dom/vitest";

import React from "react";
import { vi } from "vitest";

vi.mock("next/image", () => ({
  default: (
    props: React.ImgHTMLAttributes<HTMLImageElement> & {
      fill?: boolean;
      placeholder?: string;
      preload?: boolean;
      quality?: number;
      src: string | { src: string };
    },
  ) => {
    const {
      alt,
      fill: _fill,
      placeholder: _placeholder,
      preload: _preload,
      quality: _quality,
      src,
      ...imageProps
    } = props;

    void _fill;
    void _placeholder;
    void _preload;
    void _quality;

    return React.createElement("img", {
      ...imageProps,
      alt,
      src: typeof src === "string" ? src : src.src,
    });
  },
}));
