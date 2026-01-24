import type { Thing } from 'schema-dts';

export default function StructuredData({ data }: { data: Thing }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      key="structured-data"
    />
  );
}
