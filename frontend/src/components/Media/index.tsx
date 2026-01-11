import React, { Fragment } from "react";

import type { Props } from "./types";
import type { Media as MediaType } from "@/types/payload-types";

import { Image } from "./Image";
import { Video } from "./Video";
import { BackgroundVideo } from "./BackgroundVideo";

export const Media: React.FC<Props> = (props) => {
  const { className, htmlElement = "div", resource, fill, imgClassName } = props;

  const isVideo =
    typeof resource === "object" && resource?.mimeType?.includes("video");
  const Tag = (htmlElement as any) || Fragment;

  // Use BackgroundVideo for video in fill mode (hero backgrounds, etc.)
  if (isVideo && fill && typeof resource === "object") {
    return (
      <Tag
        {...(htmlElement !== null
          ? {
              className,
            }
          : {})}
      >
        <BackgroundVideo resource={resource as MediaType} className={imgClassName} />
      </Tag>
    );
  }

  return (
    <Tag
      {...(htmlElement !== null
        ? {
            className,
          }
        : {})}
    >
      {isVideo ? <Video {...props} /> : <Image {...props} />}
    </Tag>
  );
};
