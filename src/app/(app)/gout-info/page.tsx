import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import StructuredData from '@/components/structured-data';
import type { Article } from 'schema-dts';

const goutInfoImage = PlaceHolderImages.find(p => p.id === 'gout-info');

export default function GoutInfoPage() {
  const articleSchema: Article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://gouty.app/gout-info',
    },
    headline: 'Understanding Gout - Causes, Symptoms, and Diet',
    description: 'A comprehensive guide to the causes and symptoms of gout, and how dietary management, particularly purine intake, can help.',
    image: goutInfoImage?.imageUrl || '',
    author: {
      '@type': 'Organization',
      name: 'Gouty',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Gouty',
      logo: {
        '@type': 'ImageObject',
        url: 'https://gouty.app/logo.png',
      },
    },
    datePublished: '2024-07-25T12:00:00Z',
    dateModified: '2024-07-25T12:00:00Z',
  };

  return (
    <div className="space-y-8">
      <StructuredData data={articleSchema} />
      <header className="relative mb-8 overflow-hidden rounded-lg">
        {goutInfoImage && (
          <Image
            src={goutInfoImage.imageUrl}
            alt={goutInfoImage.description}
            width={1200}
            height={400}
            className="h-64 w-full object-cover"
            data-ai-hint={goutInfoImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 p-8">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-white md:text-5xl">
            Understanding Gout
          </h1>
          <p className="mt-2 max-w-2xl text-lg text-white/90">
            A comprehensive guide to causes, symptoms, and dietary management.
          </p>
        </div>
      </header>

      <div className="grid gap-8 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>What is Gout?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Gout is a common and complex form of arthritis that can affect anyone. It's characterized by sudden, severe attacks of pain, swelling, redness, and tenderness in the joints, often the joint at the base of the big toe.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>The Role of Uric Acid</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Gout occurs when urate crystals accumulate in your joint, causing the inflammation and intense pain of a gout attack. Urate crystals can form when you have high levels of uric acid in your blood.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Dietary Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your body produces uric acid when it breaks down purines — substances that are found naturally in your body, as well as in certain foods. Managing your intake of high-purine foods can help control uric acid levels.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What are the primary causes of gout?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Gout is caused by hyperuricemia, an excess of uric acid in the blood. This can happen if your body produces too much uric acid or if your kidneys excrete too little. Factors include diet, genetics, obesity, and certain medical conditions.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What are common symptoms of a gout attack?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                A gout attack is characterized by intense joint pain, often starting in the big toe. The affected joint becomes swollen, warm, red, and extremely tender. Attacks can happen suddenly, often at night.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Which foods are high in purines?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                High-purine foods include red meat, organ meats (like liver), some types of seafood (like anchovies, sardines, and mussels), and alcoholic beverages, especially beer. This app is designed to help you identify the purine levels in various foods.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>How can I manage my diet to prevent gout attacks?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                A gout-friendly diet involves limiting high-purine foods, reducing alcohol consumption, staying hydrated by drinking plenty of water, and eating a balanced diet rich in fruits, vegetables, and whole grains. Low-fat dairy products may also help lower uric acid levels. Use the dashboard to explore food options.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
