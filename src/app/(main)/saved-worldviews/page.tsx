"use client";

import { useWorldview } from "@/hooks/use-worldview";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import TriangleChart from "@/components/visualization/TriangleChart"; // Corrected import path
import Link from "next/link";
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

export default function SavedWorldviewsPage() {
  const { savedWorldviews, deleteSavedWorldview, setActiveProfile, activeProfile } = useWorldview();
  const router = useRouter();
  const { toast } = useToast();

  if (savedWorldviews.length === 0) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Icons.saved className="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
        <h1 className="text-2xl font-semibold mb-2">No Saved Worldviews</h1>
        <p className="text-muted-foreground mb-4">
          You haven't saved any worldview profiles yet.
        </p>
        <div className="flex justify-center gap-4">
            <Button asChild><Link href="/assessment">Start Assessment</Link></Button>
            <Button variant="outline" asChild><Link href="/builder">Go to Builder</Link></Button>
        </div>
      </div>
    );
  }

  const handleLoadAndNavigate = (profile: typeof savedWorldviews[0], path: string) => {
    setActiveProfile(profile);
    router.push(path);
    toast({ title: `Profile "${profile.title}" loaded.`});
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Saved Worldviews</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedWorldviews.map(profile => (
          <Card key={profile.id} className={`flex flex-col glassmorphic-card hover:shadow-primary/20 transition-shadow duration-300 ease-in-out ${activeProfile?.id === profile.id ? 'ring-2 ring-primary' : ''}`}>
            <CardHeader>
              <CardTitle className="text-xl">{profile.title}</CardTitle>
              <CardDescription>
                Saved on: {format(new Date(profile.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-center items-center">
               <TriangleChart scores={profile.domainScores} worldviewName={profile.title} width={200} height={173} className="mx-auto mb-4 !p-0 !bg-transparent !shadow-none !backdrop-blur-none" />
              {profile.summary && <p className="text-sm text-muted-foreground line-clamp-2">{profile.summary}</p>}
            </CardContent>
            <CardFooter className="grid grid-cols-3 gap-2 pt-4 border-t border-border/30">
              <Button 
                variant="default" 
                size="sm" 
                className="w-full" 
                onClick={() => handleLoadAndNavigate(profile, '/results')}
              >
                <Icons.view className="mr-1 sm:mr-2 h-4 w-4" /> View
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => handleLoadAndNavigate(profile, '/builder')}
              >
                <Icons.edit className="mr-1 sm:mr-2 h-4 w-4" /> Edit
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                className="w-full"
                onClick={() => {
                  if(confirm(`Are you sure you want to delete "${profile.title}"? This action cannot be undone.`)) {
                    deleteSavedWorldview(profile.id);
                  }
                }}
              >
                <Icons.delete className="mr-1 sm:mr-2 h-4 w-4" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}