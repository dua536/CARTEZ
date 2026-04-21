export default function BrandingPanel() {
  return (
    <div className="col-span-5 p-12 flex flex-col justify-between border-r border-outline-variant/20">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <div className="size-10 rounded bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: '"FILL" 1' }}>shopping_cart</span>
          </div>
          <h1 className="text-3xl font-headline font-black tracking-tight text-primary">CartZen</h1>
        </div>
        <div className="mt-8">
          <h2 className="text-5xl font-headline font-extrabold leading-tight text-on-surface">
            Elevating your <span className="text-primary">daily essentials</span>.
          </h2>
          <p className="mt-6 text-on-surface-variant text-lg leading-relaxed">
            Experience the digital sommelier of groceries. Curated freshness delivered with precision to your doorstep.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 text-on-surface-variant">
          <span className="material-symbols-outlined text-primary">verified</span>
          <span className="text-sm font-medium">Premium Hand-picked Quality</span>
        </div>
        <div className="flex items-center gap-4 text-on-surface-variant">
          <span className="material-symbols-outlined text-primary">speed</span>
          <span className="text-sm font-medium">60-Minute Urban Delivery</span>
        </div>
      </div>
    </div>
  );
}
