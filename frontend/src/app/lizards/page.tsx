import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLizards } from "@/lib/payload";
import { ArrowLeft } from "lucide-react";
import { Media } from "@/components/Media";
import type { Media as MediaType } from "@/types/payload-types";

export const dynamic = "force-dynamic";

const speciesLabels: Record<string, string> = {
  sagrei: "Cuban Brown Anole",
  baracoa: "Baracoa Anole",
  barbatus: "Cuban False Chameleon",
};

function getSpeciesLabel(species: string | null | undefined): string {
  if (!species) return "Unknown";
  return speciesLabels[species] ?? species;
}

export default async function LizardsPage() {
  const lizards = await getLizards();

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </Button>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Lizards</h1>
          <p className="text-lg text-muted-foreground">
            A collection of lizards fetched from the Payload CMS backend.
          </p>
        </div>

        {lizards.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lizards.map((lizard) => (
              <Card key={lizard.id} className="hover:border-primary/50 transition-colors overflow-hidden">
                <Link href={`/lizards/${lizard.slug}`}>
                  {lizard.image && typeof lizard.image === 'object' && (
                    <div className="relative aspect-4/3 w-full">
                      <Media
                        resource={lizard.image as MediaType}
                        fill
                        imgClassName="object-cover"
                        size="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{lizard.name}</CardTitle>
                      <Badge variant="secondary">{getSpeciesLabel(lizard.species)}</Badge>
                    </div>
                    <CardDescription>
                      A lovely {getSpeciesLabel(lizard.species).toLowerCase()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      {lizard.age && <span>{lizard.age} years old</span>}
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <div className="mx-auto h-16 w-16 text-muted-foreground mb-4 text-4xl">🦎</div>
              <h2 className="text-xl font-semibold mb-2">No lizards found</h2>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                The lizards collection is empty. Create some lizards in the Payload admin panel to see them here.
              </p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-medium">Required fields:</p>
                <p>name (Text), slug (Text), species (Select), age (Number)</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
