import { Faq } from '@/components/Faq';
import { Footer } from '@/components/Footer';
import { FormSection } from '@/components/FormSection';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Motion } from '@/components/Motion';
import { Package } from '@/components/Package';
import { Problems } from '@/components/Problems';
import { Process } from '@/components/Process';
import { Services } from '@/components/Services';
import { StickyCta } from '@/components/StickyCta';
import { Trust } from '@/components/Trust';
import { FAQ } from '@/lib/site';

// FAQPage: ті самі тексти, що й видимий блок FAQ
const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <Header />
      <main>
        <Hero />
        <Problems />
        <Services />
        <Package />
        <Process />
        <Trust />
        <Faq />
        <FormSection />
      </main>
      <Footer />
      <StickyCta />
      <Motion />
    </>
  );
}
