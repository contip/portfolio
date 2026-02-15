import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CodeBlock as CodeBlockProps } from "@/types/payload-types";

export const CodeBlock = (props: CodeBlockProps) => {
  const { code, language } = props;
  const label = language ? language.toUpperCase() : "CODE";

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <span className="text-sm font-medium">Code Snippet</span>
        <Badge variant="secondary">{label}</Badge>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[400px]">
          <pre className="rounded-lg bg-muted px-4 py-3 text-sm overflow-x-auto">
            <code>{code}</code>
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
