import React, { Fragment } from "react";

import type { CaseStudy, Page, Post, Service } from "@/types/payload-types";
import { ContentBlock } from "./Content";
import { CallToActionBlock } from "./CallToAction";
import { FormBlock } from "./Form";
import { BlogArchiveBlock } from "./BlogArchive";
import { BlogHighlightBlock } from "./BlogHighlight";
import { MediaBlock } from "./Media";
import { MediaGridBlock } from "./MediaGrid";
import { CodeBlock } from "./Code";
import { FeaturesBlock } from "./Features";

type SupportedBlocks =
  | Page["layout"]
  | Post["layout"]
  | Service["layout"]
  | CaseStudy["layout"]
  | Array<Record<string, unknown>>;

type BlockRenderer = React.ComponentType<Record<string, unknown>>;
type GenericBlock = {
  id?: number | string | null;
  blockType?: string;
} & Record<string, unknown>;

const blockComponents: Record<string, BlockRenderer> = {
  content: ContentBlock as unknown as BlockRenderer,
  cta: CallToActionBlock as unknown as BlockRenderer,
  formBlock: FormBlock as unknown as BlockRenderer,
  blogArchive: BlogArchiveBlock as unknown as BlockRenderer,
  blogHighlight: BlogHighlightBlock as unknown as BlockRenderer,
  mediaBlock: MediaBlock as unknown as BlockRenderer,
  mediaGrid: MediaGridBlock as unknown as BlockRenderer,
  code: CodeBlock as unknown as BlockRenderer,
  featuresBlock: FeaturesBlock as unknown as BlockRenderer,
};

export const RenderBlocks: React.FC<{
  blocks: SupportedBlocks;
}> = ({ blocks }) => {
  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0;

  if (!hasBlocks) {
    return null;
  }

  return (
    <Fragment>
      {(blocks as GenericBlock[]).map((block, index: number) => {
        const blockType = block?.blockType;
        if (!blockType || !(blockType in blockComponents)) {
          return null;
        }

        const Block = blockComponents[blockType];
        if (!Block) {
          return null;
        }

        return (
          <div className="my-16" key={block?.id ?? index}>
            <Block {...block} />
          </div>
        );
      })}
    </Fragment>
  );
};
