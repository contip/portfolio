import RichText from "@/components/RichText";
import { Media } from "@/components/Media";
import CMSLink from "@/components/CMSLink";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  CallToActionBlock as CallToActionBlockProps,
  Media as MediaType,
} from "@/types/payload-types";

export const CallToActionBlock = (props: CallToActionBlockProps) => {
  const { richText, link, backgroundColor, bgImage } = props;
  const media =
    bgImage && typeof bgImage === "object"
      ? (bgImage as MediaType)
      : null;

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-0 p-0",
        backgroundColor || "bg-muted/50"
      )}
    >
      {media && (
        <div className="absolute inset-0">
          <Media resource={media} fill imgClassName="object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      <CardContent
        className={cn(
          "relative z-10 flex flex-col gap-6 p-8",
          media ? "text-white" : "text-foreground"
        )}
      >
        {richText && <RichText data={richText} enableGutter={false} />}
        {link && (
          <div>
            <CMSLink link={link} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
