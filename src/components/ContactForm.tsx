import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const serviceId = import.meta.env.VITE_SERVICE_ID_EMAILJS;
const templateId = import.meta.env.VITE_TEMPLATE_ID_EMAILJS;
const publicKey = import.meta.env.VITE_PUBLIC_KEY_EMAILJS;

const ContactForm = () => {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    user_name: "",
    user_contact: "",
    vehicle_registration: "",
    vehicle_mileage: "",
    service_needed: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      user_name: "",
      user_contact: "",
      vehicle_registration: "",
      vehicle_mileage: "",
      service_needed: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formRef.current || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await emailjs.sendForm(
        serviceId,
        templateId,
        formRef.current,
        publicKey
      );

      toast({
        title: "Request Submitted!",
        description:
          "We've received your enquiry and will get back to you shortly.",
      });

      resetForm();
    } catch (error: unknown) {
      console.error("EmailJS error:", error);
      toast({
        title: "Error submitting request",
        description:
          "Something went wrong. Please try again or call us on 07877 028198.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="user_name" className="block text-sm font-medium mb-1">
            Your Name
          </label>
          <Input
            id="user_name"
            name="user_name"
            value={formData.user_name}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label
            htmlFor="user_contact"
            className="block text-sm font-medium mb-1"
          >
            Your Contact Number
          </label>
          <Input
            id="user_contact"
            name="user_contact"
            value={formData.user_contact}
            onChange={handleChange}
            placeholder="0311-1234567"
            required
          />
        </div>

        <div>
          <label
            htmlFor="vehicle_registration"
            className="block text-sm font-medium mb-1"
          >
            Your Vehicle Registration
          </label>
          <Input
            id="vehicle_registration"
            name="vehicle_registration"
            value={formData.vehicle_registration}
            onChange={handleChange}
            placeholder="ABC-1234"
            required
          />
        </div>

        <div>
          <label
            htmlFor="vehicle_mileage"
            className="block text-sm font-medium mb-1"
          >
            Your Vehicle Current Mileage
          </label>
          <Input
            id="vehicle_mileage"
            name="vehicle_mileage"
            value={formData.vehicle_mileage}
            onChange={handleChange}
            placeholder="45000"
            required
          />
        </div>

        <div>
          <label
            htmlFor="service_needed"
            className="block text-sm font-medium mb-1"
          >
            How Can We Help?
          </label>
          <Textarea
            id="service_needed"
            name="service_needed"
            value={formData.service_needed}
            onChange={handleChange}
            placeholder="e.g. Interested in a vehicle, booking a service, oil change, engine diagnostics..."
            rows={4}
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-cardealer-primary hover:bg-cardealer-secondary disabled:opacity-70"
      >
        {isSubmitting ? "Sending..." : "Submit Request"}
      </Button>
    </form>
  );
};

export default ContactForm;
