'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import StructuredData from '@/components/structured-data';
import type { WebPage } from 'schema-dts';


export default function TermsAndConditionsPage() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    setLastUpdated(new Date().toLocaleDateString());
  }, []);

  const pageSchema: WebPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Terms and Conditions - Gouty',
    description: 'Review the terms and conditions for using the Gouty application.',
    url: 'https://gouty.app/terms',
  };

  return (
    <div className="space-y-8">
      <StructuredData data={pageSchema} />
      <header className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
          Terms and Conditions
        </h1>
        <p className="text-lg text-muted-foreground">
          Last updated: {lastUpdated}
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Agreement to Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            By using our application, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, then you do not have permission to access the service.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Intellectual Property</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property of Gouty and its licensors.
          </p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle>Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            This application is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
