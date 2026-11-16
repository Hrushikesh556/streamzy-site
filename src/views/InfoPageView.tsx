import React, { useEffect, useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { SEO, updateHeadTags, getOrigin } from '../services/seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import {
  ShieldCheck,
  Mail,
  FileText,
  Info,
  AlertTriangle,
  Send,
  CheckCircle,
  Database,
  Film,
  Sparkles,
  Lock,
  Eye,
  Server,
  HelpCircle,
  Clock,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface InfoPageViewProps {
  pageType: 'about' | 'contact' | 'privacy' | 'terms' | 'dmca';
}

export const InfoPageView: React.FC<InfoPageViewProps> = ({ pageType }) => {
  const { pathname } = useRouter();
  const { showToast } = useApp();

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'General Support',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const getPageData = () => {
    switch (pageType) {
      case 'about':
        return {
          title: 'About Streamzy',
          h1: 'About Streamzy',
          subtitle: 'The Next-Generation Streaming Guide & Cinematic Discovery Hub',
          desc: 'Learn about Streamzy, our comprehensive entertainment catalog, metadata architecture, and our mission to help cinephiles find what to watch next.',
          icon: <Info className="w-5 h-5" />,
        };
      case 'contact':
        return {
          title: 'Contact Support',
          h1: 'Contact Support & Inquiries',
          subtitle: 'We are here to assist with catalog feedback, technical help, and partnerships.',
          desc: 'Have a question, feedback, metadata discrepancy, or business inquiry? Reach out to the Streamzy support and editorial team.',
          icon: <Mail className="w-5 h-5" />,
        };
      case 'privacy':
        return {
          title: 'Privacy and Policy',
          h1: 'Privacy and Policy',
          subtitle: 'Last updated: January 2026 • Transparent, privacy-first entertainment discovery.',
          desc: 'Read the official Streamzy privacy statement and learn how your browsing preferences, local storage, and privacy rights are protected.',
          icon: <ShieldCheck className="w-5 h-5" />,
        };
      case 'terms':
        return {
          title: 'Terms and Conditions',
          h1: 'Terms and Conditions',
          subtitle: 'Terms and Conditions & Platform Usage Guidelines.',
          desc: 'Review the terms, conditions, disclaimers, and user conduct guidelines governing your use of the Streamzy platform and services.',
          icon: <FileText className="w-5 h-5" />,
        };
      case 'dmca':
        return {
          title: 'DMCA Notice & Policy',
          h1: 'DMCA Copyright & Content Policy',
          subtitle: 'Digital Millennium Copyright Act Notice & Content Takedown Procedure.',
          desc: 'Streamzy DMCA policy, copyright compliance notices, legal disclaimers, and designated copyright agent takedown procedures.',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
        };
    }
  };

  const data = getPageData();

  useEffect(() => {
    updateHeadTags(
      SEO.getDirectorySEO(data.title, data.desc, pathname, getOrigin())
    );
  }, [pageType, data.title, data.desc, pathname]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Your message has been submitted. Our support team will respond within 24-48 hours.', 'success');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-2 sm:px-4 py-4">
      <Breadcrumbs
        items={[
          { name: 'Home', url: '/' },
          { name: data.title, url: pathname },
        ]}
      />

      {/* Header Banner */}
      <div className="relative overflow-hidden p-6 sm:p-10 rounded-3xl bg-zinc-900/80 border border-white/10 shadow-2xl backdrop-blur-md">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-wider">
            {data.icon}
            <span>Streamzy Legal & Information</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {data.h1}
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 font-medium">{data.subtitle}</p>
          <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">{data.desc}</p>
        </div>
      </div>

      {/* Page Content Body */}
      <div className="p-6 sm:p-10 rounded-3xl bg-zinc-900/40 border border-white/10 text-zinc-300 text-sm leading-relaxed shadow-xl space-y-8">
        {/* ========================================================================= */}
        {/* ABOUT US */}
        {/* ========================================================================= */}
        {pageType === 'about' && (
          <div className="space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
                <Sparkles className="w-6 h-6 text-cyan-400" />
                <span>Our Mission & Vision</span>
              </h2>
              <p className="text-zinc-300 leading-relaxed">
                <strong>Streamzy</strong> is an all-in-one cinematic discovery hub built for film buffs, television enthusiasts, and casual viewers alike. In an era where entertainment is scattered across dozens of platforms, Streamzy streamlines the entire exploration journey—bringing together real-time trending charts, curated franchises, high-definition trailers, detailed cast filmographies, and release calendars in one lightning-fast interface.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                Whether you are tracking newly released theatrical blockbusters, diving into timeless classics from the 1990s, or looking for what is airing on television tonight, Streamzy provides structured, accessible, and intuitive exploration.
              </p>
            </section>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              <div className="p-5 rounded-2xl bg-zinc-950/70 border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Comprehensive Catalog</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Over 800,000+ movie and TV titles indexed with rich synopses, user ratings, critical accolades, genres, and release dates.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950/70 border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Film className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Curated Sagas & Franchises</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Dedicated collections for iconic universes like Marvel Cinematic Universe, Star Wars, Batman, Harry Potter, and James Bond.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950/70 border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Zero Bloat & Fast Navigation</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Zero invasive tracking, instant client-side routing, responsive multi-device support, and privacy-preserving local storage.
                </p>
              </div>
            </div>

            <section className="space-y-4 pt-4 border-t border-white/10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-cyan-400" />
                <span>Authorized Metadata Attribution</span>
              </h2>
              <p className="text-zinc-300 leading-relaxed">
                Streamzy utilizes the <strong>The Movie Database (TMDB) API</strong> to power its high-fidelity metadata, cast photos, plot summaries, user ratings, and backdrop imagery.
              </p>
              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10 text-xs text-zinc-400 flex items-start gap-3">
                <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Legal Notice:</strong> This product uses the TMDB API but is not officially endorsed, certified, or sponsored by TMDB. All movie posters, trailers, backdrop graphics, and studio logos remain the intellectual property of their respective producers and distribution studios.
                </span>
              </div>
            </section>

            <section className="space-y-3 pt-2">
              <h2 className="text-xl font-bold text-white">Platform Values</h2>
              <ul className="space-y-2 text-zinc-300 text-sm list-disc pl-5">
                <li><strong>Privacy First:</strong> We do not sell your viewing habits, require intrusive registrations, or track personal identities.</li>
                <li><strong>Accessibility:</strong> Built with semantic HTML, rich Schema.org structured data, and high-contrast WCAG compliance.</li>
                <li><strong>Speed & Polish:</strong> Seamless performance on desktop, mobile, tablet, and smart TV browsers.</li>
              </ul>
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CONTACT SUPPORT */}
        {/* ========================================================================= */}
        {pageType === 'contact' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Channels */}
              <div className="space-y-6 lg:col-span-1">
                <div className="p-6 rounded-2xl bg-zinc-950/70 border border-white/10 space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-cyan-400" />
                    <span>How can we help?</span>
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Have feedback about a movie listing, found a broken link, or want to suggest a new franchise collection? Let us know below.
                  </p>
                  
                  <div className="space-y-3 pt-2 border-t border-white/10 text-xs">
                    <div className="flex items-center gap-2.5 text-zinc-300">
                      <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>support@streamzy.site</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-zinc-300">
                      <Clock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>Response time: Within 24–48 hours</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-zinc-300">
                      <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>Global Community Support</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 space-y-2">
                  <h4 className="text-sm font-bold text-cyan-300">Looking for DMCA / Takedowns?</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    For intellectual property and copyright inquiries, please review our official{' '}
                    <a href="/pages/dmca" className="text-cyan-400 hover:underline font-bold">
                      DMCA Notice & Policy
                    </a>.
                  </p>
                </div>
              </div>

              {/* Form Area */}
              <div className="lg:col-span-2">
                {submitted ? (
                  <div className="p-8 rounded-2xl bg-zinc-950/80 border border-emerald-500/30 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Message Received!</h3>
                    <p className="text-sm text-zinc-400 max-w-md mx-auto">
                      Thank you for contacting Streamzy support. A member of our team has received your ticket and will follow up at <strong>{formData.email}</strong>.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', email: '', department: 'General Support', subject: '', message: '' });
                      }}
                      className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                          Full Name <span className="text-cyan-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Alex Mercer"
                          className="w-full bg-zinc-950 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                          Email Address <span className="text-cyan-400">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. alex@example.com"
                          className="w-full bg-zinc-950 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                          Department
                        </label>
                        <select
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          className="w-full bg-zinc-950 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        >
                          <option value="General Support">General Support</option>
                          <option value="Metadata / Bug Report">Metadata / Bug Report</option>
                          <option value="Feature Request">Feature Request</option>
                          <option value="Partnership & Press">Partnership & Press</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                          Subject <span className="text-cyan-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder="Brief summary of your inquiry"
                          className="w-full bg-zinc-950 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                        Message Details <span className="text-cyan-400">*</span>
                      </label>
                      <textarea
                        rows={6}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Please describe your question or issue in detail..."
                        className="w-full bg-zinc-950 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="px-7 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg active:scale-95"
                      >
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DMCA NOTICE & POLICY */}
        {/* ========================================================================= */}
        {pageType === 'dmca' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs font-medium space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Hosting Disclaimer & Content Clarification</span>
              </div>
              <p className="leading-relaxed">
                <strong>Streamzy does not host, upload, store, or transmit any video files, MP4 streams, or multimedia recordings on its servers.</strong> Streamzy operates strictly as an entertainment search engine and metadata directory indexer. All video players, trailers, or external links are hosted by independent, third-party content providers (such as YouTube and official distributors) with whom Streamzy maintains no ownership or direct affiliation.
              </p>
            </div>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">1. DMCA Compliance Overview</h2>
              <p>
                Streamzy respects the intellectual property rights of copyright holders and complies with the <strong>Digital Millennium Copyright Act (17 U.S.C. § 512)</strong> and global copyright regulations. It is our policy to expeditiously investigate and act upon notices of alleged copyright infringement submitted in accordance with statutory procedures.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">2. Filing a Formal DMCA Takedown Notice</h2>
              <p>
                If you are a copyright owner, or an authorized agent thereof, and believe that content accessible through Streamzy infringes upon your copyright, you may submit a formal notification containing the following information:
              </p>
              <div className="p-5 rounded-2xl bg-zinc-950/70 border border-white/10 space-y-3 text-xs text-zinc-300">
                <ul className="list-decimal pl-5 space-y-2">
                  <li>
                    <strong>Physical or Electronic Signature:</strong> An authorized signature of the person legally empowered to act on behalf of the copyright holder.
                  </li>
                  <li>
                    <strong>Identification of the Copyrighted Work:</strong> Clear description and identification of the copyrighted work claimed to have been infringed.
                  </li>
                  <li>
                    <strong>Infringing Material & Exact URL:</strong> Identification of the specific material to be removed or disabled, including the exact URL(s) on Streamzy where the link appears.
                  </li>
                  <li>
                    <strong>Contact Information:</strong> Your full name, mailing address, telephone number, and official working email address.
                  </li>
                  <li>
                    <strong>Good Faith Statement:</strong> A statement that you have a good-faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.
                  </li>
                  <li>
                    <strong>Accuracy Statement Under Penalty of Perjury:</strong> A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">3. Designated Copyright Agent</h2>
              <p>
                Please deliver all written DMCA notifications to our designated copyright contact:
              </p>
              <div className="p-5 rounded-2xl bg-zinc-950/70 border border-white/10 text-xs space-y-1.5">
                <p className="text-white font-bold">Streamzy Copyright & Legal Compliance Office</p>
                <p className="text-zinc-400">Email: <span className="text-cyan-400 font-mono">dmca@streamzy.site</span></p>
                <p className="text-zinc-400">Attn: Legal Department / DMCA Takedowns</p>
              </div>
              <p className="text-xs text-zinc-400">
                * Please allow 1 to 2 business days for our compliance team to review, verify, and action valid requests.
              </p>
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PRIVACY POLICY */}
        {/* ========================================================================= */}
        {pageType === 'privacy' && (
          <div className="space-y-6">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-cyan-400" />
                <span>1. Commitment to User Privacy</span>
              </h2>
              <p>
                At Streamzy, protecting your personal privacy is fundamental. We designed our entire architecture to minimize data collection. You can browse thousands of movies, discover TV series, watch trailers, and filter genres without creating an account or providing personal identity records.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">2. Information Collection & Usage</h2>
              <div className="space-y-2 text-zinc-300">
                <p><strong>A. Client-Side Browser Storage (LocalStorage):</strong></p>
                <p className="text-xs text-zinc-400 pl-4 border-l-2 border-cyan-500/40">
                  Streamzy stores your saved favorites, watchlist items, and media preferences directly on your own device using standard browser <code>localStorage</code>. This data never leaves your browser and is never uploaded to remote user-profiling databases.
                </p>

                <p className="pt-2"><strong>B. Server Logs & Analytics:</strong></p>
                <p className="text-xs text-zinc-400 pl-4 border-l-2 border-cyan-500/40">
                  Like standard web applications, our hosting infrastructure may collect non-identifiable technical data such as browser user-agent, operating system, and timestamp solely to maintain uptime, monitor server health, and prevent distributed denial-of-service (DDoS) attacks.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">3. Cookies & Tracking Technologies</h2>
              <p>
                Streamzy does not employ invasive cross-site advertising tracking cookies or biometric fingerprinting. Any third-party embedded content (such as YouTube trailer players) may set standard functionality cookies as governed by their respective privacy terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">4. Third-Party Services & Links</h2>
              <p>
                Our directory features links and embedded trailers from authorized sources like YouTube and TMDB. When navigating to third-party domains, their independent privacy practices and terms apply.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">5. Children’s Privacy</h2>
              <p>
                Streamzy is a general audience entertainment catalog and does not knowingly collect or solicit personal information from children under the age of 13.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">6. Updates to this Policy</h2>
              <p>
                We may periodically update this statement to reflect technological or legal enhancements. Changes become effective immediately upon posting.
              </p>
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TERMS AND CONDITIONS */}
        {/* ========================================================================= */}
        {pageType === 'terms' && (
          <div className="space-y-6">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
              <p>
                By accessing, browsing, or using Streamzy, you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions and all applicable national and international laws. If you do not agree with any part of these terms, you must discontinue using the platform.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">2. Permitted Use & Platform Scope</h2>
              <p>
                Streamzy is provided for personal, non-commercial entertainment and research purposes. Users agree not to:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-zinc-400">
                <li>Deploy automated scrapers, bots, or extraction scripts in a manner that degrades service availability.</li>
                <li>Attempt to bypass security barriers or perform unauthorized penetration testing.</li>
                <li>Misrepresent affiliation with Streamzy or rights-holders.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">3. Intellectual Property Rights</h2>
              <p>
                All application code, visual user interface design, logos, and custom graphics created by Streamzy are protected by intellectual property laws. Movie titles, promotional posters, synopsis excerpts, and studio logos are the property of their respective copyright holders and are utilized under fair-use metadata indexing principles.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">4. Disclaimer of Warranties</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. STREAMZY MAKES NO GUARANTEES CONCERNING THE ACCURACY, TIMELINESS, OR CONTINUOUS AVAILABILITY OF THIRD-PARTY METADATA OR EXTERNAL CONTENT.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">5. Limitation of Liability</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                In no event shall Streamzy, its operators, or contributors be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your access to or inability to access the service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-white">6. Changes to Terms</h2>
              <p>
                We reserve the right to revise or replace these terms at any time. Continued use of Streamzy following modifications constitutes binding acceptance of the updated terms.
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoPageView;
