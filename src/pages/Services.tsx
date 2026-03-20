import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Check, ArrowRight, ArrowLeft, ShoppingCart, Car, Truck, Bus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/PageHero";
import { CAR_BRANDS } from "@/data/carBrands";
import { VEHICLE_CATEGORIES, getPrice } from "@/data/pricing";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import interiorImg from "@/assets/detail-interior.jpg";
import exteriorImg from "@/assets/detail-exterior.jpg";
import waxImg from "@/assets/detail-wax.jpg";
import heroServices from "@/assets/hero-services.jpg";

const CATEGORY_ICONS: Record<string, typeof Car> = {
  Car: Car, CrossOver: Car, SUV: Truck, "X-Large": Truck, "RV/Boat/Semi": Bus,
};

const services = [
  { id: "interior", name: "Interior Only", image: interiorImg, features: ["Full vacuum & steam clean", "Leather conditioning", "Dashboard & console detail", "Window cleaning", "Odor elimination", "Air vent cleaning"] },
  { id: "exterior", name: "Exterior Only", image: exteriorImg, features: ["Hand wash & dry", "Clay bar treatment", "Machine polish", "Sealant application", "Tire & rim detail", "Trim restoration"] },
  { id: "superwax", name: "Super Wax Detail", image: waxImg, popular: true, features: ["Complete interior detail", "Full exterior detail", "Premium ceramic wax", "Paint correction", "Engine bay cleaning", "Headlight restoration"] },
];

