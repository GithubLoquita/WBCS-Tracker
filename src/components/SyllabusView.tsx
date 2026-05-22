/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BookOpen, Search, Layers, FileText, CheckCircle, Award, ListFilter, CornerDownRight, Bookmark, CheckSquare, Square, Trash2, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell, PieChart, Pie } from 'recharts';

interface SyllabusViewProps {
  // Add props if needed, but it's a self-contained layout
}

export default function SyllabusView({}: SyllabusViewProps) {
  const [activeSegment, setActiveSegment] = useState<'overview' | 'prelims' | 'mains' | 'optionals' | 'pattern'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Local state to track mastered topics
  const [masteredTopics, setMasteredTopics] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('wbcs_mastered_topics');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wbcs_mastered_topics', JSON.stringify(masteredTopics));
    } catch (e) {
      console.error("Error saving mastered topics", e);
    }
  }, [masteredTopics]);

  // Toggle helper
  const toggleTopicMastery = (topicId: string) => {
    setMasteredTopics(prev => {
      const updated = { ...prev };
      if (updated[topicId]) {
        delete updated[topicId];
      } else {
        updated[topicId] = true;
      }
      return updated;
    });
  };

  // Clear helper
  const clearAllProgress = () => {
    if (window.confirm("Are you sure you want to reset all syllabus topic preparation progress? This action cannot be undone.")) {
      setMasteredTopics({});
    }
  };

  // Syllabus data structure for interactive searching
  const prelimsSyllabus = [
    {
      subject: "English Composition",
      topics: [
        { name: "Vocabulary", details: "Synonyms & Antonyms, Homonyms, Word substitution, Use of qualifying & appropriate words" },
        { name: "Idiomatic Usage", details: "Common idioms & phrases, Proverbs, Usage in sentences" },
        { name: "Phrasal Verbs", details: "Meaning, usage, and common phrasal verb list" },
        { name: "Multiple-Meaning Words", details: "Words with more than one meaning, contextual usage" },
        { name: "Vocabulary Test", details: "Spellings, confusing words, word forms" },
        { name: "General Composition", details: "Sentence correction, basic grammar sense, and choosing the correct expression" }
      ]
    },
    {
      subject: "General Science",
      topics: [
        { name: "Scientific Awareness", details: "Observable scientific facts, laws of nature, basic scientific principles" },
        { name: "Physics (Basic)", details: "Motion, heat, light, electricity, magnetism, pressure, simple machines" },
        { name: "Chemistry (Basic)", details: "Common chemicals, acids-bases-salts, mixtures & compounds, everyday chemical reactions" },
        { name: "Biology (Basic)", details: "Human body basics, plants, animals, nutrition, health & hygiene" },
        { name: "Environment & Daily Life Science", details: "Pollution, conservation, everyday applications like soap, detergent, LPG, medicines" }
      ]
    },
    {
      subject: "History of India",
      topics: [
        { name: "Ancient India", details: "Indus Valley Civilisation, Vedic society, Buddhism & Jainism, Mauryan & Gupta eras" },
        { name: "Medieval India", details: "Sultanate, Mughals, regional kingdoms, socio-economic systems" },
        { name: "Modern India", details: "The advent of Europeans, British rule, and socio-economic changes" },
        { name: "Social & Economic Aspects", details: "Caste, society, cultural developments, economic reforms, trade" },
        { name: "Political Aspects", details: "Administrative changes, laws, institutions, and revolts" }
      ]
    },
    {
      subject: "Geography of India & West Bengal",
      topics: [
        { name: "Physical Geography", details: "Major physiographic divisions, climate, rainfall, seasons, soils, natural vegetation" },
        { name: "Drainage & Water Resources", details: "Major rivers, dams, irrigation, watersheds" },
        { name: "Economic Geography", details: "Agriculture, industries, minerals, energy resources" },
        { name: "Human & Social Geography", details: "Population distribution, migration, urbanization" },
        { name: "West Bengal-Specific Geography", details: "Physiography (Himalayan, Terai, Dooars, Rarh, Delta), agriculture, industries, resources" }
      ]
    },
    {
      subject: "Indian Polity & Economy",
      topics: [
        { name: "Constitution of India", details: "Preamble, fundamental rights, DPSPs, duties, amendments" },
        { name: "Governance System", details: "Parliament, President, PM, Council of Ministers, judiciary, federalism" },
        { name: "Local Government", details: "Panchayati Raj, rural & urban local bodies, role in governance" },
        { name: "Indian Economy", details: "Features of Indian economy, agriculture, industry, national income" },
        { name: "Planning & Development", details: "Five-Year Plans, NITI Aayog, poverty alleviation, social welfare schemes" }
      ]
    },
    {
      subject: "Indian National Movement (INM)",
      topics: [
        { name: "Early Nationalism", details: "19th-century reformers, Bengal Renaissance, early associations" },
        { name: "Moderate Phase", details: "INC formation, early demands, petitions & constitutional agitation" },
        { name: "Extremist Phase", details: "Swadeshi movement, partition of Bengal, and revolutionary activities" },
        { name: "Gandhian Era", details: "Non-Cooperation, Civil Disobedience, Quit India movements" },
        { name: "Final Phase", details: "INA, negotiations, independence, Mountbatten Plan" }
      ]
    },
    {
      subject: "General Mental Ability",
      topics: [
        { name: "Logical Reasoning", details: "Analogy, classification, series, relationships" },
        { name: "Analytical Ability", details: "Coding-decoding, direction sense, puzzles, syllogisms" },
        { name: "Problem Solving", details: "Data interpretation basics, statements & conclusions" },
        { name: "Mental Processing", details: "Logical perception, pattern recognition, sequencing" },
        { name: "Natural Conclusions", details: "Assessing arguments, identifying assumptions" }
      ]
    }
  ];

  const mainsSyllabus = [
    {
      paper: "Paper I: Language (Descriptive - 200 Marks)",
      details: "For Bengali/Hindi/Urdu/Nepali/Santali",
      topics: [
        { name: "Letter Writing", details: "Descriptive structured letter drafting (within 150 words)" },
        { name: "Report Drafting", details: "Drafting of report for press/administrative use (within 200 words)" },
        { name: "Precis Writing", details: "Condensing passages with title" },
        { name: "Comprehension & Translation", details: "Comprehension questions and translation from English to Bengali/Hindi/Urdu/Nepali/Santali" }
      ]
    },
    {
      paper: "Paper II: English (Descriptive - 200 Marks)",
      details: "To assess descriptive English writing proficiency and general structure comprehension",
      topics: [
        { name: "Letter Writing & Report Draft", details: "Letter Writing (150 words) and Report (200 words) draft details" },
        { name: "Precis Writing", details: "Summarizing complex paragraphs concisely" },
        { name: "Comprehension", details: "Analysis of the given paragraph and answering short questions" },
        { name: "Translation Work", details: "Translation from Bengali/Hindi/Urdu/Nepali/Santali to English" }
      ]
    },
    {
      paper: "Paper III: General Studies-I (MCQs - 200 Marks)",
      details: "Indian History with special focus on National Movement, and Geography with special reference to West Bengal",
      topics: [
        { name: "Indian History", details: "Ancient, Medieval, Freedom struggle and Post-Independence reorganization. Basic World History outlines" },
        { name: "Physical Geography of India", details: "Geological structure, Northern Mountains, Peninsular Plateau, Indo-Gangetic Plains, Coastal regions & Islands. Climate (monsoon mechanisms), soil types, river systems (Himalayan, Peninsular), river-linking, and natural hazards & mitigation" },
        { name: "Economic Geography of India", details: "Agriculture dynamics (cropping seasons, green revolution, irrigation), minerals (coal, petroleum, gas, iron ore), industries distribution factors, energy (conventional/non-conventional), transport network (road, rail, water, ports), and demographic urbanization patterns" },
        { name: "Human & Social Geography of India", details: "Settlement types, tribes & tribal regions, literacy, age-sex structures, and regional planning concepts" },
        { name: "Geography of West Bengal", details: "Detailed study: Himalayan, Terai/Dooars, North Bengal, Rarh, Deltaic Sundarbans. Rivers (Teesta, Hooghly, Damodar, Ajay), agriculture & crops (rice, jute, tea), minerals (coal at Raniganj), IT hubs, SEZs, transit channels and Sundarbans environmental issues" }
      ]
    },
    {
      paper: "Paper IV: General Studies-II (MCQs - 200 Marks)",
      details: "Science & Technology advancement, Environment, General Knowledge and Current Affairs",
      topics: [
        { name: "Science Core Principles", details: "Physics (motion, force, light, heat, electricity, magnetism), Chemistry (reactions, acids-bases, elements, compounds, mixtures), and biology basics (cell structure, human physiology systems, plant physiology, genetics)" },
        { name: "Scientific & Tech Advancement", details: "Space science (ISRO missions, satellites, remote sensing), Defence technology (missiles, DRDO), ICT (5G/6G, cyber-security, AI, robotics, nanotechnology, biotech, drones, quantum computing, vaccine research)" },
        { name: "Environment - Biodiversity", details: "In-situ & ex-situ conservation, hotspots in India, National Parks, sanctuaries, biosphere reserves" },
        { name: "Environment - Coastal Regulation (CRZ) & Ozone", details: "CRZ classification categories (I-IV), ozone layer depletion, harmful CFCs & Montreal Protocol" },
        { name: "Environment - Climate & Pollution", details: "Greenhouse effect, greenhouse gases, Kyoto Protocol, Paris Agreement. Pollution types (industrial, air, water, solid/hazardous waste) and Environmental Impact Assessment (EIA)" },
        { name: "GK & Current Affairs", details: "National/International events, awards, authors, sports, international bodies, national schemes, WB state current affairs, space/defence updates, indices & rankings" }
      ]
    },
    {
      paper: "Paper V: Indian Constitution & Economy (MCQs - 200 Marks)",
      details: "Syllabus details covering Indian Constitution, Economy, Planning Process and Role of RBI",
      topics: [
        { name: "Indian Constitution", details: "Preamble, Fundamental Rights & Duties, DPSPs, Union & State Executives, Parliament, Judiciary, Emergency provisions, Amendments, Electoral system, CAG, UPSC, Finance Commission, NITI Aayog" },
        { name: "Indian Federalism", details: "Centre-State relations (legislative/financial/administrative), Inter-State Council, Zonal Councils, Role of Governor, cooperative & competitive federalism" },
        { name: "Indian Economy Overview", details: "Features of economy, sectors, national income, inclusive growth, poverty, inflation, unemployment, inequality" },
        { name: "Planning & Devolution", details: "Five-Year plans, NITI Aayog functions, decentralization, central devolution of funds, GST, Fiscal federalism, Finance Commissions (Central & State recommendations)" },
        { name: "Fiscal Policy of India", details: "Budget types, taxation policy, revenue deficits, FRBM Act details" },
        { name: "RBI Role & Monetary Policy", details: "Monetary authority, Banker's Bank, foreign exchange custodian, monetary policy instruments (CRR, SLR, Repo, Reverse Repo, Bank Rate, OMO), inflation targeting, MPC, financial inclusion & digital payments" }
      ]
    },
    {
      paper: "Paper VI: Arithmetic & Test of Reasoning (MCQs - 200 Marks)",
      details: "Evaluates mathematical logic, quantitative aptitude, and mental processing",
      topics: [
        { name: "Basic Mathematics & Algebra", details: "Number system, HCF & LCM, divisibility, fractions, surds & indices, ratios, linear & quadratic equations, algebraic identities" },
        { name: "Commercial Arithmetic", details: "Percentage, Profit & Loss, discounts, partnership, simple and compound interest, averages" },
        { name: "Time, Work & Distance", details: "Time and work, pipes & cisterns, speed, distance, trains, boats & streams" },
        { name: "Mensuration & Data Interpretation", details: "Areas, perimeters, surface areas & volume (cubes, cylinders, spheres), interpretation tables, charts & graphs" },
        { name: "Mental Ability & Logical Reasoning", details: "Series, analogy, classification, coding-decoding, direction/distance, blood relations, syllogisms & Venn diagrams" },
        { name: "Analytical & Puzzles", details: "Statement-arguments/conclusions/assumptions, cause & effect, ranking, linear/circular seating arrangements, logic puzzles" }
      ]
    }
  ];

  const optionalsSyllabus = [
    {
      subject: "Bengali Optional (Paper I & II)",
      topics: [
        { name: "History of Bangla Language", details: "Proto Indo-European to Bangla path, old/middle/new stages, dialects,Sadhu & Chalit prose, vocabulary origins" },
        { name: "Phonetic Changes in Bangla", details: "Apinihiti, Abhishruti, Samibhavan, Svarabhakti / Viprakarsha, Svarasangati" },
        { name: "History of Bangla Literature", details: "Periodization (Old & Middle). Mangal Kavyas, Vaishnava lyrics. Emergence of modernity in 19th Century, novel development (Bankimchandra, Tagore, Saratchandra, Bibhutibhusan, Tarasankar, Manik), drama, women and Bangla literature" },
        { name: "Paper II - Essential Literary Texts", details: "Vaishnava Padavali, Chandimangal, Meghnadbadh Kavya, Rajani, Punascha, Selected Modern poems, Pather Panchali, Jagori, Ebam Indrajit" }
      ]
    },
    {
      subject: "Hindi Optional (Paper I & II)",
      topics: [
        { name: "Hindi Linguistic & Grammatical", details: "Grammar structures, Communication elements, units of language - phonemes, syntax, semantics" },
        { name: "History of Hindi & Nagari Lipi", details: "Khari Boli, Lipi scientific features, prominent dialects" },
        { name: "History of Hindi Literature", details: "Adikala, Bhakti Kala, Riti Kala, Adhunika Kala, Renaissance trends. Prose writers (Bhartendu, Mahavir Prasad), Novels, short stories, criticism, drama" }
      ]
    },
    {
      subject: "Agriculture Optional (Paper I & II)",
      topics: [
        { name: "Agro-ecological factors", details: "Plant growth, regional crop distributions, meteorology, Remote Sensing, Precision Farming, GIS" },
        { name: "Cropping Systems & Soils", details: "Cereals, pulses, oilseeds, fibre crops, sugarcane, soil formation/fertility, integrated nutrient management, biofertilizers" },
        { name: "Crop Improvement & Physiology", details: "Cell structures, heredity laws, plant breeding history, photosynthesis & respiration, post-harvest tech, food security" }
      ]
    },
    {
      subject: "Anthropology Optional (Paper I & II)",
      topics: [
        { name: "Introduction & Evolution", details: "Branches (Socio-cultural, biological, archaeological, linguistic), Organic evolution, Hominization theories, Neanderthal/Australopithecus status" },
        { name: "Human Genetics & Culture", details: "Mendelism, DNA replication, Human Genome Project, prehistoric tool typologies (Paleolithic - Iron Age), absolute & relative dating methodologies" },
        { name: "Indian Anthropology (Paper II)", details: "Indus Valley Civilization, caste systems, tribal profile, human rights, health & emerging challenges in India" }
      ]
    }
  ];

  // Helper search algorithm across syllabus sections
  const getFilteredPrelims = () => {
    if (!searchQuery.trim()) return prelimsSyllabus;
    return prelimsSyllabus.map(subj => {
      const filteredTopics = subj.topics.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.details.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return { ...subj, topics: filteredTopics };
    }).filter(subj => subj.topics.length > 0 || subj.subject.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  const getFilteredMains = () => {
    if (!searchQuery.trim()) return mainsSyllabus;
    return mainsSyllabus.map(subj => {
      const filteredTopics = subj.topics.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.details.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return { ...subj, topics: filteredTopics };
    }).filter(subj => subj.topics.length > 0 || subj.paper.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  const getFilteredOptionals = () => {
    if (!searchQuery.trim()) return optionalsSyllabus;
    return optionalsSyllabus.map(subj => {
      const filteredTopics = subj.topics.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.details.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return { ...subj, topics: filteredTopics };
    }).filter(subj => subj.topics.length > 0 || subj.subject.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  const filteredPrelims = getFilteredPrelims();
  const filteredMains = getFilteredMains();
  const filteredOptionals = getFilteredOptionals();

  // Dynamic calculations of preparation progress
  const totalPrelims = prelimsSyllabus.reduce((sum, s) => sum + s.topics.length, 0);
  const totalMains = mainsSyllabus.reduce((sum, s) => sum + s.topics.length, 0);
  const totalOptionals = optionalsSyllabus.reduce((sum, s) => sum + s.topics.length, 0);
  const grandTotal = totalPrelims + totalMains + totalOptionals;

  const masteredKeys = Object.keys(masteredTopics).filter(k => masteredTopics[k]);
  const masteredPrelims = masteredKeys.filter(k => k.startsWith('prelims_')).length;
  const masteredMains = masteredKeys.filter(k => k.startsWith('mains_')).length;
  const masteredOptionals = masteredKeys.filter(k => k.startsWith('opt_')).length;
  const grandMastered = masteredKeys.length;

  const percentOverall = grandTotal > 0 ? Math.round((grandMastered / grandTotal) * 100) : 0;
  const percentPrelims = totalPrelims > 0 ? Math.round((masteredPrelims / totalPrelims) * 100) : 0;
  const percentMains = totalMains > 0 ? Math.round((masteredMains / totalMains) * 100) : 0;
  const percentOptionals = totalOptionals > 0 ? Math.round((masteredOptionals / totalOptionals) * 100) : 0;

  const chartData = [
    {
      name: 'Prelims',
      mastered: masteredPrelims,
      remaining: totalPrelims - masteredPrelims,
      total: totalPrelims,
      percent: percentPrelims,
    },
    {
      name: 'Mains',
      mastered: masteredMains,
      remaining: totalMains - masteredMains,
      total: totalMains,
      percent: percentMains,
    },
    {
      name: 'Optionals',
      mastered: masteredOptionals,
      remaining: totalOptionals - masteredOptionals,
      total: totalOptionals,
      percent: percentOptionals,
    },
  ];

  const pieData = [
    { name: 'Prelims Mastery', value: masteredPrelims, color: '#0078d4' },
    { name: 'Mains Mastery', value: masteredMains, color: '#d97706' },
    { name: 'Optionals Mastery', value: masteredOptionals, color: '#4f46e5' },
  ].filter(item => item.value > 0);

  const syllabusCompositionData = [
    { name: 'Prelims', value: totalPrelims, color: '#0078d4' },
    { name: 'Mains', value: totalMains, color: '#d97706' },
    { name: 'Optionals', value: totalOptionals, color: '#4f46e5' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#1e2022] p-6 rounded-md border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 bg-[#0078d4]/10 text-[#0078d4] dark:bg-blue-950/40 dark:text-blue-400 rounded text-xs font-bold uppercase tracking-wider">Exam Syllabus</span>
            <span className="text-xs text-slate-400 font-medium">Cycle 2026</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">WBCS Core Syllabus & Guidelines</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            West Bengal Civil Service (Exe.) reference database. The prelims serve as a screening test, while merit is determined by Mains and Personality Tests.
          </p>
        </div>
        
        {/* Search Box */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search syllabus topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs p-2 pl-9 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded focus:outline-none focus:border-[#0078d4] transition text-slate-800 dark:text-slate-100"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* METRIC CARD TABS OVERVIEW SHEETS */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <button
          onClick={() => { setActiveSegment('overview'); setSearchQuery(''); }}
          className={`p-3 rounded-md text-center border transition-all cursor-pointer ${
            activeSegment === 'overview'
              ? 'bg-[#0078d4] text-white border-[#0078d4] shadow-xs'
              : 'bg-white dark:bg-[#1e2022] hover:bg-slate-50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
          }`}
        >
          <Layers className="h-4 w-4 mx-auto mb-1.5 opacity-80" />
          <span className="text-xs font-bold block">Overview & Intro</span>
        </button>

        <button
          onClick={() => { setActiveSegment('prelims'); }}
          className={`p-3 rounded-md text-center border transition-all cursor-pointer ${
            activeSegment === 'prelims'
              ? 'bg-[#0078d4] text-white border-[#0078d4] shadow-xs'
              : 'bg-white dark:bg-[#1e2022] hover:bg-slate-50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
          }`}
        >
          <BookOpen className="h-4 w-4 mx-auto mb-1.5 opacity-80" />
          <span className="text-xs font-bold block">Prelims Syllabus</span>
        </button>

        <button
          onClick={() => { setActiveSegment('mains'); }}
          className={`p-3 rounded-md text-center border transition-all cursor-pointer ${
            activeSegment === 'mains'
              ? 'bg-[#0078d4] text-white border-[#0078d4] shadow-xs'
              : 'bg-white dark:bg-[#1e2022] hover:bg-slate-50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
          }`}
        >
          <FileText className="h-4 w-4 mx-auto mb-1.5 opacity-80" />
          <span className="text-xs font-bold block">Mains Syllabus</span>
        </button>

        <button
          onClick={() => { setActiveSegment('optionals'); }}
          className={`p-3 rounded-md text-center border transition-all cursor-pointer ${
            activeSegment === 'optionals'
              ? 'bg-[#0078d4] text-white border-[#0078d4] shadow-xs'
              : 'bg-white dark:bg-[#1e2022] hover:bg-slate-50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
          }`}
        >
          <Award className="h-4 w-4 mx-auto mb-1.5 opacity-80" />
          <span className="text-xs font-bold block">Optional Subjects</span>
        </button>

        <button
          onClick={() => { setActiveSegment('pattern'); setSearchQuery(''); }}
          className={`p-3 col-span-2 sm:col-span-1 rounded-md text-center border transition-all cursor-pointer ${
            activeSegment === 'pattern'
              ? 'bg-[#0078d4] text-white border-[#0078d4] shadow-xs'
              : 'bg-white dark:bg-[#1e2022] hover:bg-slate-50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
          }`}
        >
          <ListFilter className="h-4 w-4 mx-auto mb-1.5 opacity-80" />
          <span className="text-xs font-bold block">Exam Pattern</span>
        </button>
      </div>

      {/* RENDER PROGRESS SUMMARY BOARD */}
      <div className="bg-white dark:bg-[#1e2022] p-5 rounded-md border border-slate-200 dark:border-slate-800 shadow-2xs grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        <div className="md:col-span-1 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Preparation Journey</span>
          </div>
          <p className="text-2xl font-black text-slate-800 dark:text-white font-mono flex items-baseline gap-1">
            <span>{grandMastered}</span>
            <span className="text-xs font-normal text-slate-400">/ {grandTotal} topics mastered</span>
          </p>
          <span className="text-[10px] text-slate-450 block font-medium">Click checkboxes or 'Mark Mastered' next to each topic below</span>
        </div>
        
        <div className="md:col-span-2 space-y-3">
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-slate-600 dark:text-slate-300">Syllabus Coverage Progress</span>
              <span className="text-emerald-650 dark:text-emerald-400 font-mono">{percentOverall}% complete</span>
            </div>
            {/* progress line */}
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${percentOverall}%` }}
              ></div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-slate-500 dark:text-slate-400">
            <div>
              <span className="block text-slate-400 mb-0.5">Prelims Tracker ({percentPrelims}%)</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{masteredPrelims} / {totalPrelims} done</span>
            </div>
            <div>
              <span className="block text-slate-400 mb-0.5">Mains Tracker ({percentMains}%)</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{masteredMains} / {totalMains} done</span>
            </div>
            <div>
              <span className="block text-slate-400 mb-0.5 font-sans">Optionals Tracker ({percentOptionals}%)</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{masteredOptionals} / {totalOptionals} done</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 flex md:justify-end gap-2 shrink-0">
          {grandMastered > 0 ? (
            <button
              id="clear-all-syllabus-progress"
              onClick={clearAllProgress}
              className="px-3 py-1.5 text-[10px] font-bold text-red-650 bg-red-50 hover:bg-red-100 border border-red-200/50 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30 rounded flex items-center gap-1 transition-all cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Reset All Progress
            </button>
          ) : (
            <div className="text-[10px] text-slate-450 text-right italic p-2 bg-slate-50 dark:bg-slate-900/40 rounded border border-slate-200/30 dark:border-slate-800/20">
              Start checking off topics to measure preparation velocity.
            </div>
          )}
        </div>
      </div>

      {/* SYLLABUS MASTER VISUAL ANALYTICS BOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BAR CHART */}
        <div className="bg-white dark:bg-[#1e2022] p-5 rounded-md border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/60">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Preparation Progress (Bar Chart)</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Comparing mastered vs remaining topics</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Mastered
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-450">
                <span className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-750" />
                Remaining
              </span>
            </div>
          </div>
          
          <div className="h-56 w-full text-xs font-sans">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 15, right: 10, left: -25, bottom: 0 }}
                barSize={32}
              >
                <XAxis 
                  dataKey="name" 
                  stroke="currentColor" 
                  className="text-slate-400" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="currentColor" 
                  className="text-slate-400" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip
                  cursor={{ fill: 'rgba(16, 185, 129, 0.04)' }}
                  contentStyle={{
                    backgroundColor: '#1e2022',
                    borderColor: '#334155',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '11px',
                  }}
                  itemStyle={{ color: '#ffffff' }}
                />
                <Bar name="Mastered" dataKey="mastered" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar name="Remaining" dataKey="remaining" stackId="a" fill="#e2e8f0" radius={[4, 4, 0, 0]} className="dark:fill-slate-800" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART */}
        <div className="bg-white dark:bg-[#1e2022] p-5 rounded-md border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/60">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">
                {grandMastered > 0 ? "Mastery Breakdown (Pie Chart)" : "Syllabus Distribution"}
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {grandMastered > 0 ? "Proportional contribution of your mastered goals" : "Baseline count of target topics across sections"}
              </p>
            </div>
            <span className="text-[10px] bg-[#0078d4]/10 text-[#0078d4] dark:bg-blue-950/40 dark:text-blue-400 px-2 py-0.5 rounded font-extrabold">
              {grandMastered > 0 ? 'Mastery Contributions' : 'Topics Share'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 h-56">
            <div className="h-full w-full sm:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={grandMastered > 0 ? pieData : syllabusCompositionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {(grandMastered > 0 ? pieData : syllabusCompositionData).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e2022',
                      borderColor: '#334155',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full sm:w-1/2 space-y-3">
              {(grandMastered > 0 ? pieData : syllabusCompositionData).map((item, index) => {
                const totalVal = grandMastered > 0 ? grandMastered : grandTotal;
                const percentage = totalVal > 0 ? Math.round((item.value / totalVal) * 100) : 0;
                return (
                  <div key={index} className="flex items-center justify-between gap-4 border-b border-slate-50 dark:border-slate-900/40 pb-1.5 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-350">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black font-mono text-slate-800 dark:text-white block">
                        {item.value} {item.value === 1 ? 'topic' : 'topics'}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-medium">
                        {percentage}% share
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {searchQuery && (
        <div className="bg-[#0078d4]/5 border border-[#0078d4]/20 p-3 rounded text-xs text-[#0078d4] flex items-center gap-2">
          <Bookmark className="h-4 w-4 shrink-0" />
          <p>
            Filtering syllabus results matching <strong className="font-semibold">&ldquo;{searchQuery}&rdquo;</strong>. Showing results found across dynamic segments.
          </p>
        </div>
      )}

      {/* RENDER DYNAMIC SHEETS */}
      <div className="space-y-6">
        
        {/* TAB 1: OVERVIEW COMPONENT */}
        {activeSegment === 'overview' && (
          <div className="bg-white dark:bg-[#1e2022] rounded-md border border-slate-200 dark:border-slate-800 p-6 space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Scheme of Examination</h3>
              <p className="text-xs text-slate-500 mt-1">
                The civil services examination consists of successive stages. Understand the screening filters and key scoring indicators.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-md border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                <div className="flex items-center gap-2 text-[#0078d4]">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Stage 1: Preliminary Exam</span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Screening Test</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Qualifying stage consisting of 1 objective paper (200 MCQs) carrying 200 marks. This is meant strictly as a preliminary filter. Marks are not added to final merit list.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-md border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                <div className="flex items-center gap-2 text-amber-650 dark:text-amber-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Stage 2: Main Examination</span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Rank List Decider</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Consists of 6 compulsory papers and 2 optional subject papers (Only for Group A & Group B). Standard descriptive + MCQ patterns of 200 marks each. Cumulative score forms the backbone of merit ranking.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-md border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                <div className="flex items-center gap-2 text-emerald-650 dark:text-emerald-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Stage 3: Personality Test</span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Interview & Character Suitability</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Assess applicant's general awareness, traits, characteristics, leadership capability and mental suitability for executive public roles. Marks vary from 100 to 200 depending on Group.
                </p>
              </div>
            </div>

            <div className="bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-md border border-blue-200/40 dark:border-blue-900/40">
              <h4 className="text-xs font-bold text-slate-900 dark:text-blue-300 uppercase tracking-widest mb-1">General Instruction for Aspirants</h4>
              <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                Candidates must formulate subject-wise notes keeping both physical parameters of the state (West Bengal context) and national governance scales in mind. In history, modern national struggle holds pivotal value, whereas in geography, West Bengal river formations and agricultural configurations carry extreme scoring density.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: PRELIMS SYLLABUS LISTS */}
        {activeSegment === 'prelims' && (
          <div className="space-y-4">
            {filteredPrelims.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-[#1e2022] rounded-md border border-slate-200 dark:border-slate-850">
                <p className="text-xs text-slate-400">No matching Prelims syllabus topics found for &ldquo;{searchQuery}&rdquo;</p>
              </div>
            ) : (
              filteredPrelims.map((subj, idx) => (
                <div key={idx} className="bg-white dark:bg-[#1e2022] rounded-md border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
                  <div className="bg-slate-50 dark:bg-[#25282b] p-4 border-b border-slate-200 dark:border-slate-850 flex items-center justify-between">
                    <h3 className="text-xs font-extrabold text-[#0078d4] dark:text-blue-400 uppercase tracking-wider">{subj.subject}</h3>
                    <span className="text-[10px] bg-slate-200 dark:bg-slate-800 font-mono font-bold px-2 py-0.5 rounded text-slate-650 dark:text-slate-350">
                      25 Marks Section
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {subj.topics.map((topic, tIdx) => {
                      const topicId = `prelims_${subj.subject}_${topic.name}`;
                      const isMastered = !!masteredTopics[topicId];
                      return (
                        <div key={tIdx} className={`p-4 transition-all flex flex-col md:flex-row gap-4 md:gap-6 items-start ${
                          isMastered 
                            ? 'bg-emerald-50/15 dark:bg-emerald-950/5 border-l-4 border-l-emerald-500' 
                            : 'hover:bg-slate-50/50 dark:hover:bg-slate-900/30 border-l-4 border-l-transparent'
                        }`}>
                          <div className="w-full md:w-56 shrink-0 flex items-start gap-3">
                            <button
                              id={`check-${topicId}`}
                              onClick={() => toggleTopicMastery(topicId)}
                              className="mt-0.5 shrink-0 hover:scale-105 transition-transform cursor-pointer"
                              title={isMastered ? "Mark as uncompleted" : "Mark as mastered"}
                            >
                              {isMastered ? (
                                <CheckSquare className="h-4.5 w-4.5 text-emerald-500 dark:text-emerald-400 fill-emerald-500/10" />
                              ) : (
                                <Square className="h-4.5 w-4.5 text-slate-300 hover:text-slate-500 dark:text-slate-700 dark:hover:text-slate-500" />
                              )}
                            </button>
                            <div>
                              <span className={`text-xs font-bold transition-all block ${
                                isMastered ? 'text-emerald-700 dark:text-emerald-400 line-through decoration-emerald-500/35' : 'text-slate-900 dark:text-white'
                              }`}>
                                {topic.name}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className={`text-xs leading-relaxed transition-all ${
                              isMastered ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-350'
                            }`}>
                              {topic.details}
                            </p>
                          </div>
                          <div className="shrink-0 flex items-center md:h-5">
                            <button
                              id={`btn-mastered-${topicId}`}
                              onClick={() => toggleTopicMastery(topicId)}
                              className={`text-[10px] font-extrabold px-2.5 py-1 rounded transition-all cursor-pointer ${
                                isMastered 
                                  ? 'bg-emerald-100 text-emerald-805 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/30' 
                                  : 'bg-slate-100 text-slate-700 border border-slate-200/50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:bg-[#0078d4]/10 hover:text-[#0078d4] hover:border-[#0078d4]/20'
                              }`}
                            >
                              {isMastered ? 'Mastered ✓' : 'Mark Mastered'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: MAINS SYLLABUS DETAILED CONFIGURATION */}
        {activeSegment === 'mains' && (
          <div className="space-y-4">
            {filteredMains.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-[#1e2022] rounded-md border border-slate-200 dark:border-slate-850">
                <p className="text-xs text-slate-400">No matching Mains syllabus topics found for &ldquo;{searchQuery}&rdquo;</p>
              </div>
            ) : (
              filteredMains.map((subj, idx) => (
                <div key={idx} className="bg-white dark:bg-[#1e2022] rounded-md border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
                  <div className="bg-slate-50 dark:bg-[#25282b] p-4 border-b border-slate-200 dark:border-slate-850">
                    <h3 className="text-xs font-extrabold text-amber-650 dark:text-amber-400 uppercase tracking-wider">{subj.paper}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{subj.details}</p>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {subj.topics.map((topic, tIdx) => {
                      const topicId = `mains_${subj.paper}_${topic.name}`;
                      const isMastered = !!masteredTopics[topicId];
                      return (
                        <div key={tIdx} className={`p-4 transition-all flex flex-col md:flex-row gap-4 md:gap-6 items-start ${
                          isMastered 
                            ? 'bg-emerald-50/15 dark:bg-emerald-950/5 border-l-4 border-l-emerald-500' 
                            : 'hover:bg-slate-50/50 dark:hover:bg-slate-900/30 border-l-4 border-l-transparent'
                        }`}>
                          <div className="w-full md:w-60 shrink-0 flex items-start gap-3">
                            <button
                              id={`check-${topicId}`}
                              onClick={() => toggleTopicMastery(topicId)}
                              className="mt-0.5 shrink-0 hover:scale-105 transition-transform cursor-pointer"
                              title={isMastered ? "Mark as uncompleted" : "Mark as mastered"}
                            >
                              {isMastered ? (
                                <CheckSquare className="h-4.5 w-4.5 text-emerald-500 dark:text-emerald-400 fill-emerald-500/10" />
                              ) : (
                                <Square className="h-4.5 w-4.5 text-slate-300 hover:text-slate-500 dark:text-slate-700 dark:hover:text-slate-500" />
                              )}
                            </button>
                            <div>
                              <span className={`text-xs font-bold transition-all block ${
                                isMastered ? 'text-emerald-700 dark:text-emerald-400 line-through decoration-emerald-500/35' : 'text-slate-900 dark:text-white'
                              }`}>
                                {topic.name}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className={`text-xs leading-relaxed transition-all ${
                              isMastered ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-350'
                            }`}>
                              {topic.details}
                            </p>
                          </div>
                          <div className="shrink-0 flex items-center md:h-5">
                            <button
                              id={`btn-mastered-${topicId}`}
                              onClick={() => toggleTopicMastery(topicId)}
                              className={`text-[10px] font-extrabold px-2.5 py-1 rounded transition-all cursor-pointer ${
                                isMastered 
                                  ? 'bg-emerald-100 text-emerald-850 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/30' 
                                  : 'bg-slate-100 text-slate-700 border border-slate-200/50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:bg-[#0078d4]/10 hover:text-[#0078d4] hover:border-[#0078d4]/20'
                              }`}
                            >
                              {isMastered ? 'Mastered ✓' : 'Mark Mastered'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: OPTIONAL SUBJECT LIST & PAPERS */}
        {activeSegment === 'optionals' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#1e2022] p-5 rounded-md border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-xs font-extrabold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">Compulsory Optional Selection (Group A & B Only)</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Candidates opting for Group &lsquo;A&rsquo; and Group &lsquo;B&rsquo; cadres must choose one optional subject from the list below. Two papers (Paper VII and Paper VIII) are conducted carrying 200 marks each, evaluated at Graduate/Degree standard.
              </p>
              <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded border border-slate-200/60 dark:border-slate-800/60">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Permissible Optional Subjects List</span>
                <div className="flex flex-wrap gap-1.5 text-[10px] text-slate-700 dark:text-slate-300 font-semibold">
                  {["Bengali", "Sanskrit", "English", "Hindi", "Urdu", "Pali", "Santali", "Nepali", "Arabic", "Persian", "French", "Comparative Literature", "Agriculture", "Animal Husbandry & Vet Science", "Anthropology", "Botany", "Chemistry", "Civil Engineering", "Commerce & Accountancy", "Computer Science", "Economics", "Electrical Engineering", "Geography", "Geology", "History", "Law", "Management", "Mathematics", "Mechanical Engineering", "Medical Science", "Philosophy", "Physiology", "Physics", "Political Science", "Psychology", "Sociology", "Statistics", "Zoology"].map((subj, sIdx) => (
                    <span key={sIdx} className="px-2 py-0.5 bg-white dark:bg-slate-850 rounded border border-slate-200 dark:border-slate-800">
                      {subj}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest block">Detailed Syllabus for Major Optional Subjects</span>
              {filteredOptionals.length === 0 ? (
                <div className="p-12 text-center bg-white dark:bg-[#1e2022] rounded-md border border-slate-200 dark:border-slate-850">
                  <p className="text-xs text-slate-400">No matching Optional syllabus topics found for &ldquo;{searchQuery}&rdquo;</p>
                </div>
              ) : (
                filteredOptionals.map((subj, idx) => (
                  <div key={idx} className="bg-white dark:bg-[#1e2022] rounded-md border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
                    <div className="bg-indigo-50/40 dark:bg-indigo-950/20 p-4 border-b border-indigo-150 dark:border-indigo-900/40">
                      <h3 className="text-xs font-bold text-indigo-805 dark:text-indigo-400 uppercase tracking-wider">{subj.subject}</h3>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {subj.topics.map((topic, tIdx) => {
                        const topicId = `opt_${subj.subject}_${topic.name}`;
                        const isMastered = !!masteredTopics[topicId];
                        return (
                          <div key={tIdx} className={`p-4 transition-all flex flex-col md:flex-row gap-4 md:gap-6 items-start ${
                            isMastered 
                              ? 'bg-emerald-50/15 dark:bg-emerald-950/5 border-l-4 border-l-emerald-500' 
                              : 'hover:bg-slate-50/50 dark:hover:bg-slate-900/30 border-l-4 border-l-transparent'
                          }`}>
                            <div className="w-full md:w-60 shrink-0 flex items-start gap-3">
                              <button
                                id={`check-${topicId}`}
                                onClick={() => toggleTopicMastery(topicId)}
                                className="mt-0.5 shrink-0 hover:scale-105 transition-transform cursor-pointer"
                                title={isMastered ? "Mark as uncompleted" : "Mark as mastered"}
                              >
                                {isMastered ? (
                                  <CheckSquare className="h-4.5 w-4.5 text-emerald-500 dark:text-emerald-400 fill-emerald-500/10" />
                                ) : (
                                  <Square className="h-4.5 w-4.5 text-slate-300 hover:text-slate-500 dark:text-slate-700 dark:hover:text-slate-500" />
                                )}
                              </button>
                              <div>
                                <span className={`text-xs font-bold transition-all block ${
                                  isMastered ? 'text-emerald-700 dark:text-emerald-400 line-through decoration-emerald-500/35' : 'text-slate-900 dark:text-white'
                                }`}>
                                  {topic.name}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className={`text-xs leading-relaxed transition-all ${
                                isMastered ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-350'
                              }`}>
                                {topic.details}
                              </p>
                            </div>
                            <div className="shrink-0 flex items-center md:h-5">
                              <button
                                id={`btn-mastered-${topicId}`}
                                onClick={() => toggleTopicMastery(topicId)}
                                className={`text-[10px] font-extrabold px-2.5 py-1 rounded transition-all cursor-pointer ${
                                  isMastered 
                                    ? 'bg-emerald-100 text-emerald-850 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/30' 
                                    : 'bg-slate-100 text-slate-700 border border-slate-200/50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:bg-[#0078d4]/10 hover:text-[#0078d4] hover:border-[#0078d4]/20'
                                }`}
                              >
                                {isMastered ? 'Mastered ✓' : 'Mark Mastered'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 5: EXAM PATTERN & INTERVIEWS MARKS GRIDS */}
        {activeSegment === 'pattern' && (
          <div className="space-y-6">
            
            {/* Prelims pattern */}
            <div className="bg-white dark:bg-[#1e2022] p-5 rounded-md border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#0078d4]"></span>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">WBCS Prelims Exam Pattern (2026 Cycle)</h3>
              </div>
              <p className="text-xs text-slate-500">
                Single object-type paper containing 200 multiple-choice questions (200 marks) to be completed within 2.5 hours (150 minutes). Negative marking of 1/3 exists.
              </p>
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold">
                    <tr className="border-b border-slate-200 dark:border-slate-800">
                      <th className="p-3">Syllabus Compulsory Subjects</th>
                      <th className="p-3 text-center">No. of Questions</th>
                      <th className="p-3 text-center">Marks Allocation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                    {[
                      { subject: "English Composition", count: 25, marks: 25 },
                      { subject: "General Science", count: 25, marks: 25 },
                      { subject: "Current Events of National & International Importance", count: 25, marks: 25 },
                      { subject: "History of India", count: 25, marks: 25 },
                      { subject: "Geography of India with special reference to West Bengal", count: 25, marks: 25 },
                      { subject: "Indian Polity and Economy", count: 25, marks: 25 },
                      { subject: "Indian National Movement", count: 25, marks: 25 },
                      { subject: "General Mental Ability", count: 25, marks: 25 }
                    ].map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/40 dark:hover:bg-slate-850/40">
                        <td className="p-3 font-semibold text-slate-900 dark:text-slate-200">{row.subject}</td>
                        <td className="p-3 text-center font-mono font-bold text-[#0078d4] dark:text-blue-400">{row.count}</td>
                        <td className="p-3 text-center font-mono font-bold">{row.marks}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100 dark:bg-slate-900 font-extrabold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800">
                      <td className="p-3">Total Prelims Screening Marks</td>
                      <td className="p-3 text-center font-mono text-[#0078d4] dark:text-blue-400">200</td>
                      <td className="p-3 text-center font-mono text-[#0078d4] dark:text-blue-400">200 Marks</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mains pattern */}
            <div className="bg-white dark:bg-[#1e2022] p-5 rounded-md border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">WBCS Mains Exam Pattern (2026 Cycle)</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Compiled with 6 compulsory papers and 2 optional subject papers. Objective MCQ type covers Papers III, IV, V and VI. Descriptive essay format is preserved for Language and Optional subject Papers.
              </p>
              
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold">
                    <tr className="border-b border-slate-200 dark:border-slate-800">
                      <th className="p-3">Paper / Name</th>
                      <th className="p-3">Syllabus Scope</th>
                      <th className="p-3 text-center">Type</th>
                      <th className="p-3 text-center">Marks</th>
                      <th className="p-3 text-center">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                    {[
                      { name: "Paper I", scope: "Bengali/Hindi/Urdu/Nepali/Santali (Letter writing, Report, Precis, Translation)", type: "Descriptive", marks: 200, dur: "3 hours" },
                      { name: "Paper II", scope: "English Language (Précis Writing, Report, Translation to English, Grammar)", type: "Descriptive", marks: 200, dur: "3 hours" },
                      { name: "Paper III (GS-I)", scope: "Indian History with National Movement focus, Geography emphasizing West Bengal", type: "MCQ", marks: 200, dur: "3 hours" },
                      { name: "Paper IV (GS-II)", scope: "General Science, Technology advancement, Environment, GK & Current Affairs", type: "MCQ", marks: 200, dur: "3 hours" },
                      { name: "Paper V", scope: "Indian Constitution, Centre-State Relations, Indian Federalism, Economy, RBI Roles", type: "MCQ", marks: 200, dur: "3 hours" },
                      { name: "Paper VI", scope: "Arithmetic and Test of Reasoning (Math operations, coding-decoding, puzzles)", type: "MCQ", marks: 200, dur: "3 hours" },
                      { name: "Paper VII & VIII", scope: "Optional subject choice papers (Only for Group A and B cadres)", type: "Descriptive", marks: 400, dur: "3 hours each" },
                    ].map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/40 dark:hover:bg-slate-850/40">
                        <td className="p-3 font-semibold text-slate-900 dark:text-slate-200 whitespace-nowrap">{row.name}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-350">{row.scope}</td>
                        <td className="p-3 text-center whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            row.type === 'Descriptive' 
                              ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300' 
                              : 'bg-emerald-100 text-emerald-990 dark:bg-emerald-950/40 dark:text-emerald-400'
                          }`}>
                            {row.type}
                          </span>
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-slate-950 dark:text-white">{row.marks}</td>
                        <td className="p-3 text-center font-mono whitespace-nowrap text-slate-505">{row.dur}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100 dark:bg-slate-900 font-extrabold text-[#0078d4] dark:text-blue-400 border-t border-slate-200 dark:border-slate-800">
                      <td colSpan={3} className="p-3">Total Mains Marks Summary</td>
                      <td colSpan={2} className="p-3 font-mono text-right">
                        Group A & B: <strong className="font-extrabold">1,600 Marks</strong> (with Optionals) <br />
                        Group C & D: <strong className="font-extrabold">1,200 Marks</strong> (excluding Optionals)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Personality Test Marks details split */}
            <div className="bg-white dark:bg-[#1e2022] p-5 rounded-md border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-505"></span>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Personality Interview marks configuration</h3>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-905 rounded border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Group A & B</span>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-350">Personality Evaluation</p>
                  </div>
                  <span className="text-sm font-black text-[#0078d4] dark:text-blue-400 font-mono">200 Marks</span>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-905 rounded border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Group C</span>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-350">Personality Evaluation</p>
                  </div>
                  <span className="text-sm font-black text-[#0078d4] dark:text-blue-400 font-mono">150 Marks</span>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-905 rounded border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Group D</span>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-350">Personality Evaluation</p>
                  </div>
                  <span className="text-sm font-black text-[#0078d4] dark:text-blue-400 font-mono">100 Marks</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
