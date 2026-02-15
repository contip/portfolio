import { Media } from "@/components/Media";
import { Card } from "@/components/ui/card";
import type {
  Media as MediaType,
  MediaGridBlock as MediaGridBlockProps,
} from "@/types/payload-types";

export const MediaGridBlock = (props: MediaGridBlockProps) => {
  const { media, caption } = props;
  const items =
    media?.filter(
      (item): item is MediaType => typeof item === "object" && item !== null
    ) || [];

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        No media items selected.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card
            key={item.id}
            className="relative aspect-4/3 overflow-hidden border-border/60 p-0"
          >
            <Media
              resource={item}
              fill
              imgClassName="object-cover"
              size="(max-width: 768px) 100vw, 768px"
            />
          </Card>
        ))}
      </div>
      {caption && (
        <p className="text-sm text-muted-foreground text-center">{caption}</p>
      )}
    </div>
  );
};
