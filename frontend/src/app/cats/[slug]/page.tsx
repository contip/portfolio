import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCatBySlug, getCats } from "@/lib/payload";
import { ArrowLeft, Scale, Calendar, Cat } from "lucide-react";
import { Media } from "@/components/Media";
import type { Media as MediaType } from "@/types/payload-types";

export const dynamic = "force-dynamic";

interface CatPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const cats = await getCats();
  return cats.map((cat) => ({
    slug: cat.slug,
  }));
}

export default async function CatPage({ params }: CatPageProps) {
  const { slug } = await params;
  const cat = await getCatBySlug(slug);

  if (!cat) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button variant="ghost" size="sm" asChild className="mb-8">
          <Link href="/cats">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cats
          </Link>
        </Button>

        <Card className="overflow-hidden">
          {cat.image && typeof cat.image === 'object' && (
            <div className="relative aspect-video w-full">
              <Media
                resource={cat.image as MediaType}
                fill
                imgClassName="object-cover"
                size="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
          )}
          <CardHeader>
            <div className="flex items-center gap-4 mb-2">
              {(!cat.image || typeof cat.image !== 'object') && (
                <div className="p-3 rounded-full bg-primary/10">
                  <Cat className="h-8 w-8 text-primary" />
                </div>
              )}
              <div>
                <CardTitle className="text-3xl">{cat.name}</CardTitle>
                <Badge variant="secondary" className="mt-1">{cat.breed}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 p-4 rounded-lg border">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-medium">{cat.age} years old</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border">
                <Scale className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <p className="font-medium">{cat.weight} lbs</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <p className="text-xs text-muted-foreground">
                Created: {new Date(cat.createdAt).toLocaleDateString()}
                {cat.updatedAt !== cat.createdAt && (
                  <> &middot; Updated: {new Date(cat.updatedAt).toLocaleDateString()}</>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
