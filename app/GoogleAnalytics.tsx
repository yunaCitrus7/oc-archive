export default function GoogleAnalytics() {
  const measurementId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-39H0B8ZSGB";
  if (!measurementId) return null;

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: [
            "window.dataLayer = window.dataLayer || [];",
            "function gtag(){dataLayer.push(arguments);}",
            "gtag('js', new Date());",
            `gtag('config', '${measurementId}', { send_page_view: true });`,
          ].join("\n"),
        }}
      />
    </>
  );
}
