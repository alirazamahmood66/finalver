import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarIcon, Car, Trash2, ShoppingCart, CheckCircle, AlertCircle, X, Check, Tag, Clock } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import PageHero from "@/components/PageHero";
import { TIME_SLOTS } from "@/data/pricing";
import { useCart } from "@/contexts/CartContext";
import { API_ENDPOINTS, API_BASE_URL } from "@/config/api";
import heroBook from "@/assets/hero-book.jpg";

interface Coupon {
  _id: string;
  code: string;
  discountPercentage: number;
  expiryDate: string;
}

export default function BookPage() {
  const { items, removeItem, clearCart, total: cartTotal } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'success' | 'error'>('success');
  const [dialogMessage, setDialogMessage] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [validatedCoupon, setValidatedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");

  // US States list
  const US_STATES = [
    { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" }, { code: "AZ", name: "Arizona" },
    { code: "AR", name: "Arkansas" }, { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
    { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" }, { code: "FL", name: "Florida" },
    { code: "GA", name: "Georgia" }, { code: "HI", name: "Hawaii" }, { code: "ID", name: "Idaho" },
    { code: "IL", name: "Illinois" }, { code: "IN", name: "Indiana" }, { code: "IA", name: "Iowa" },
    { code: "KS", name: "Kansas" }, { code: "KY", name: "Kentucky" }, { code: "LA", name: "Louisiana" },
    { code: "ME", name: "Maine" }, { code: "MD", name: "Maryland" }, { code: "MA", name: "Massachusetts" },
    { code: "MI", name: "Michigan" }, { code: "MN", name: "Minnesota" }, { code: "MS", name: "Mississippi" },
    { code: "MO", name: "Missouri" }, { code: "MT", name: "Montana" }, { code: "NE", name: "Nebraska" },
    { code: "NV", name: "Nevada" }, { code: "NH", name: "New Hampshire" }, { code: "NJ", name: "New Jersey" },
    { code: "NM", name: "New Mexico" }, { code: "NY", name: "New York" }, { code: "NC", name: "North Carolina" },
    { code: "ND", name: "North Dakota" }, { code: "OH", name: "Ohio" }, { code: "OK", name: "Oklahoma" },
    { code: "OR", name: "Oregon" }, { code: "PA", name: "Pennsylvania" }, { code: "RI", name: "Rhode Island" },
    { code: "SC", name: "South Carolina" }, { code: "SD", name: "South Dakota" }, { code: "TN", name: "Tennessee" },
    { code: "TX", name: "Texas" }, { code: "UT", name: "Utah" }, { code: "VT", name: "Vermont" },
    { code: "VA", name: "Virginia" }, { code: "WA", name: "Washington" }, { code: "WV", name: "West Virginia" },
    { code: "WI", name: "Wisconsin" }, { code: "WY", name: "Wyoming" }, { code: "DC", name: "Washington D.C." }
  ];

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    streetAddress: "",
    aptUnit: "",
    city: "",
    state: "",
    zipCode: "",
    make: "",
    vehicleModel: "",
    year: "",
    promoCode: "",
    timeSlot: "",
    vehicleCategory: "",
  });
  const [date, setDate] = useState<Date>();
  const [stateSearch, setStateSearch] = useState("");

  // Check for stored coupon from popup on mount
  useEffect(() => {
    const storedCode = localStorage.getItem("discount_code");
    if (storedCode) {
      // Don't remove immediately - keep it for next visit
      validateCoupon(storedCode);
    }
  }, []);

  // Validate coupon code when user enters it
  const validateCoupon = async (code: string) => {
    setCouponCode(code.toUpperCase());
    setCouponError("");
    setValidatedCoupon(null);

    if (!code.trim()) return;

    const upperCode = code.toUpperCase();

    // Check for hardcoded FIRST10 legacy code
    if (upperCode === "FIRST10") {
      setValidatedCoupon({
        _id: "legacy",
        code: "FIRST10",
        discountPercentage: 10,
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
      });
      setCouponError("");
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.COUPONS.LIST_ACTIVE);
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        const found = data.data.find((c: any) => c.code === upperCode);
        if (found) {
          setValidatedCoupon(found);
          setCouponError("");
        } else {
          setCouponError("Invalid or expired coupon code");
          setValidatedCoupon(null);
        }
      }
    } catch (error) {
      console.error("[v0] Error validating coupon:", error);
      setCouponError("Error validating coupon code");
    }
  };

  // Calculate discount from validated coupon
  const discount = validatedCoupon ? (cartTotal * validatedCoupon.discountPercentage) / 100 : 0;
  const finalTotal = Math.max(0, cartTotal - discount);

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.email || !date || !form.timeSlot) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty. Add services from the Services page.");
      return;
    }

    setIsLoading(true);
    try {
      const serviceType = items.map(item => item.serviceType).join(", ");
      
      // Build coupons array with discount details
      const couponsArray = validatedCoupon ? [
        {
          code: validatedCoupon.code,
          discountPercentage: validatedCoupon.discountPercentage,
          discountAmount: discount,
        }
      ] : [];

      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          phone: form.phone,
          email: form.email,
          address: form.address,
          vehicleName: form.vehicleName,
          make: form.make,
          vehicleModel: form.vehicleModel,
          year: form.year,
          serviceType: serviceType,
          vehicleCategory: items[0]?.vehicleCategory || "Car",
          date: date?.toISOString().split('T')[0],
          timeSlot: form.timeSlot,
          basePrice: cartTotal,
          coupons: couponsArray,
          totalDiscount: discount,
          discountApplied: validatedCoupon !== null,
          totalPrice: finalTotal,
          status: "Pending",
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setDialogType('error');
        setDialogMessage(data.message || "Failed to create appointment");
        setShowDialog(true);
        return;
      }

      setDialogType('success');
      setDialogMessage("Appointment request submitted! We'll confirm your booking shortly.");
      setShowDialog(true);
      clearCart();
      setCouponCode("");
      setValidatedCoupon(null);
      setCouponError("");
      setForm({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        vehicleName: "",
        make: "",
        vehicleModel: "",
        year: "",
        promoCode: "",
        timeSlot: "",
        vehicleCategory: "",
      });
      setDate(undefined);
    } catch (error) {
      console.error("Booking error:", error);
      setDialogType('error');
      setDialogMessage("Network error. Please try again.");
      setShowDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHero backgroundImage={heroBook} subtitle="Book Now" title="Schedule Your Detail" description="Review your selected services and fill out the form below." />

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <motion.form initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="space-y-8">
            {/* Cart Items */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-card border border-primary/30 rounded-xl p-6 lg:p-8 space-y-4 card-hover">
              <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" /> Your Cart ({items.length})
              </h3>
              {items.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4">No services selected. <a href="/services" className="text-primary hover:underline text-hover-glow">Browse services</a></p>
              ) : (
                <div className="space-y-3">
                  {items.map((item, i) => (
                    <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between bg-secondary/50 rounded-lg p-4 border border-border shine-hover">
                      <div>
                        <div className="text-foreground font-semibold">{item.serviceType}</div>
                        <div className="text-xs text-muted-foreground">{item.brand} · {item.vehicleCategory}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-primary font-bold">${item.price.toFixed(2)}</span>
                        <button type="button" onClick={() => removeItem(item.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Personal Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gradient-card border border-border rounded-xl p-6 lg:p-8 space-y-4 card-hover">
              <h3 className="font-display text-xl font-bold text-foreground">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div><Label className="text-foreground">Full Name *</Label><Input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="John Doe" className="bg-secondary border-border text-foreground mt-1" /></div>
                <div><Label className="text-foreground">Cell Number *</Label><Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="(555) 123-4567" className="bg-secondary border-border text-foreground mt-1" /></div>
                <div><Label className="text-foreground">Email *</Label><Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="john@example.com" className="bg-secondary border-border text-foreground mt-1" /></div>
                <div><Label className="text-foreground">Address</Label><Input value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="123 Main St" className="bg-secondary border-border text-foreground mt-1" /></div>
              </div>
            </motion.div>

            {/* Vehicle Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-card border border-border rounded-xl p-6 lg:p-8 space-y-4 card-hover">
              <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-2"><Car className="w-5 h-5 text-primary" /> Vehicle Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div><Label className="text-foreground">Vehicle Name</Label><Input value={form.vehicleName} onChange={(e) => update("vehicleName", e.target.value)} placeholder="e.g. Tesla Model 3" className="bg-secondary border-border text-foreground mt-1" /></div>
                <div><Label className="text-foreground">Make</Label><Input value={form.make} onChange={(e) => update("make", e.target.value)} placeholder="e.g. Tesla" className="bg-secondary border-border text-foreground mt-1" /></div>
                <div><Label className="text-foreground">Model</Label><Input value={form.vehicleModel} onChange={(e) => update("vehicleModel", e.target.value)} placeholder="e.g. Model 3" className="bg-secondary border-border text-foreground mt-1" /></div>
                <div>
                  <Label className="text-foreground">Year</Label>
                  <Select value={form.year} onValueChange={(v) => update("year", v)}>
                    <SelectTrigger className="bg-secondary border-border text-foreground mt-1">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border max-h-60">
                      {Array.from({ length: 35 }, (_, i) => new Date().getFullYear() + 1 - i).map((year) => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>

            {/* Scheduling */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-card border border-primary/30 rounded-xl p-6 lg:p-8 space-y-5 card-hover">
              <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" /> Schedule Your Appointment
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-foreground font-medium flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary font-bold">1</span>
                    Select Date *
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className={cn(
                          "w-full justify-start text-left font-medium bg-secondary/50 border-primary/30 hover:border-primary/50 hover:bg-primary/10 transition-all duration-200 h-12",
                          !date && "text-muted-foreground",
                          date && "border-primary/50 bg-primary/10 text-foreground"
                        )}
                      >
                        <CalendarIcon className={cn("mr-3 h-5 w-5", date ? "text-primary" : "text-muted-foreground")} />
                        {date ? format(date, "EEEE, MMMM d, yyyy") : "Choose your preferred date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-card border-primary/30 shadow-xl shadow-primary/10" align="start">
                      <Calendar mode="single" selected={date} onSelect={setDate} disabled={(d) => d < new Date()} initialFocus className="pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground font-medium flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary font-bold">2</span>
                    Select Time *
                  </Label>
                  <Select value={form.timeSlot} onValueChange={(v) => update("timeSlot", v)}>
                    <SelectTrigger className={cn(
                      "bg-secondary/50 border-primary/30 hover:border-primary/50 text-foreground h-12 transition-all duration-200",
                      form.timeSlot && "border-primary/50 bg-primary/10"
                    )}>
                      <div className="flex items-center">
                        <Clock className={cn("mr-3 h-5 w-5", form.timeSlot ? "text-primary" : "text-muted-foreground")} />
                        <SelectValue placeholder="Choose your preferred time" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-card border-primary/30 shadow-xl shadow-primary/10">
                      {TIME_SLOTS.map((t) => (
                        <SelectItem key={t} value={t} className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer">
                          <span className="font-medium">{t}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {date && form.timeSlot && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/30"
                >
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <p className="text-sm text-foreground">
                    <span className="font-semibold text-primary">Appointment:</span> {format(date, "EEEE, MMMM d")} at {form.timeSlot}
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Promo & Pricing */}
            {items.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-gradient-card border border-primary/30 rounded-xl p-6 lg:p-8 space-y-4 card-hover">
                <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-2"><Tag className="w-5 h-5 text-primary" /> Apply Coupon Code</h3>
                
                {/* Coupon Input */}
                <div className="space-y-2">
                  <Label className="text-foreground">Enter Coupon Code</Label>
                  <Input
                    type="text"
                    value={couponCode}
                    onChange={(e) => validateCoupon(e.target.value)}
                    placeholder="Enter your coupon code"
                    className="bg-secondary border-border text-foreground uppercase"
                  />
                  {couponError && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {couponError}</p>}
                  {validatedCoupon && (
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold text-primary">{validatedCoupon.code} Applied</p>
                        <p className="text-sm text-muted-foreground">{validatedCoupon.discountPercentage}% discount</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-border pt-4 space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm"><span className="text-muted-foreground">{item.serviceType} ({item.vehicleCategory})</span><span className="text-foreground">${item.price.toFixed(2)}</span></div>
                  ))}
                  <div className="flex justify-between text-sm border-t border-border pt-2"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">${cartTotal.toFixed(2)}</span></div>
                  
                  {/* Show coupon discount if applied */}
                  {validatedCoupon && (
                    <div className="flex justify-between text-sm">
                      <span className="text-primary">{validatedCoupon.code} ({validatedCoupon.discountPercentage}%)</span>
                      <span className="text-primary">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-lg font-bold border-t border-border pt-2"><span className="text-foreground">Total</span><span className="text-gradient-sky">${finalTotal.toFixed(2)}</span></div>
                </div>
              </motion.div>
            )}

            <Button type="submit" disabled={isLoading} size="lg" className="w-full bg-gradient-sky text-primary-foreground font-semibold text-lg btn-glow hover:scale-[1.02] duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? "Submitting..." : "Submit Booking Request"}
            </Button>
          </motion.form>
        </div>
      </section>

      {/* Success/Error Dialog */}
      {showDialog && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/50">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-card border border-border rounded-xl p-8 max-w-sm w-full shadow-xl">
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${dialogType === 'success' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                {dialogType === 'success' ? (
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  {dialogType === 'success' ? 'Success' : 'Error'}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">{dialogMessage}</p>
                <Button onClick={() => setShowDialog(false)} className={`w-full ${dialogType === 'success' ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}>
                  Close
                </Button>
              </div>
              <button onClick={() => setShowDialog(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
