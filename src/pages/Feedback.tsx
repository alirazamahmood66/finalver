import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Star, CheckCircle, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import PageHero from "@/components/PageHero";
import heroContact from "@/assets/hero-contact.jpg";

export default function FeedbackPage() {
  const [form, setForm] = useState({ name: "", email: "", rating: 0, title: "", feedback: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'success' | 'error'>('success');
  const [dialogMessage, setDialogMessage] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://gisserver.vercel.app/api";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || form.rating === 0 || !form.title || !form.feedback) {
      toast.error("Please fill in all fields and select a rating.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          rating: form.rating,
          title: form.title,
          feedback: form.feedback,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setDialogType('error');
        setDialogMessage(data.message || "Failed to submit feedback");
        setShowDialog(true);
        return;
      }

      setDialogType('success');
      setDialogMessage("Thank you for your feedback! We appreciate your review and will review it shortly.");
      setShowDialog(true);
      setForm({ name: "", email: "", rating: 0, title: "", feedback: "" });
    } catch (error) {
      console.error("Feedback error:", error);
      setDialogType('error');
      setDialogMessage("Network error. Please try again.");
      setShowDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHero 
        backgroundImage={heroContact} 
        subtitle="Share Your Experience" 
        title="Leave Us Feedback" 
        description="We'd love to hear about your experience with our service. Your feedback helps us improve!"
      />

      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }} 
              className="space-y-6"
            >
              <h3 className="font-display text-2xl font-bold text-foreground">Your Feedback Matters</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your feedback is incredibly important to us. It helps us understand what we're doing right and where we can improve to serve you better.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gradient-card border border-border rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground mb-1">Quick Process</div>
                    <p className="text-sm text-muted-foreground">Share your thoughts in just a few minutes</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gradient-card border border-border rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground mb-1">We Listen</div>
                    <p className="text-sm text-muted-foreground">Every review is read and valued by our team</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gradient-card border border-border rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground mb-1">We Improve</div>
                    <p className="text-sm text-muted-foreground">Your feedback directly influences our service improvements</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.form 
              initial={{ opacity: 0, x: 30 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }} 
              onSubmit={handleSubmit} 
              className="bg-gradient-card border border-border rounded-xl p-5 sm:p-6 lg:p-8 space-y-4 card-hover"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-foreground">Name *</Label>
                  <Input 
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })} 
                    placeholder="Your name" 
                    className="bg-secondary border-border text-foreground mt-1" 
                  />
                </div>
                <div>
                  <Label className="text-foreground">Email *</Label>
                  <Input 
                    type="email" 
                    value={form.email} 
                    onChange={(e) => setForm({ ...form, email: e.target.value })} 
                    placeholder="your@email.com" 
                    className="bg-secondary border-border text-foreground mt-1" 
                  />
                </div>
              </div>

              <div>
                <Label className="text-foreground">Rating *</Label>
                <div className="flex gap-2 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onMouseEnter={() => setHoveredRating(i + 1)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setForm({ ...form, rating: i + 1 })}
                      className="transition-transform duration-200 hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          i < (hoveredRating || form.rating)
                            ? "fill-primary text-primary"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-foreground">Title *</Label>
                <Input 
                  value={form.title} 
                  onChange={(e) => setForm({ ...form, title: e.target.value })} 
                  placeholder="e.g., Excellent service and amazing results" 
                  className="bg-secondary border-border text-foreground mt-1" 
                />
              </div>

              <div>
                <Label className="text-foreground">Feedback *</Label>
                <Textarea 
                  value={form.feedback} 
                  onChange={(e) => setForm({ ...form, feedback: e.target.value })} 
                  placeholder="Tell us about your experience..." 
                  rows={5} 
                  className="bg-secondary border-border text-foreground mt-1" 
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-gradient-sky text-primary-foreground font-semibold btn-glow hover:scale-[1.02] duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Submitting..." : "Submit Feedback"} <Send className="ml-2 w-4 h-4" />
              </Button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Success/Error Dialog */}
      {showDialog && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/50"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="bg-card border border-border rounded-xl p-8 max-w-sm w-full shadow-xl"
          >
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
                <Button 
                  onClick={() => setShowDialog(false)} 
                  className={`w-full ${dialogType === 'success' ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}
                >
                  Close
                </Button>
              </div>
              <button 
                onClick={() => setShowDialog(false)} 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
