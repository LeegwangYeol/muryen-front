import { SITE, CONTACT, ANALYTICS, KEYWORDS } from "@/lib/contact";

describe("Contact and Site Metadata (lib/contact.ts)", () => {
  describe("SITE configuration", () => {
    it("contains valid site URLs and identity information", () => {
      expect(SITE.url).toMatch(/^https?:\/\//);
      expect(SITE.name).toBe("무련");
      expect(SITE.hanja).toBe("武聯");
      expect(SITE.fullName).toContain("무련");
      expect(SITE.tagline).toBeTruthy();
      expect(SITE.slogan).toBeTruthy();
      expect(SITE.description).toBeTruthy();
    });

    it("specifies correct operation and participation details", () => {
      expect(SITE.location).toBe("서울");
      expect(SITE.schedule).toContain("주말");
      expect(SITE.fee).toBe("회비 없음");
      expect(SITE.entryBarrier).toContain("숙련도 무관");
    });
  });

  describe("CONTACT configuration", () => {
    it("contains a valid YouTube channel URL", () => {
      expect(CONTACT.youtube).toMatch(/^https:\/\/(www\.)?youtube\.com\/@/);
    });

    it("has inquiry notice defined", () => {
      expect(typeof CONTACT.inquiryNotice).toBe("string");
      expect(CONTACT.inquiryNotice.length).toBeGreaterThan(0);
    });

    it("supports optional channels (instagram and openChat)", () => {
      expect(CONTACT.instagram === null || typeof CONTACT.instagram === "string").toBe(true);
      expect(CONTACT.openChat === null || typeof CONTACT.openChat === "string").toBe(true);
    });
  });

  describe("ANALYTICS configuration", () => {
    it("contains valid Google Analytics 4 measurement ID format", () => {
      expect(ANALYTICS.ga4).toMatch(/^G-[A-Z0-9]+$/);
    });

    it("contains Naver analytics identifier or null", () => {
      expect(ANALYTICS.naver === null || typeof ANALYTICS.naver === "string").toBe(true);
    });
  });

  describe("KEYWORDS list", () => {
    it("is an array of non-empty strings with key martial arts terminology", () => {
      expect(Array.isArray(KEYWORDS)).toBe(true);
      expect(KEYWORDS.length).toBeGreaterThan(5);
      expect(KEYWORDS).toContain("무련");
      expect(KEYWORDS).toContain("24반 무예");
      expect(KEYWORDS).toContain("갑주 대련");
      expect(KEYWORDS).toContain("무예도보통지");
    });
  });
});
