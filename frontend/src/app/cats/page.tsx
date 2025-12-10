import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCats } from "@/lib/payload";
import { Cat, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CatsPage() {
  const cats = await getCats();

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </Button>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Cats</h1>
          <p className="text-lg text-muted-foreground">
            A collection of cats fetched from the Payload CMS backend.
          </p>
        </div>

        {cats.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cats.map((cat) => (
              <Card key={cat.id} className="hover:border-primary/50 transition-colors">
                <Link href={`/cats/${cat.slug}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{cat.name}</CardTitle>
                      <Badge variant="secondary">{cat.breed}</Badge>
                    </div>
                    <CardDescription>
                      A lovely {cat.breed?.toLowerCase() ?? 'cat'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{cat.age} years old</span>
                      <span>&middot;</span>
                      <span>{cat.weight} lbs</span>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Cat className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No cats found</h2>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                The cats collection is empty. Create some cats in the Payload admin panel to see them here.
              </p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-medium">Required fields:</p>
                <p>name (Text), slug (Text), breed (Select), weight (Number), age (Number)</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
