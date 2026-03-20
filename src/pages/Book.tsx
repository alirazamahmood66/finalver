import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { CalendarIcon, Car, Trash2, ShoppingCart, CheckCircle, AlertCircle, X, Tag, Clock, Search } from "lucide-react";
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

// US States with major cities
const US_STATES_CITIES: Record<string, { code: string; name: string; cities: string[] }> = {
  AL: { code: "AL", name: "Alabama", cities: ["Birmingham", "Montgomery", "Huntsville", "Mobile", "Tuscaloosa"] },
  AK: { code: "AK", name: "Alaska", cities: ["Anchorage", "Fairbanks", "Juneau", "Sitka", "Ketchikan"] },
  AZ: { code: "AZ", name: "Arizona", cities: ["Phoenix", "Tucson", "Mesa", "Scottsdale", "Chandler", "Gilbert", "Tempe"] },
  AR: { code: "AR", name: "Arkansas", cities: ["Little Rock", "Fort Smith", "Fayetteville", "Springdale", "Jonesboro"] },
  CA: { code: "CA", name: "California", cities: ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento", "Oakland", "Fresno", "Long Beach", "Bakersfield", "Anaheim"] },
  CO: { code: "CO", name: "Colorado", cities: ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Lakewood", "Boulder"] },
  CT: { code: "CT", name: "Connecticut", cities: ["Bridgeport", "New Haven", "Hartford", "Stamford", "Waterbury"] },
  DE: { code: "DE", name: "Delaware", cities: ["Wilmington", "Dover", "Newark", "Middletown", "Smyrna"] },
  FL: { code: "FL", name: "Florida", cities: ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale", "St. Petersburg", "Hialeah", "Tallahassee"] },
  GA: { code: "GA", name: "Georgia", cities: ["Atlanta", "Augusta", "Columbus", "Savannah", "Athens", "Macon"] },
  HI: { code: "HI", name: "Hawaii", cities: ["Honolulu", "Pearl City", "Hilo", "Kailua", "Waipahu"] },
  ID: { code: "ID", name: "Idaho", cities: ["Boise", "Meridian", "Nampa", "Idaho Falls", "Pocatello"] },
  IL: { code: "IL", name: "Illinois", cities: ["Chicago", "Aurora", "Naperville", "Joliet", "Rockford", "Springfield"] },
  IN: { code: "IN", name: "Indiana", cities: ["Indianapolis", "Fort Wayne", "Evansville", "South Bend", "Carmel"] },
  IA: { code: "IA", name: "Iowa", cities: ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City", "Iowa City"] },
  KS: { code: "KS", name: "Kansas", cities: ["Wichita", "Overland Park", "Kansas City", "Olathe", "Topeka"] },
  KY: { code: "KY", name: "Kentucky", cities: ["Louisville", "Lexington", "Bowling Green", "Owensboro", "Covington"] },
  LA: { code: "LA", name: "Louisiana", cities: ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette", "Lake Charles"] },
  ME: { code: "ME", name: "Maine", cities: ["Portland", "Lewiston", "Bangor", "South Portland", "Auburn"] },
  MD: { code: "MD", name: "Maryland", cities: ["Baltimore", "Frederick", "Rockville", "Gaithersburg", "Bowie"] },
  MA: { code: "MA", name: "Massachusetts", cities: ["Boston", "Worcester", "Springfield", "Cambridge", "Lowell"] },
  MI: { code: "MI", name: "Michigan", cities: ["Detroit", "Grand Rapids", "Warren", "Sterling Heights", "Ann Arbor", "Lansing"] },
  MN: { code: "MN", name: "Minnesota", cities: ["Minneapolis", "St. Paul", "Rochester", "Duluth", "Bloomington"] },
  MS: { code: "MS", name: "Mississippi", cities: ["Jackson", "Gulfport", "Southaven", "Hattiesburg", "Biloxi"] },
  MO: { code: "MO", name: "Missouri", cities: ["Kansas City", "St. Louis", "Springfield", "Columbia", "Independence"] },
  MT: { code: "MT", name: "Montana", cities: ["Billings", "Missoula", "Great Falls", "Bozeman", "Butte"] },
  NE: { code: "NE", name: "Nebraska", cities: ["Omaha", "Lincoln", "Bellevue", "Grand Island", "Kearney"] },
  NV: { code: "NV", name: "Nevada", cities: ["Las Vegas", "Henderson", "Reno", "North Las Vegas", "Sparks"] },
  NH: { code: "NH", name: "New Hampshire", cities: ["Manchester", "Nashua", "Concord", "Derry", "Rochester"] },
  NJ: { code: "NJ", name: "New Jersey", cities: ["Newark", "Jersey City", "Paterson", "Elizabeth", "Edison", "Trenton"] },
  NM: { code: "NM", name: "New Mexico", cities: ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe", "Roswell"] },
  NY: { code: "NY", name: "New York", cities: ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse", "Albany"] },
  NC: { code: "NC", name: "North Carolina", cities: ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem", "Fayetteville"] },
  ND: { code: "ND", name: "North Dakota", cities: ["Fargo", "Bismarck", "Grand Forks", "Minot", "West Fargo"] },
  OH: { code: "OH", name: "Ohio", cities: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron", "Dayton"] },
  OK: { code: "OK", name: "Oklahoma", cities: ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow", "Edmond"] },
  OR: { code: "OR", name: "Oregon", cities: ["Portland", "Salem", "Eugene", "Gresham", "Hillsboro", "Bend"] },
  PA: { code: "PA", name: "Pennsylvania", cities: ["Philadelphia", "Pittsburgh", "Allentown", "Reading", "Erie", "Harrisburg"] },
  RI: { code: "RI", name: "Rhode Island", cities: ["Providence", "Warwick", "Cranston", "Pawtucket", "East Providence"] },
  SC: { code: "SC", name: "South Carolina", cities: ["Charleston", "Columbia", "North Charleston", "Mount Pleasant", "Greenville"] },
  SD: { code: "SD", name: "South Dakota", cities: ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings", "Watertown"] },
  TN: { code: "TN", name: "Tennessee", cities: ["Nashville", "Memphis", "Knoxville", "Chattanooga", "Clarksville"] },
  TX: { code: "TX", name: "Texas", cities: ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth", "El Paso", "Arlington", "Corpus Christi", "Plano"] },
  UT: { code: "UT", name: "Utah", cities: ["Salt Lake City", "West Valley City", "Provo", "West Jordan", "Orem"] },
  VT: { code: "VT", name: "Vermont", cities: ["Burlington", "South Burlington", "Rutland", "Barre", "Montpelier"] },
  VA: { code: "VA", name: "Virginia", cities: ["Virginia Beach", "Norfolk", "Chesapeake", "Richmond", "Newport News", "Alexandria"] },
  WA: { code: "WA", name: "Washington", cities: ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue", "Kent"] },
  WV: { code: "WV", name: "West Virginia", cities: ["Charleston", "Huntington", "Morgantown", "Parkersburg", "Wheeling"] },
  WI: { code: "WI", name: "Wisconsin", cities: ["Milwaukee", "Madison", "Green Bay", "Kenosha", "Racine"] },
  WY: { code: "WY", name: "Wyoming", cities: ["Cheyenne", "Casper", "Laramie", "Gillette", "Rock Springs"] },
  DC: { code: "DC", name: "Washington D.C.", cities: ["Washington"] }
};

export default function BookPage() {
  const { items, removeItem, clearCart, total: cartTotal } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'success' | 'error'>('success');
  const [dialogMessage, setDialogMessage] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [validatedCoupon, setValidatedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");

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
    timeSlot: "",
  });
  const [date, setDate] = useState<Date>();
  const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  // Get filtered states based on search
  const filteredStates = useMemo(() => {
    const states = Object.values(US_STATES_CITIES);
    if (!stateSearch) return states;
    return states.filter(s => 
      s.name.toLowerCase().includes(stateSearch.toLowerCase()) ||
      s.code.toLowerCase().includes(stateSearch.toLowerCase())
    );
  }, [stateSearch]);

  // Get cities for selected state
  const availableCities = useMemo(() => {
    if (!form.state) return [];
    const stateData = US_STATES_CITIES[form.state];
    if (!stateData) return [];
    if (!citySearch) return stateData.cities;
    return stateData.cities.filter(c => 
      c.toLowerCase().includes(citySearch.toLowerCase())
    );
  }, [form.state, citySearch]);

  // Check for stored coupon from popup on mount
  useEffect(() => {
    const storedCode = localStorage.getItem("discount_code");
    if (storedCode) {
      validateCoupon(storedCode);
    }
  }, []);

  // Reset city when state changes
  useEffect(() => {
    if (form.state) {
      setForm(prev => ({ ...prev, city: "" }));
      setCitySearch("");
    }
  }, [form.state]);

  const validateCoupon = async (code: string) => {
    setCouponCode(code.toUpperCase());
    setCouponError("");
    setValidatedCoupon(null);

    if (!code.trim()) return;

    const upperCode = code.toUpperCase();

    if (upperCode === "FIRST10") {
      setValidatedCoupon({
        _id: "legacy",
        code: "FIRST10",
        discountPercentage: 10,
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
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
      console.error("Error validating coupon:", error);
      setCouponError("Error validating coupon code");
    }
  };

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
      
      // Build full address
      const fullAddress = [
        form.streetAddress,
        form.aptUnit ? `Apt/Unit: ${form.aptUnit}` : "",
        form.city,
        form.state,
        form.zipCode
      ].filter(Boolean).join(", ");

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
          address: fullAddress,
          streetAddress: form.streetAddress,
          aptUnit: form.aptUnit,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
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
        streetAddress: "",
        aptUnit: "",
        city: "",
        state: "",
        zipCode: "",
        make: "",
        vehicleModel: "",
        year: "",
        timeSlot: "",
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
                <div className="md:col-span-2"><Label className="text-foreground">Email *</Label><Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="john@example.com" className="bg-secondary border-border text-foreground mt-1" /></div>
              </div>
            </motion.div>

            {/* Address Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-gradient-card border border-border rounded-xl p-6 lg:p-8 space-y-4 card-hover">
              <h3 className="font-display text-xl font-bold text-foreground">Address</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label className="text-foreground">Street Address</Label>
                  <Input value={form.streetAddress} onChange={(e) => update("streetAddress", e.target.value)} placeholder="123 Main St" className="bg-secondary border-border text-foreground mt-1" />
                </div>
                <div>
                  <Label className="text-foreground">Apt/Unit (Optional)</Label>
                  <Input value={form.aptUnit} onChange={(e) => update("aptUnit", e.target.value)} placeholder="Apt 4B" className="bg-secondary border-border text-foreground mt-1" />
                </div>
                <div>
                  <Label className="text-foreground">Zip Code</Label>
                  <Input value={form.zipCode} onChange={(e) => update("zipCode", e.target.value)} placeholder="12345" className="bg-secondary border-border text-foreground mt-1" />
                </div>
                
                {/* State Dropdown with Search */}
                <div className="relative">
                  <Label className="text-foreground">State</Label>
                  <Popover open={stateDropdownOpen} onOpenChange={setStateDropdownOpen}>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-between bg-secondary border-border text-foreground mt-1 h-10"
                      >
                        {form.state ? US_STATES_CITIES[form.state]?.name : "Select state"}
                        <Search className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 bg-card border-border" align="start">
                      <div className="p-2 border-b border-border">
                        <Input
                          placeholder="Search states..."
                          value={stateSearch}
                          onChange={(e) => setStateSearch(e.target.value)}
                          className="bg-secondary border-border text-foreground"
                        />
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {filteredStates.map((state) => (
                          <button
                            key={state.code}
                            type="button"
                            className={cn(
                              "w-full px-3 py-2 text-left hover:bg-primary/10 text-foreground text-sm transition-colors",
                              form.state === state.code && "bg-primary/20 text-primary"
                            )}
                            onClick={() => {
                              update("state", state.code);
                              setStateSearch("");
                              setStateDropdownOpen(false);
                            }}
                          >
                            {state.name} ({state.code})
                          </button>
                        ))}
                        {filteredStates.length === 0 && (
                          <p className="px-3 py-2 text-muted-foreground text-sm">No states found</p>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* City Dropdown with Search */}
                <div className="relative">
                  <Label className="text-foreground">City</Label>
                  <Popover open={cityDropdownOpen} onOpenChange={setCityDropdownOpen}>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-between bg-secondary border-border text-foreground mt-1 h-10"
                        disabled={!form.state}
                      >
                        {form.city || (form.state ? "Select city" : "Select state first")}
                        <Search className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 bg-card border-border" align="start">
                      <div className="p-2 border-b border-border">
                        <Input
                          placeholder="Search cities..."
                          value={citySearch}
                          onChange={(e) => setCitySearch(e.target.value)}
                          className="bg-secondary border-border text-foreground"
                        />
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {availableCities.map((city) => (
                          <button
                            key={city}
                            type="button"
                            className={cn(
                              "w-full px-3 py-2 text-left hover:bg-primary/10 text-foreground text-sm transition-colors",
                              form.city === city && "bg-primary/20 text-primary"
                            )}
                            onClick={() => {
                              update("city", city);
                              setCitySearch("");
                              setCityDropdownOpen(false);
                            }}
                          >
                            {city}
                          </button>
                        ))}
                        {availableCities.length === 0 && form.state && (
                          <p className="px-3 py-2 text-muted-foreground text-sm">No cities found</p>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </motion.div>

            {/* Vehicle Info - Simplified */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-card border border-border rounded-xl p-6 lg:p-8 space-y-4 card-hover">
              <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-2"><Car className="w-5 h-5 text-primary" /> Vehicle Information</h3>
              <div className="grid md:grid-cols-3 gap-4">
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
