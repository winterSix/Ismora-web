import { FeaturePanel, PanelCopy, PanelMedia } from './featureParts';

/** Stacked, non-animated rendering — used as the mobile / reduced-motion fallback. */
export function FeatureSection({
  id,
  tag,
  title,
  paragraph,
  items,
  image,
  imageAlt,
  imageSide,
}: FeaturePanel) {
  const media = <PanelMedia image={image} imageAlt={imageAlt} />;
  const copy = (
    <PanelCopy tag={tag} title={title} paragraph={paragraph} items={items} />
  );

  return (
    <section id={id} style={{ background: '#0e0e0e' }} className="py-[clamp(56px,9vw,120px)]">
      <div className="shell flex flex-col items-center justify-center gap-12 md:flex-row md:gap-[100px]">
        {imageSide === 'left' ? (
          <>
            <div className="order-1">{media}</div>
            <div className="order-2">{copy}</div>
          </>
        ) : (
          <>
            <div className="order-2 md:order-1">{copy}</div>
            <div className="order-1 md:order-2">{media}</div>
          </>
        )}
      </div>
    </section>
  );
}
