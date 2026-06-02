type JsonLdProps = {
  data: unknown;
};

/**
 * Renders a schema.org structured-data block. The `<` escape prevents the
 * serialized JSON from breaking out of the script tag (XSS hardening).
 */
export const JsonLd = ({ data }: JsonLdProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, "\\u003c"),
    }}
  />
);
