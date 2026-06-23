import type { SiteSetting } from "@/lib/types"

export const mockSettings: SiteSetting = {
  impact: {
    tonnesProduced: 10,
    householdsServed: 800,
    farmersSupported: 250,
    jobsCreated: 35,
  },
  contact: {
    address: "Avenue du Lac, Bukavu, Sud-Kivu, RDC",
    phone: "+243 990 000 000",
    email: "contact@foodforlife.cd",
    mapUrl: "https://maps.google.com/?q=Bukavu+Sud-Kivu+RDC",
  },
  socials: {
    facebook: "https://facebook.com/foodforlife",
    instagram: "https://instagram.com/foodforlife",
    linkedin: "https://linkedin.com/company/foodforlife",
    x: "https://x.com/foodforlife",
    youtube: "https://youtube.com/@foodforlife",
  },
}
