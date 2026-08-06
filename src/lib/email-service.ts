import emailjs from "@emailjs/browser";

export type EmailJSConfig = {
  serviceId: string;
  leadTemplateId: string;
  subscriberTemplateId: string;
  publicKey: string;
  enabled: boolean;
};

const CONFIG_KEY = "doodle_emailjs_config";

export function getEmailJSConfig(): EmailJSConfig {
  if (typeof window === "undefined") {
    return {
      serviceId: "",
      leadTemplateId: "",
      subscriberTemplateId: "",
      publicKey: "",
      enabled: false,
    };
  }
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return {
    serviceId: "",
    leadTemplateId: "",
    subscriberTemplateId: "",
    publicKey: "",
    enabled: false,
  };
}

export function saveEmailJSConfig(config: EmailJSConfig) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export async function sendLeadNotification(lead: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  const config = getEmailJSConfig();
  console.log("[Email Service] Lead submission received:", lead);

  if (config.enabled && config.serviceId && config.leadTemplateId && config.publicKey) {
    try {
      await emailjs.send(
        config.serviceId,
        config.leadTemplateId,
        {
          to_email: "saiprithvi0705@gmail.com",
          from_name: lead.name,
          from_email: lead.email,
          subject: lead.subject || "New Portfolio Contact Message",
          message: lead.message,
          submitted_at: new Date().toLocaleString(),
        },
        config.publicKey
      );
      console.log("[Email Service] Lead notification sent successfully via EmailJS.");
      return true;
    } catch (err) {
      console.warn("[Email Service] EmailJS dispatch note:", err);
    }
  } else {
    console.info(
      "[Email Service] EmailJS credentials not set. Lead stored in Supabase & Lead CRM. Configure EmailJS in Admin Settings to enable email delivery."
    );
  }
  return false;
}

export async function sendAdminSubscriberNotification(subscriber: {
  email: string;
  name?: string;
  source?: string;
  subscribed_at?: string;
}): Promise<boolean> {
  const config = getEmailJSConfig();
  const dateStr = subscriber.subscribed_at || new Date().toLocaleString();
  console.log("[Email Service] Admin notification for new newsletter subscriber:", subscriber);

  if (config.enabled && config.serviceId && config.leadTemplateId && config.publicKey) {
    try {
      await emailjs.send(
        config.serviceId,
        config.leadTemplateId,
        {
          to_email: "saiprithvi0705@gmail.com",
          from_name: subscriber.name || "New Newsletter Subscriber",
          from_email: subscriber.email,
          subject: `🔔 New Newsletter Subscription: ${subscriber.email}`,
          message: `A new visitor subscribed to the newsletter!\n\nEmail: ${subscriber.email}\nName: ${subscriber.name || "N/A"}\nDate/Time: ${dateStr}\nSource: ${subscriber.source || "Public Portfolio Newsletter Form"}`,
          submitted_at: dateStr,
        },
        config.publicKey
      );
      console.log("[Email Service] Admin notification email sent successfully to saiprithvi0705@gmail.com.");
      return true;
    } catch (err) {
      console.warn("[Email Service] EmailJS admin subscriber notification note:", err);
    }
  } else {
    console.info(
      `[Email Service] Subscriber stored in Supabase & CMS. Admin notification for ${subscriber.email} queued. Enable EmailJS in Admin Settings to receive email alerts.`
    );
  }
  return false;
}

export async function sendSubscriberConfirmation(subscriber: {
  email: string;
  name?: string;
  source?: string;
}): Promise<boolean> {
  const config = getEmailJSConfig();
  console.log("[Email Service] New newsletter subscriber:", subscriber);

  // 1. Send admin notification email to saiprithvi0705@gmail.com
  void sendAdminSubscriberNotification({
    email: subscriber.email,
    name: subscriber.name,
    source: subscriber.source || "Public Portfolio",
    subscribed_at: new Date().toLocaleString(),
  });

  // 2. Send confirmation email to subscriber
  if (config.enabled && config.serviceId && config.subscriberTemplateId && config.publicKey) {
    try {
      await emailjs.send(
        config.serviceId,
        config.subscriberTemplateId,
        {
          to_email: subscriber.email,
          subscriber_name: subscriber.name || "Developer",
          subscribed_at: new Date().toLocaleString(),
        },
        config.publicKey
      );
      console.log("[Email Service] Subscriber confirmation email sent successfully.");
      return true;
    } catch (err) {
      console.warn("[Email Service] EmailJS subscriber confirmation note:", err);
    }
  }
  return false;
}
