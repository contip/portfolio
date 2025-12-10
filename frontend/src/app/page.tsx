import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPayloadHealth, getCats, PAYLOAD_API_URL } from "@/lib/payload";
import { ExternalLink, Cat, Server, Database, Globe, Code2, Cloud } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [payloadHealthy, cats] = await Promise.all([
    getPayloadHealth(),
    getCats(),
  ]);

  const techStack = [
    { name: "Next.js 16", description: "React framework with App Router", icon: Code2 },
    { name: "React 19", description: "UI library with Server Components", icon: Code2 },
    { name: "Payload CMS", description: "Headless CMS for content", icon: Database },
    { name: "AWS Lambda", description: "Serverless compute via OpenNext", icon: Cloud },
    { name: "CloudFront", description: "Global CDN for edge delivery", icon: Globe },
    { name: "RDS PostgreSQL", description: "Managed database", icon: Database },
    { name: "Terraform", description: "Infrastructure as Code", icon: Server },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Portfolio Infrastructure
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            A full-stack portfolio application demonstrating modern cloud architecture
            with Next.js, Payload CMS, and AWS infrastructure managed by Terraform.
          </p>
        </section>

        {/* Status Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">System Status</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Frontend (Next.js)</CardTitle>
                  <Badge variant="default" className="bg-green-600">Healthy</Badge>
                </div>
                <CardDescription>Running on AWS Lambda via OpenNext</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Backend (Payload CMS)</CardTitle>
                  <Badge variant={payloadHealthy ? "default" : "destructive"} className={payloadHealthy ? "bg-green-600" : ""}>
                    {payloadHealthy ? "Healthy" : "Unhealthy"}
                  </Badge>
                </div>
                <CardDescription>
                  {payloadHealthy ? "API responding normally" : "API not responding"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" asChild>
                  <a href={`${PAYLOAD_API_URL}/admin`} target="_blank" rel="noopener noreferrer">
                    Open Admin <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Content Preview Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Content Preview</h2>
            <Button variant="ghost" asChild>
              <Link href="/cats">
                View all cats <Cat className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {cats.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cats.slice(0, 3).map((cat) => (
                <Card key={cat.id} className="hover:border-primary/50 transition-colors">
                  <Link href={`/cats/${cat.slug}`}>
                    <CardHeader>
                      <CardTitle className="text-base">{cat.name}</CardTitle>
                      <CardDescription>
                        {cat.breed} &middot; {cat.age} years &middot; {cat.weight} lbs
                      </CardDescription>
                    </CardHeader>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center">
                <Cat className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">
                  No cats found in the database yet.
                </p>
                <p className="text-sm text-muted-foreground">
                  Create a cat in Payload Admin with fields: name, slug, breed, weight, age
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Tech Stack Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Technology Stack</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {techStack.map((tech) => {
              const Icon = tech.icon;
              return (
                <Card key={tech.name}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-sm">{tech.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">{tech.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
