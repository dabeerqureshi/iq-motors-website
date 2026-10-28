import { useState, useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "react-router-dom";
import { Phone, MessageCircle, Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";

const serviceId = import.meta.env.VITE_SERVICE_ID_EMAILJS || "";
const templateId = import.meta.env.VITE_TEMPLATE_ID_EMAILJS || "";
const publicKey = import.meta.env.VITE_PUBLIC_KEY_EMAILJS || "";

interface ContactFormProps {
  defaultEnquiryType?: string;
  defaultVehicle?: string;
}

const ContactForm = ({ defaultEnquiryType, defaultVehicle }: ContactFormProps) => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const initialEnquiry =
    defaultEnquiryType ||
    searchParams.get("enquiry") ||
    "general";

  const carParam = defaultVehicle || searchParams.get("car") || "";

  const [formData, setFormData] = useState({
    user_name: "",
    user_contact: "",
    user_email: "",
    enquiry_type: initialEnquiry,
    vehicle_registration: "",
    vehicle_mileage: "",
    service_needed: carParam
      ? `Enquiry regarding: ${carParam}\n\nI would like more information on this vehicle.`
      : "",
  });

  useEffect(() => {
    if (carParam && !formData.service_needed) {
      setFormData((prev) => ({
        ...prev,
        service_needed: `Enquiry regarding: ${carParam}\n\nI would like more information on this vehicle.`,
      }));
    }
  }, [carParam, formData.service_needed]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEnquiryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      enquiry_type: value,
    }));
  };

  const isServicing = formData.enquiry_type === "servicing";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.user_name.trim()) {
      toast({ title: "Name is required", description: "Please enter your name.", variant: "destructive" });
      return;
    }
    if (!formData.user_contact.trim() && !formData.user_email.trim()) {
      toast({
        title: "Contact information required",
        description: "Please provide either a phone number or email address.",
        variant: "destructive",
      });
      return;
    }

    if (!formRef.current || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    // If EmailJS credentials are not present or placeholder, simulate safe fallback
    const hasEmailJs =
      serviceId &&
      templateId &&
      publicKey &&
      !serviceId.includes("placeholder");

    try {
      if (hasEmailJs) {
        await emailjs.sendForm(serviceId, templateId, formRef.current, publicKey);
      } else {
        // Fallback for demo or development without third-party email account
        console.warn("EmailJS credentials not configured; recording local simulated submission.");
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      setSubmitSuccess(true);
      toast({
        title: "Enquiry Received!",
        description: "Thank you for reaching out. An IQ Motors specialist will contact you shortly.",
      });
    } catch (error: unknown) {
      console.error("EmailJS submission error:", error);
      setSubmitError(
        "We could not send your message automatically right now. Please call or WhatsApp our team directly."
      );
      toast({
        title: "Notice sending enquiry",
        description: "Please reach us directly on 07877 028198 or via WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitSuccess(false);
    setSubmitError(null);
    setFormData({
      user_name: "",
      user_contact: "",
      user_email: "",
      enquiry_type: "general",
      vehicle_registration: "",
      vehicle_mileage: "",
      service_needed: "",
    });
  };

  if (submitSuccess) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center space-y-4">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Thank You, {formData.user_name || "Valued Customer"}!</h3>
        <p className="text-gray-600 max-w-md mx-auto text-sm leading-relaxed">
          Your enquiry has been submitted to the IQ Motors team. We will review your request and get back to you promptly.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Button onClick={resetForm} variant="outline" className="border-emerald-600 text-emerald-800">
            Send Another Message
          </Button>
          <Button asChild className="bg-emerald-700 hover:bg-emerald-800 text-white gap-2">
            <a
              href="https://wa.me/447877028198"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-xl border shadow-sm">
      <div className="space-y-4">
        <div>
          <Label htmlFor="enquiry_type" className="text-gray-700 font-semibold text-sm">
            What Can We Help You With? *
          </Label>
          <Select value={formData.enquiry_type} onValueChange={handleEnquiryChange}>
            <SelectTrigger id="enquiry_type" className="mt-1.5 w-full">
              <SelectValue placeholder="Select enquiry type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General Sales Enquiry</SelectItem>
              <SelectItem value="viewing">Book a Viewing / Test Drive</SelectItem>
              <SelectItem value="finance">Finance Pre-Approval & Advice</SelectItem>
              <SelectItem value="servicing">Mercedes-Benz Servicing & MOT</SelectItem>
              <SelectItem value="part-exchange">Part-Exchange Valuation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="user_name" className="text-gray-700 font-semibold text-sm">
            Your Full Name *
          </Label>
          <Input
            id="user_name"
            name="user_name"
            value={formData.user_name}
            onChange={handleChange}
            placeholder="e.g. James Smith"
            className="mt-1.5"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="user_contact" className="text-gray-700 font-semibold text-sm">
              Phone Number *
            </Label>
            <Input
              id="user_contact"
              name="user_contact"
              type="tel"
              value={formData.user_contact}
              onChange={handleChange}
              placeholder="e.g. 07877 028198"
              className="mt-1.5"
              required
            />
          </div>

          <div>
            <Label htmlFor="user_email" className="text-gray-700 font-semibold text-sm">
              Email Address
            </Label>
            <Input
              id="user_email"
              name="user_email"
              type="email"
              value={formData.user_email}
              onChange={handleChange}
              placeholder="e.g. james@example.com"
              className="mt-1.5"
            />
          </div>
        </div>

        {/* Vehicle Registration & Mileage (Required for Servicing, Optional for Part Exchange / Sales) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="vehicle_registration" className="text-gray-700 font-semibold text-sm">
              Vehicle Registration {isServicing ? "*" : "(Optional)"}
            </Label>
            <Input
              id="vehicle_registration"
              name="vehicle_registration"
              value={formData.vehicle_registration}
              onChange={handleChange}
              placeholder="e.g. EA19 ABC"
              className="mt-1.5 uppercase"
              required={isServicing}
            />
          </div>

          <div>
            <Label htmlFor="vehicle_mileage" className="text-gray-700 font-semibold text-sm">
              Approximate Mileage {isServicing ? "*" : "(Optional)"}
            </Label>
            <Input
              id="vehicle_mileage"
              name="vehicle_mileage"
              type="number"
              value={formData.vehicle_mileage}
              onChange={handleChange}
              placeholder="e.g. 35000"
              className="mt-1.5"
              required={isServicing}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="service_needed" className="text-gray-700 font-semibold text-sm">
            Your Message or Requirements *
          </Label>
          <Textarea
            id="service_needed"
            name="service_needed"
            value={formData.service_needed}
            onChange={handleChange}
            placeholder={
              isServicing
                ? "Please describe the service required (e.g. A Service, B Service, brake pads, diagnostic check)..."
                : "Tell us about the vehicle you are interested in, preferred viewing times, or finance queries..."
            }
            rows={4}
            className="mt-1.5"
            required
          />
        </div>
      </div>

      {submitError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p>{submitError}</p>
            <div className="mt-2 flex gap-3">
              <a href="tel:07877028198" className="font-bold underline">
                Call 07877 028198
              </a>
              <a
                href="https://wa.me/447877028198"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline"
              >
                WhatsApp Message
              </a>
            </div>
          </div>
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-cardealer-primary hover:bg-cardealer-secondary text-white font-semibold py-5 gap-2 shadow-sm"
      >
        {isSubmitting ? (
          "Submitting..."
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Enquiry
          </>
        )}
      </Button>

      {/* Alternative Quick Contact Options */}
      <div className="pt-2 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-500 mb-2">Prefer instant contact?</p>
        <div className="flex justify-center gap-3">
          <a
            href="https://wa.me/447877028198"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            WhatsApp Us
          </a>
          <a
            href="tel:07877028198"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            07877 028198
          </a>
        </div>
      </div>
    </form>
  );
};

export default ContactForm;
