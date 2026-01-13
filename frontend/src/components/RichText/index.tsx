import { MediaBlock } from "@/blocks/Media";
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedInlineBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from "@payloadcms/richtext-lexical";
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from "@payloadcms/richtext-lexical/react";
import {
  MediaBlock as MediaBlockProps,
  MediaGridBlock as MediaGridBlockProps,
  BlogArchiveBlock as BlogArchiveBlockProps,
  CallToActionBlock as CallToActionBlockProps,
  CodeBlock as CodeBlockProps,
  BlogHighlightBlock as BlogHighlightBlockProps,
  FeaturesBlock as FeaturesBlockProps,
  FormBlock as FormBlockProps,
  Icon as IconProps,
} from "@/types/payload-types";
import { cn } from "@/lib/utils";
import { TextJSXConverter } from "./converters/Text";
import InlineIcon from "./InlineIcon";

type InlineIconFields = {
  blockType: "inlineIcon";
  blockName?: string | null;
  icon: number | string | IconProps;
  textColor?: string | null;
  backgroundColor?: string | null;
};

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<
      | CallToActionBlockProps
      | MediaBlockProps
      | FeaturesBlockProps
      | CodeBlockProps
      | FormBlockProps
      | MediaGridBlockProps
      | BlogHighlightBlockProps
      | BlogArchiveBlockProps
    >
  | SerializedInlineBlockNode<InlineIconFields>;

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!;
  if (typeof value !== "object") {
    throw new Error("Expected value to be an object");
  }
  const slug = value.slug;
  return relationTo === "posts" ? `/posts/${slug}` : `/${slug}`;
};

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  ...TextJSXConverter,
  ...LinkJSXConverter({ internalDocToHref }),
  blocks: {
    mediaBlock: ({ node }) => (
      <MediaBlock
        className="col-start-1 col-span-3"
        imgClassName="m-0"
        {...node.fields}
        captionClassName="mx-auto max-w-[48rem]"
        enableGutter={false}
        disableInnerContainer={true}
      />
    ),
  },
  inlineBlocks: {
    inlineIcon: ({ node }) => {
      const iconValue = node.fields.icon;
      const resolvedIcon =
        iconValue && typeof iconValue === "object" && "value" in iconValue
          ? (iconValue as { value?: unknown }).value
          : iconValue;

      if (!resolvedIcon || typeof resolvedIcon !== "object") {
        return null;
      }

      const { svg, title } = resolvedIcon as Pick<IconProps, "svg" | "title">;
      if (!svg) {
        return null;
      }

      return (
        <InlineIcon
          svg={svg}
          title={title}
          textColor={node.fields.textColor}
          backgroundColor={node.fields.backgroundColor}
        />
      );
    },
  },
});

type Props = {
  data: DefaultTypedEditorState;
  enableGutter?: boolean;
  enableProse?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default function RichText(props: Props) {
  const {
    className,
    enableProse = true,
    enableGutter = false,
    ...rest
  } = props;
  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn(
        "payload-richtext",
        {
          container: enableGutter,
          "max-w-none": !enableGutter,
          "mx-auto prose md:prose-md dark:prose-invert": enableProse,
        },
        className
      )}
      {...rest}
    />
  );
}
