import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCachedCollection, getCachedDocument } from "@/lib/payload";
import { ArrowLeft, Calendar } from "lucide-react";
import { Media } from "@/components/Media";
import type { Lizard, Media as MediaType } from "@/types/payload-types";
import { ImageSlider } from "./ImageSlider";

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
  try {
    const { docs: lizards } = await getCachedCollection<Lizard>("lizards");
    if (!lizards.length) {
      return [{ slug: "_placeholder" }];
    }
    return lizards.map((lizard) => ({
      slug: lizard.slug,
    }));
  } catch {
    return [{ slug: "_placeholder" }];
  }
}

export default async function LizardPage({ params }: LizardPageProps) {
  const { slug } = await params;
  let lizard: Lizard | null = null;

  try {
    lizard = await getCachedDocument<Lizard>("lizards", slug);
  } catch {
    lizard = null;
  }

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
          {lizard.image && typeof lizard.image === "object" ? (
            <div className="relative aspect-square sm:aspect-4/3 w-full bg-muted">
              <Media
                resource={lizard.image as MediaType}
                fill
                imgClassName="object-cover"
                size="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
          ) : (
            <div className="aspect-square sm:aspect-4/3 w-full bg-muted flex items-center justify-center">
              <span className="text-8xl">🦎</span>
            </div>
          )}
          <CardHeader>
            <div className="flex items-center gap-4 mb-2">
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

            {lizard.additionalImages && lizard.additionalImages.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-medium mb-4">Gallery</h3>
                <ImageSlider
                  images={lizard.additionalImages.filter(
                    (img): img is MediaType => typeof img === "object"
                  )}
                />
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
