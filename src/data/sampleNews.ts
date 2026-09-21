import { SampleNews } from '../types';

export const SAMPLE_NEWS: SampleNews[] = [
  {
    id: 'sample-1',
    category: 'Science & Health (Fake Hoax)',
    title: 'NASA Confirms Earth Will Experience 15 Days of Total Darkness in November Due to Solar Alignment',
    content: 'According to a leaked report from NASA scientists, the Earth will be plunged into complete darkness starting November 15 at 3:00 AM and ending November 30. Officials at the White House and space agencies worldwide reportedly held emergency briefings regarding a rare planetary alignment between Jupiter and Venus that will trigger a massive blast of hydrogen gases, dimming the sun to a bluish shade.',
    expectedType: 'fake'
  },
  {
    id: 'sample-2',
    category: 'Space Exploration (Real News)',
    title: 'James Webb Space Telescope Discovers Oldest Known Black Hole in the Distant Universe',
    content: 'Astronomers using the James Webb Space Telescope (JWST) have identified the most distant active supermassive black hole discovered to date. Situated in the ancient galaxy CEERS 1019, which existed just over 570 million years after the Big Bang, the black hole measures about 9 million solar masses. Researchers from the University of Texas at Austin published their peer-reviewed findings, highlighting new insights into cosmic evolution.',
    expectedType: 'real'
  },
  {
    id: 'sample-3',
    category: 'Sensational Clickbait (Misleading Title)',
    title: 'Shocking Secret: Common Kitchen Spice Instantly Cures All Types of Diabetes Overnight!',
    content: 'A recent preliminary laboratory study on diabetic mice indicated that active polyphenols found in ceylon cinnamon extract may help support healthy cellular glucose uptake when combined with strict insulin therapy and standard dietary regulation. Doctors emphasize that patients must continue their prescribed medications and that no single ingredient cures diabetes.',
    expectedType: 'clickbait'
  },
  {
    id: 'sample-4',
    category: 'Tech / AI (Real News)',
    title: 'WHO Publishes New Global Guidance on Ethics and Governance of Large Multi-Modal AI Models in Healthcare',
    content: 'The World Health Organization (WHO) has released a comprehensive policy paper outlining key recommendations for governments and developers on deploying generative AI in healthcare. The guidelines identify over 40 key risks related to clinical safety, algorithmic bias, data privacy, and cybersecurity, while urging transparent validation protocols before patient-facing implementation.',
    expectedType: 'real'
  }
];