export default function ServicesPage() {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addItem, items } = useCart();

  const handleAddToCart = (serviceType: string, vehicleCategory: string) => {
    const price = getPrice(serviceType, vehicleCategory);
    if (!price) return;
    addItem({ id: `${selectedBrand}-${serviceType}-${vehicleCategory}-${Date.now()}`, brand: selectedBrand!, serviceType, vehicleCategory, price });
    toast.success(`${serviceType} (${vehicleCategory}) added to cart!`);
    navigate("/book");
  };

  return (
    <>
      <PageHero
        backgroundImage={heroServices}
        subtitle="Our Services"
        title="Detailing Packages & Pricing"
        description="Select your car brand, pick a service, and choose your vehicle category."
      >
        {items.length > 0 && (
          <div className="flex justify-center mt-6">
            <Link to="/book">
              <Button className="bg-gradient-sky text-primary-foreground font-semibold btn-glow hover:opacity-90">
                <ShoppingCart className="w-4 h-4 mr-2" /> View Cart ({items.length}) — ${items.reduce((s, i) => s + i.price, 0).toFixed(2)}
              </Button>
            </Link>
          </div>
        )}
      </PageHero>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <AnimatePresence mode="wait">
            {!selectedBrand && (
              <motion.div key="brands" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h3 className="font-display text-2xl font-bold text-foreground mb-8 text-center">Select Your Car Brand</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 lg:gap-6">
                  {CAR_BRANDS.map((brand, i) => (
                    <motion.button
                      key={brand.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      onClick={() => setSelectedBrand(brand.name)}
                      className="bg-gradient-card border border-border rounded-xl p-4 sm:p-6 text-center card-hover shine-hover transition-all duration-300 group"
                    >
                      {brand.logo ? (
                        <img src={brand.logo} alt={brand.name} className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 object-contain filter invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling && ((e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex'); }} />
                      ) : null}
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 rounded-full bg-primary/10 border border-primary/30 items-center justify-center text-primary text-2xl ${brand.logo ? 'hidden' : 'flex'}`}>
                        <Car className="w-7 h-7" />
                      </div>
                      <span className="text-foreground font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">{brand.name}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {selectedBrand && !selectedService && (
              <motion.div key="services" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <button onClick={() => setSelectedBrand(null)} className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors text-hover-glow">
                  <ArrowLeft className="w-4 h-4" /> Back to Brands
                </button>
                <h3 className="font-display text-2xl font-bold text-foreground mb-2 text-center">
                  Services for <span className="text-gradient-sky">{selectedBrand}</span>
                </h3>
                <p className="text-muted-foreground text-center mb-8">Choose a detailing package</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {services.map((svc, i) => (
                    <motion.div key={svc.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -8 }} onClick={() => setSelectedService(svc.name)} className={`cursor-pointer bg-gradient-card border rounded-xl overflow-hidden card-hover shine-hover transition-all duration-300 ${svc.popular ? "border-primary shadow-sky" : "border-border"}`}>
                      <div className="relative h-40 sm:h-48 overflow-hidden">
                        <img src={svc.image} alt={svc.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                        {svc.popular && <div className="absolute top-3 left-3 bg-gradient-sky text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>}
                      </div>
                      <div className="p-4 sm:p-6">
                        <h4 className="font-display text-lg sm:text-xl font-bold text-foreground mb-3">{svc.name}</h4>
                        <div className="space-y-1.5 mb-4">
                          {svc.features.slice(0, 4).map((f) => (
                            <div key={f} className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground"><Check className="w-3.5 h-3.5 text-primary flex-shrink-0" /> {f}</div>
                          ))}
                        </div>
                        <Button className="w-full bg-gradient-sky text-primary-foreground font-semibold btn-glow hover:opacity-90 text-sm">Select & Choose Category <ArrowRight className="ml-2 w-4 h-4" /></Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {selectedBrand && selectedService && (
              <motion.div key="categories" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <button onClick={() => setSelectedService(null)} className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors text-hover-glow">
                  <ArrowLeft className="w-4 h-4" /> Back to Services
                </button>
                <div className="text-center mb-10">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-2">
                    <span className="text-gradient-sky">{selectedService}</span> for {selectedBrand}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base">Select your vehicle category to see pricing</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 max-w-6xl mx-auto">
                  {VEHICLE_CATEGORIES.map((cat, i) => {
                    const Icon = CATEGORY_ICONS[cat] || Car;
                    const price = getPrice(selectedService, cat);
                    const isPopular = cat === "SUV";
                    return (
                      <motion.div 
                        key={cat} 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: i * 0.08 }} 
                        whileHover={{ y: -8, scale: 1.03 }} 
                        className={`relative bg-gradient-card rounded-2xl overflow-hidden card-hover shine-hover transition-all duration-300 ${isPopular ? 'border-2 border-primary shadow-sky' : 'border border-border'}`}
                      >
                        {isPopular && (
                          <div className="absolute top-0 left-0 right-0 bg-gradient-sky text-primary-foreground text-xs font-bold py-1.5 text-center uppercase tracking-wider">
                            Most Popular
                          </div>
                        )}
                        <div className={`p-6 ${isPopular ? 'pt-10' : ''}`}>
                          <div className="flex flex-col items-center text-center mb-5">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${isPopular ? 'bg-primary/20 border-2 border-primary/50' : 'bg-primary/10 border border-primary/30'}`}>
                              <Icon className={`w-8 h-8 ${isPopular ? 'text-primary' : 'text-primary/80'}`} />
                            </div>
                            <h4 className="text-foreground font-bold text-lg mb-1">{cat}</h4>
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-display font-bold text-gradient-sky">${price?.toFixed(0)}</span>
                              <span className="text-muted-foreground text-sm">.{((price || 0) % 1).toFixed(2).substring(2)}</span>
                            </div>
                          </div>
                          <div className="space-y-2 mb-5">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Check className="w-4 h-4 text-primary flex-shrink-0" />
                              <span>Full {selectedService}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Check className="w-4 h-4 text-primary flex-shrink-0" />
                              <span>Premium Products</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Check className="w-4 h-4 text-primary flex-shrink-0" />
                              <span>Expert Service</span>
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleAddToCart(selectedService, cat)} 
                            className={`w-full font-semibold ${isPopular ? 'bg-gradient-sky text-primary-foreground btn-glow' : 'bg-secondary hover:bg-secondary/80 text-foreground border border-border'}`}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
