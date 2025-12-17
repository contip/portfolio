import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLizardBySlug, getLizards } from "@/lib/payload";
import { ArrowLeft, Calendar } from "lucide-react";
import { Media } from "@/components/Media";
import type { Media as MediaType } from "@/types/payload-types";

export const dynamic = "force-dynamic";

interface LizardPageProps {
  params: Promise<{ slug: string }>;
}

const speciesLabels: Record<string, string> = {
  sagrei: "Cuban Brown Anole",
  baracoa: "Baracoa Anole",
  barbatus: "Cuban False Chameleon",
};

function getSpeciesLabel(species: string | null | undefined): string {
  if (!species) return "Unknown";
  return speciesLabels[species] ?? species;
}

export async function generateStaticParams() {
  const lizards = await getLizards();
  return lizards.map((lizard) => ({
    slug: lizard.slug,
  }));
}

export default async function LizardPage({ params }: LizardPageProps) {
  const { slug } = await params;
  const lizard = await getLizardBySlug(slug);

  if (!lizard) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button variant="ghost" size="sm" asChild className="mb-8">
          <Link href="/lizards">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Lizards
          </Link>
        </Button>

        <Card className="overflow-hidden">
          {lizard.image && typeof lizard.image === "object" && (
            <div className="relative aspect-video w-full">
              <Media
                resource={lizard.image as MediaType}
                fill
                imgClassName="object-contain"
                size="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
          )}
          <CardHeader>
            <div className="flex items-center gap-4 mb-2">
              {(!lizard.image || typeof lizard.image !== "object") && (
                <div className="p-3 rounded-full bg-primary/10 text-2xl">
                  🦎
                </div>
              )}
              <div>
                <CardTitle className="text-3xl">{lizard.name}</CardTitle>
                <Badge variant="secondary" className="mt-1">
                  {getSpeciesLabel(lizard.species)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {lizard.age && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 p-4 rounded-lg border">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Age</p>
                    <p className="font-medium">{lizard.age} years old</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t">
              <p className="text-xs text-muted-foreground">
                Created: {new Date(lizard.createdAt).toLocaleDateString()}
                {lizard.updatedAt !== lizard.createdAt && (
                  <>
                    {" "}
                    &middot; Updated:{" "}
                    {new Date(lizard.updatedAt).toLocaleDateString()}
                  </>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
