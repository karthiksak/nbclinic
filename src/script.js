/**
 * Noble Homoeopathy Clinic — Modern JavaScript
 * ES2024+ | Vanilla JS | No jQuery Dependencies
 */

// ══════════════════════════════════════
// ── Translation Dictionary
// ══════════════════════════════════════
const TRANSLATIONS = {
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.overview': 'Overview',
    'nav.about': 'About',
    'nav.treatments': 'Treatments',
    'nav.whyUs': 'Why Us',
    'nav.doctor': 'Doctor',
    'nav.reviews': 'Reviews',
    'nav.gallery': 'Gallery',
    'nav.contact': 'Contact',
    'nav.feedback': 'Feedback',
    // Welcome Modal
    'welcome.open': 'Open Today • 10:00 AM – 8:00 PM',
    'welcome.book': 'Book Consult',
    'welcome.call': 'Call Now',
    // Tracker
    'tracker.loginTitle': 'Secure Portal',
    'tracker.loginDesc': 'Restricted Access - Enter Credentials',
    'tracker.userid': 'User ID',
    'tracker.password': 'Password',
    'tracker.authBtn': 'Authenticate',
    'tracker.invalid': 'Invalid Credentials',
    'tracker.dashTitle': 'Patient History Tracker',
    'tracker.session': 'Session Active: ',
    'tracker.pid': 'Patient ID / File No.',
    'tracker.pname': 'Patient Full Name',
    'tracker.symptoms': 'Current Symptoms',
    'tracker.medhistory': 'Medical History & Notes',
    'tracker.submit': 'Submit Record to Database',
    'tracker.log': 'Recent Activity Log',
    'tracker.logmsg': 'System Initialized.',
    // Hero
    'hero.badge': 'Holistic Homeopathic Care',
    'hero.title': 'Natural Optimization of',
    'hero.titleSpan': 'Body, Lifestyle & Energy',
    'hero.subtitle': 'Experience personalized, gentle healing that addresses the root cause of illness. Your journey to lasting Health, Harmony & Happiness begins here.',
    'hero.bookBtn': 'Book Consultation',
    'hero.chatBtn': 'Chat with Us',
    // Overview
    'overview.title': 'Holistic Solutions for Your Well-being',
    'overview.subtitle': 'At Noble Homoeopathy Clinic, we specialize in gentle yet powerful natural treatments. Discover how we can help with a wide range of conditions.',
    'overview.card1Title': 'Natural & Gentle',
    'overview.card1': 'Safe treatments for all ages, derived from natural sources with no harmful side effects.',
    'overview.card2Title': 'Personalized Care',
    'overview.card2': 'Tailored remedies based on your unique symptoms, constitution, and health history.',
    'overview.card3Title': 'Chronic & Acute',
    'overview.card3': 'Effective for both long-term chronic conditions and sudden acute illnesses.',
    'overview.card4Title': 'Root Cause Focus',
    'overview.card4': 'We aim for permanent solutions by addressing the underlying causes, not just symptoms.',
    // About
    'about.title': 'Understanding Homoeopathy',
    'about.intro': 'Homoeopathy is a system of alternative medicine created in 1796 by Dr. Samuel Hahnemann, based on the doctrine of "like cures like." A substance that causes symptoms in healthy individuals can cure similar symptoms in the sick. Remedies are prepared through homeopathic potentization — a process of serial dilution and vigorous shaking (succussion).',
    'about.card1Title': 'Acute & Chronic Conditions',
    'about.card1': 'Effective treatment for short-term and long-term diseases, including autoimmune conditions and supportive care.',
    'about.card2Title': 'Personalized Medicine',
    'about.card2': 'Treatments are tailored to each individual, considering unique symptoms, constitution, and complete health history.',
    'about.card3Title': 'Holistic Approach',
    'about.card3': 'Homoeopathy treats the whole person — not just the disease — including emotional, mental, and physical well-being.',
    'about.card4Title': 'Safe & Gentle',
    'about.card4': 'Remedies are natural, generally safe with minimal side effects, suitable for all ages including infants and pregnant women.',
    // Treatments
    'treatments.title': 'Treatments Offered',
    'treatments.subtitle': 'We provide comprehensive homeopathic care for a wide spectrum of health concerns. Here are some conditions we frequently treat.',
    'treatments.acuteTitle': 'Acute Conditions',
    'treatments.commonTitle': 'Common Illnesses',
    'treatments.common': 'Effective treatment for cold, fever, headache, minor skin rashes, vomiting, diarrhea, and other sudden-onset illnesses.',
    'treatments.chronicTitle': 'Chronic Conditions',
    'treatments.respTitle': 'Respiratory Complaints',
    'treatments.resp': 'Asthma, sinusitis, nasal polyps, allergies.',
    'treatments.skinTitle': 'Skin Diseases',
    'treatments.skin': 'Eczema, psoriasis, sebaceous cysts, various forms of acne (truncal, cystic).',
    'treatments.pilesTitle': 'Piles / Fistula',
    'treatments.piles': 'Non-invasive treatments for all degrees of piles, pilonidal cysts, and fistulas.',
    'treatments.kidneTitle': 'Kidney / Gallbladder Stones',
    'treatments.kidne': 'Remedies that help dissolve stones and alleviate associated symptoms.',
    'treatments.menstrTitle': 'Menstrual Disorders',
    'treatments.menstr': 'Regulating cycles, relieving pain (dysmenorrhea), controlling excess bleeding from fibroids/PID.',
    'treatments.lifestyleTitle': 'Lifestyle Diseases',
    'treatments.lifestyle': 'Fatty liver, PCOD, support for obesity management.',
    'treatments.infertTitle': 'Infertility / Impotency',
    'treatments.infert': 'Addressing hormonal imbalances, premature ejaculation, vaginismus.',
    'treatments.gastricTitle': 'Gastric Complaints',
    'treatments.gastric': 'Acid reflux (GERD), irritable bowel syndrome (IBS), bloating, indigestion.',
    'treatments.devTitle': 'Developmental Delays',
    'treatments.dev': 'Supportive care to help children achieve milestones.',
    'treatments.otherTitle': 'Other Chronic Complaints',
    'treatments.other': 'Thyroid disorders, rheumatoid arthritis, anxiety, depression, and more.',
    // Why Us
    'whyUs.title': 'Why Choose Noble Homoeopathy?',
    'whyUs.p1Title': 'Patients are Our Priority',
    'whyUs.p1': 'We value patient feedback and needs immensely to ensure the most compassionate care possible.',
    'whyUs.p2Title': 'Permanent Solutions',
    'whyUs.p2': 'Our treatments aim for lasting results by addressing the root cause, not just temporary symptom relief.',
    'whyUs.p3Title': 'Dedication & Integrity',
    'whyUs.p3': 'Minimum medicine for maximum cure — adhering to ethical practices and classical homeopathic principles.',
    'whyUs.p4Title': 'Affordable for All',
    'whyUs.p4': 'High-quality homeopathic treatment accessible and mainstream without compromising standards.',
    'whyUs.p5Title': 'Classical Principles',
    'whyUs.p5': 'We strictly follow homeopathic laws and provide individualized remedies for each treatment.',
    'whyUs.p6Title': 'Always Available',
    'whyUs.p6': 'Committed to supporting patients whenever they need assistance, promptly clarifying all concerns.',
    // Doctor
    'doctor.title': 'Meet Our Expert Practitioner',
    'doctor.credentials': 'BHMS (Bachelor of Homoeopathic Medicine and Surgery)',
    'doctor.bio': 'Dr. Kokhila is a highly qualified and experienced homeopathic practitioner with a deep passion for holistic healing. With 3 years in practice, she has successfully treated a wide range of conditions — focusing on individualized patient care and long-term well-being. Dr. Kokhila believes in empowering patients through education and compassionate support, guiding them towards optimal health and vitality.',
    // Reviews
    'reviews.title': 'What Our Patients Say',
    'reviews.subtitle': "Don't just take our word for it. Hear from real patients about their healing journey.",
    'reviews.googleTitle': 'View More Reviews on Google',
    // Gallery
    'gallery.title': 'Our Clinic & Patient Journeys',
    'gallery.subtitle': 'Take a look at our clinic environment and some inspiring cases of our patients.',
    // Contact
    'contact.title': 'Get in Touch with Us',
    'contact.subtitle': "We're here to answer your questions and help you start your journey to better health.",
    'contact.phone': 'Phone',
    'contact.email': 'Email',
    'contact.address': 'Address',
    'contact.enquiryBtn': 'Submit Enquiry',
    'contact.directionsBtn': 'Directions',
  },

  // ── Tamil ──────────────────────────────
  ta: {
    // Nav
    'nav.home': 'முகப்பு',
    'nav.overview': 'மேலோட்டம்',
    'nav.about': 'பற்றி',
    'nav.treatments': 'சிகிச்சைகள்',
    'nav.whyUs': 'ஏன் நாங்கள்',
    'nav.doctor': 'மருத்துவர்',
    'nav.reviews': 'மதிப்புரைகள்',
    'nav.gallery': 'படத்தொகுப்பு',
    'nav.contact': 'தொடர்பு',
    'nav.feedback': 'கருத்து',
    // Welcome Modal
    'welcome.open': 'இன்று திறந்திருக்கும் • காலை 10:00 – இரவு 8:00',
    'welcome.book': 'ஆலோசனை பதிவு',
    'welcome.call': 'அழைக்க',
    // Tracker
    'tracker.loginTitle': 'பாதுகாப்பான போர்டல்',
    'tracker.loginDesc': 'கட்டுப்படுத்தப்பட்ட அணுகல் - நற்சான்றிதழ்களை உள்ளிடவும்',
    'tracker.userid': 'பயனர் அடையாள எண்',
    'tracker.password': 'கடவுச்சொல்',
    'tracker.authBtn': 'அங்கீகரிக்க',
    'tracker.invalid': 'தவறான நற்சான்றிதழ்கள்',
    'tracker.dashTitle': 'நோயாளி வரலாற்றுத் தொடர்பியற்றி',
    'tracker.session': 'அமர்வு செயலில் உள்ளது: ',
    'tracker.pid': 'நோயாளி ஐடி / கோப்பு எண்',
    'tracker.pname': 'நோயாளியின் முழு பெயர்',
    'tracker.symptoms': 'தற்போதைய அறிகுறிகள்',
    'tracker.medhistory': 'மருத்துவ வரலாறு & குறிப்புகள்',
    'tracker.submit': 'கணினியில் பதிவை சமர்ப்பிக்கவும்',
    'tracker.log': 'சமீபத்திய செயல்பாட்டு பதிவு',
    'tracker.logmsg': 'கணினி துவக்கப்பட்டது.',
    // Hero
    'hero.badge': 'முழுமையான ஹோமியோபதி சிகிச்சை',
    'hero.title': 'இயற்கை மேம்படுத்தல்',
    'hero.titleSpan': 'உடல், வாழ்க்கை முறை & ஆற்றல்',
    'hero.subtitle': 'நோய்க்கான மூல காரணத்தை நிவர்த்தி செய்யும் தனிப்பயனாக்கப்பட்ட, மென்மையான சிகிச்சையை அனுபவியுங்கள். ஆரோக்கியம், நல்லிணக்கம் & மகிழ்ச்சிக்கான உங்கள் பயணம் இங்கே தொடங்குகிறது.',
    'hero.bookBtn': 'ஆலோசனை பதிவு',
    'hero.chatBtn': 'எங்களுடன் உரையாடுங்கள்',
    // Overview
    'overview.title': 'உங்கள் நலனுக்கான முழுமையான தீர்வுகள்',
    'overview.subtitle': 'நோபிள் ஹோமியோபதி மருத்துவமனையில், மென்மையான ஆனால் சக்திவாய்ந்த இயற்கை சிகிச்சைகளை நாங்கள் வழங்குகிறோம். பலவிதமான நோய்களுக்கு எவ்வாறு உதவலாம் என்பதை கண்டறியுங்கள்.',
    'overview.card1Title': 'இயற்கை & மென்மை',
    'overview.card1': 'எல்லா வயதினருக்கும் பாதுகாப்பான சிகிச்சை, இயற்கை மூலங்களிலிருந்து பெறப்பட்டது, தீங்கு விளைவிக்காத பக்க விளைவுகள்.',
    'overview.card2Title': 'தனிப்பயனாக்கப்பட்ட சிகிச்சை',
    'overview.card2': 'உங்கள் தனிப்பட்ட அறிகுறிகள், உடல் அமைப்பு மற்றும் உடல்நல வரலாற்றின் அடிப்படையில் தயாரிக்கப்பட்ட மருந்துகள்.',
    'overview.card3Title': 'நாட்பட்ட & கடுமையான நோய்கள்',
    'overview.card3': 'நீண்டகால நாட்பட்ட நோய்கள் மற்றும் திடீர் கடுமையான நோய்கள் இரண்டுக்கும் பயனுள்ளது.',
    'overview.card4Title': 'மூல காரண சிகிச்சை',
    'overview.card4': 'அறிகுறிகளை மட்டுமில்லாமல், அடிப்படை காரணங்களை நிவர்த்தி செய்வதன் மூலம் நிரந்தர தீர்வுகளை நாங்கள் நோக்குகிறோம்.',
    // About
    'about.title': 'ஹோமியோபதியை புரிந்துகொள்வோம்',
    'about.intro': 'ஹோமியோபதி என்பது 1796 ஆம் ஆண்டு டாக்டர் சாமுவேல் ஹேனிமன் உருவாக்கிய மாற்று மருத்துவ முறையாகும். "போலியே போலியை குணப்படுத்தும்" என்ற கொள்கையை அடிப்படையாகக் கொண்டது. ஆரோக்கியமான நபர்களில் அறிகுறிகளை உண்டாக்கும் ஒரு பொருள் நோயாளிகளில் அதே அறிகுறிகளை குணப்படுத்தலாம்.',
    'about.card1Title': 'கடுமையான & நாட்பட்ட நோய்கள்',
    'about.card1': 'தன்னுடல் தாக்க நோய்கள் உட்பட குறுகிய மற்றும் நீண்ட கால நோய்களுக்கான பயனுள்ள சிகிச்சை.',
    'about.card2Title': 'தனிப்பயனாக்கப்பட்ட மருத்துவம்',
    'about.card2': 'தனிப்பட்ட அறிகுறிகள், உடல் அமைப்பு மற்றும் முழுமையான உடல்நல வரலாற்றை கணக்கில் கொண்டு, ஒவ்வொரு நபருக்கும் சிகிச்சை வழங்கப்படுகிறது.',
    'about.card3Title': 'முழுமையான அணுகுமுறை',
    'about.card3': 'ஹோமியோபதி முழு மனிதனையும் சிகிச்சை செய்கிறது — நோயை மட்டுமில்லாமல் — உணர்ச்சி, மன மற்றும் உடல் நலனையும்.',
    'about.card4Title': 'பாதுகாப்பான & மென்மையான',
    'about.card4': 'மருந்துகள் இயற்கையானவை, குறைந்தபட்ச பக்க விளைவுகளுடன் பொதுவாக பாதுகாப்பானவை, குழந்தைகள் மற்றும் கர்ப்பிணி பெண்கள் உட்பட அனைத்து வயதினருக்கும் ஏற்றவை.',
    // Treatments
    'treatments.title': 'வழங்கப்படும் சிகிச்சைகள்',
    'treatments.subtitle': 'பல்வேறு உடல்நல பிரச்சினைகளுக்கு நாங்கள் விரிவான ஹோமியோபதி சிகிச்சை வழங்குகிறோம்.',
    'treatments.acuteTitle': 'கடுமையான நோய்கள்',
    'treatments.commonTitle': 'பொதுவான நோய்கள்',
    'treatments.common': 'சளி, காய்ச்சல், தலைவலி, சிறிய தோல் தடிப்புகள், வாந்தி, வயிற்றுப்போக்கு மற்றும் திடீர் நோய்களுக்கு பயனுள்ள சிகிச்சை.',
    'treatments.chronicTitle': 'நாட்பட்ட நோய்கள்',
    'treatments.respTitle': 'சுவாச பிரச்சினைகள்',
    'treatments.resp': 'ஆஸ்துமா, சைனஸைடிஸ், நாசி பாலிப்ஸ், ஒவ்வாமை.',
    'treatments.skinTitle': 'தோல் நோய்கள்',
    'treatments.skin': 'எக்ஸிமா, சொரியாசிஸ், சேபோசியஸ் சிஸ்ட், பல்வேறு வகையான முகப்பரு.',
    'treatments.pilesTitle': 'மூலம் / ஃபிஸ்துலா',
    'treatments.piles': 'அனைத்து அளவிலான மூலம், பைலோனிடல் சிஸ்ட் மற்றும் ஃபிஸ்துலாவுக்கு அறுவை சிகிச்சையற்ற சிகிச்சை.',
    'treatments.kidneTitle': 'சிறுநீரக / பித்தப்பை கற்கள்',
    'treatments.kidne': 'கற்களை கரைக்கவும் தொடர்புடைய அறிகுறிகளை குறைக்கவும் உதவும் மருந்துகள்.',
    'treatments.menstrTitle': 'மாதவிடாய் கோளாறுகள்',
    'treatments.menstr': 'சுழற்சி ஒழுங்குபடுத்துதல், வலி நிவாரணம், ஃபைப்ராய்டு/PID இன் அதிகப்படியான இரத்தப்போக்கை கட்டுப்படுத்துதல்.',
    'treatments.lifestyleTitle': 'வாழ்க்கை முறை நோய்கள்',
    'treatments.lifestyle': 'கொழுப்பு கல்லீரல், PCOD, உடல்பருமன் மேலாண்மைக்கான ஆதரவு.',
    'treatments.infertTitle': 'மலட்டுத்தன்மை / ஆண்மையின்மை',
    'treatments.infert': 'ஹார்மோன் ஏற்றத்தாழ்வுகள், முன்கூட்டிய விந்து வெளியீடு, வஜினிஸ்மஸ் ஆகியவற்றை சரிசெய்தல்.',
    'treatments.gastricTitle': 'வயிற்று பிரச்சினைகள்',
    'treatments.gastric': 'அமில ரிஃப்ளக்ஸ் (GERD), எரிச்சல் கொண்ட குடல் நோய்க்குறி (IBS), வீக்கம், அஜீரணம்.',
    'treatments.devTitle': 'வளர்ச்சி தாமதம்',
    'treatments.dev': 'குழந்தைகளை வளர்ச்சி மைல்கற்களை அடைய உதவும் ஆதரவு சிகிச்சை.',
    'treatments.otherTitle': 'பிற நாட்பட்ட பிரச்சினைகள்',
    'treatments.other': 'தைராய்டு கோளாறுகள், முடக்கு வாதம், கவலை, மனச்சோர்வு மற்றும் பலவற்றுக்கான சிகிச்சை.',
    // Why Us
    'whyUs.title': 'ஏன் நோபிள் ஹோமியோபதியை தேர்வு செய்யணும்?',
    'whyUs.p1Title': 'நோயாளிகளே எங்கள் முன்னுரிமை',
    'whyUs.p1': 'ஒவ்வொரு நோயாளியின் கருத்தையும் தேவையையும் நாங்கள் மிகவும் மதிக்கிறோம்.',
    'whyUs.p2Title': 'நிரந்தர தீர்வுகள்',
    'whyUs.p2': 'மூல காரணத்தை நிவர்த்தி செய்வதன் மூலம் நிரந்தர முடிவுகளை நோக்கி எங்கள் சிகிச்சை அமைகிறது.',
    'whyUs.p3Title': 'அர்ப்பணிப்பு & நேர்மை',
    'whyUs.p3': 'அதிகபட்ச குணத்திற்கு குறைந்தபட்ச மருந்து — நெறியான நடைமுறைகளை பின்பற்றுவது.',
    'whyUs.p4Title': 'அனைவருக்கும் கைக்கெட்டும் விலை',
    'whyUs.p4': 'தரம் குறைக்காமல் அனைவருக்கும் தரமான ஹோமியோபதி சிகிச்சை.',
    'whyUs.p5Title': 'கிளாசிக்கல் கொள்கைகள்',
    'whyUs.p5': 'ஹோமியோபதி விதிகளை கட்டுப்பாட்டுடன் பின்பற்றி தனிப்பட்ட மருந்துகளை வழங்குகிறோம்.',
    'whyUs.p6Title': 'எப்போதும் கிடைக்கும்',
    'whyUs.p6': 'தேவைப்படும்போதெல்லாம் நோயாளிகளுக்கு உதவ நாங்கள் உறுதிபூண்டுள்ளோம்.',
    // Doctor
    'doctor.title': 'எங்கள் நிபுணர் மருத்துவரை சந்தியுங்கள்',
    'doctor.credentials': 'BHMS (ஹோமியோபதி மருத்துவம் மற்றும் அறுவையியல் இளங்கலை)',
    'doctor.bio': 'டாக்டர் கோகிலா மிகவும் தகுதிவாய்ந்த மற்றும் அனுபவமிக்க ஹோமியோபதி மருத்துவர். 3 ஆண்டுகள் நடைமுறையில், அவர் பலவிதமான நோய்களை வெற்றிகரமாக சிகிச்சை செய்துள்ளார். தனிப்பட்ட நோயாளி சிகிச்சை மற்றும் நீண்டகால நலனில் கவனம் செலுத்துகிறார்.',
    // Reviews
    'reviews.title': 'எங்கள் நோயாளிகள் என்ன சொல்கிறார்கள்',
    'reviews.subtitle': 'உண்மையான நோயாளிகளிடம் இருந்து அவர்களின் குணமாகும் பயணத்தைப் பற்றி கேளுங்கள்.',
    'reviews.googleTitle': 'Google-ல் மேலும் மதிப்புரைகளை பார்க்கவும்',
    // Gallery
    'gallery.title': 'எங்கள் மருத்துவமனை & நோயாளி பயணங்கள்',
    'gallery.subtitle': 'எங்கள் மருத்துவமனை சூழல் மற்றும் சில உத்வேகமளிக்கும் நோயாளி வழக்குகளை பாருங்கள்.',
    // Contact
    'contact.title': 'எங்களுடன் தொடர்பு கொள்ளுங்கள்',
    'contact.subtitle': 'உங்கள் கேள்விகளுக்கு பதிலளிக்கவும், சிகிச்சை பயணத்தை தொடங்க உதவ நாங்கள் இங்கே இருக்கிறோம்.',
    'contact.phone': 'தொலைபேசி',
    'contact.email': 'மின்னஞ்சல்',
    'contact.address': 'முகவரி',
    'contact.enquiryBtn': 'விசாரணை சமர்ப்பிக்க',
    'contact.directionsBtn': 'வழிகாட்டுதல்',
  },

  // ── Hindi ──────────────────────────────
  hi: {
    // Nav
    'nav.home': 'होम',
    'nav.overview': 'अवलोकन',
    'nav.about': 'परिचय',
    'nav.treatments': 'उपचार',
    'nav.whyUs': 'क्यों हम',
    'nav.doctor': 'डॉक्टर',
    'nav.reviews': 'समीक्षाएं',
    'nav.gallery': 'गैलरी',
    'nav.contact': 'संपर्क',
    'nav.feedback': 'प्रतिक्रिया',
    // Welcome Modal
    'welcome.open': 'आज खुला है • सुबह 10:00 – रात 8:00',
    'welcome.book': 'परामर्श बुक करें',
    'welcome.call': 'कॉल करें',
    // Tracker
    'tracker.loginTitle': 'सुरक्षित पोर्टल',
    'tracker.loginDesc': 'प्रतिबंधित पहुंच - क्रेडेंशियल दर्ज करें',
    'tracker.userid': 'उपयोगकर्ता आईडी',
    'tracker.password': 'पासवर्ड',
    'tracker.authBtn': 'प्रमाणित करें',
    'tracker.invalid': 'अमान्य क्रेडेंशियल',
    'tracker.dashTitle': 'रोगी इतिहास ट्रैकर',
    'tracker.session': 'सत्र सक्रिय: ',
    'tracker.pid': 'रोगी आईडी / फ़ाइल नंबर',
    'tracker.pname': 'रोगी का पूरा नाम',
    'tracker.symptoms': 'वर्तमान लक्षण',
    'tracker.medhistory': 'चिकित्सा इतिहास और नोट्स',
    'tracker.submit': 'डेटाबेस में रिकॉर्ड जमा करें',
    'tracker.log': 'हालिया गतिविधि लॉग',
    'tracker.logmsg': 'सिस्टम प्रारंभ किया गया।',
    // Hero
    'hero.badge': 'समग्र होम्योपैथिक देखभाल',
    'hero.title': 'प्राकृतिक अनुकूलन',
    'hero.titleSpan': 'शरीर, जीवनशैली और ऊर्जा',
    'hero.subtitle': 'बीमारी के मूल कारण को दूर करने वाले व्यक्तिगत, कोमल उपचार का अनुभव करें। स्वास्थ्य, सामंजस्य और खुशी की आपकी यात्रा यहां से शुरू होती है।',
    'hero.bookBtn': 'परामर्श बुक करें',
    'hero.chatBtn': 'हमसे चैट करें',
    // Overview
    'overview.title': 'आपकी भलाई के लिए समग्र समाधान',
    'overview.subtitle': 'नोबल होम्योपैथी क्लिनिक में हम कोमल और प्रभावी प्राकृतिक उपचारों में विशेषज्ञ हैं। जानें कि हम किस प्रकार मदद कर सकते हैं।',
    'overview.card1Title': 'प्राकृतिक और कोमल',
    'overview.card1': 'सभी उम्र के लिए सुरक्षित उपचार, प्राकृतिक स्रोतों से बने, किसी हानिकारक दुष्प्रभाव के बिना।',
    'overview.card2Title': 'व्यक्तिगत देखभाल',
    'overview.card2': 'आपके अनूठे लक्षणों, संविधान और स्वास्थ्य इतिहास के आधार पर कस्टम उपचार।',
    'overview.card3Title': 'जीर्ण और तीव्र रोग',
    'overview.card3': 'दीर्घकालिक जीर्ण और अचानक तीव्र दोनों प्रकार की बीमारियों में प्रभावी।',
    'overview.card4Title': 'मूल कारण पर ध्यान',
    'overview.card4': 'हम केवल लक्षणों को नहीं, बल्कि अंतर्निहित कारणों को दूर करके स्थायी समाधान का लक्ष्य रखते हैं।',
    // About
    'about.title': 'होम्योपैथी को समझें',
    'about.intro': 'होम्योपैथी एक वैकल्पिक चिकित्सा प्रणाली है, जिसे 1796 में डॉ. सैमुअल हैनिमैन ने बनाया। यह "समान से समान का इलाज" के सिद्धांत पर आधारित है। स्वस्थ लोगों में लक्षण पैदा करने वाला पदार्थ बीमारों में समान लक्षणों को ठीक कर सकता है।',
    'about.card1Title': 'तीव्र और जीर्ण रोग',
    'about.card1': 'ऑटोइम्यून बीमारियों सहित अल्पकालिक और दीर्घकालिक रोगों का प्रभावी उपचार।',
    'about.card2Title': 'व्यक्तिगत चिकित्सा',
    'about.card2': 'प्रत्येक व्यक्ति के अनूठे लक्षणों, संविधान और पूर्ण स्वास्थ्य इतिहास को ध्यान में रखते हुए उपचार।',
    'about.card3Title': 'समग्र दृष्टिकोण',
    'about.card3': 'होम्योपैथी केवल बीमारी नहीं बल्कि पूरे व्यक्ति का इलाज करती है — भावनात्मक, मानसिक और शारीरिक।',
    'about.card4Title': 'सुरक्षित और कोमल',
    'about.card4': 'दवाएं प्राकृतिक हैं, न्यूनतम दुष्प्रभावों के साथ सुरक्षित, शिशुओं और गर्भवती महिलाओं सहित सभी उम्र के लिए उपयुक्त।',
    // Treatments
    'treatments.title': 'उपलब्ध उपचार',
    'treatments.subtitle': 'हम स्वास्थ्य संबंधी विभिन्न समस्याओं के लिए व्यापक होम्योपैथिक देखभाल प्रदान करते हैं।',
    'treatments.acuteTitle': 'तीव्र रोग',
    'treatments.commonTitle': 'सामान्य बीमारियाँ',
    'treatments.common': 'सर्दी, बुखार, सिरदर्द, मामूली त्वचा चकत्ते, उल्टी, दस्त और अन्य अचानक होने वाली बीमारियों का प्रभावी उपचार।',
    'treatments.chronicTitle': 'जीर्ण रोग',
    'treatments.respTitle': 'श्वसन समस्याएं',
    'treatments.resp': 'अस्थमा, साइनसाइटिस, नाक पॉलिप्स, एलर्जी।',
    'treatments.skinTitle': 'त्वचा रोग',
    'treatments.skin': 'एक्जिमा, सोरायसिस, सेबेशियस सिस्ट, विभिन्न प्रकार के मुंहासे।',
    'treatments.pilesTitle': 'बवासीर / भगंदर',
    'treatments.piles': 'सभी प्रकार के बवासीर, पाइलोनाइडल सिस्ट और भगंदर के लिए गैर-शल्य चिकित्सा उपचार।',
    'treatments.kidneTitle': 'गुर्दे / पित्ताशय की पथरी',
    'treatments.kidne': 'पथरी को गलाने और संबंधित लक्षणों को कम करने में मदद करने वाले उपाय।',
    'treatments.menstrTitle': 'मासिक धर्म विकार',
    'treatments.menstr': 'चक्र नियमन, दर्द निवारण (डिसमेनोरिया), फाइब्रॉइड/PID से अत्यधिक रक्तस्राव नियंत्रण।',
    'treatments.lifestyleTitle': 'जीवनशैली रोग',
    'treatments.lifestyle': 'फैटी लिवर, PCOD, मोटापा प्रबंधन सहायता।',
    'treatments.infertTitle': 'बांझपन / नपुंसकता',
    'treatments.infert': 'हार्मोनल असंतुलन, समयपूर्व स्खलन, वेजिनिस्मस का समाधान।',
    'treatments.gastricTitle': 'पेट की समस्याएं',
    'treatments.gastric': 'एसिड रिफ्लक्स (GERD), इरिटेबल बाउल सिंड्रोम (IBS), सूजन, अपच।',
    'treatments.devTitle': 'विकासात्मक देरी',
    'treatments.dev': 'बच्चों को विकासात्मक मील के पत्थर प्राप्त करने में सहायक देखभाल।',
    'treatments.otherTitle': 'अन्य जीर्ण शिकायतें',
    'treatments.other': 'थायरॉइड विकार, रुमेटाइड आर्थराइटिस, चिंता, अवसाद और बहुत कुछ।',
    // Why Us
    'whyUs.title': 'नोबल होम्योपैथी क्यों चुनें?',
    'whyUs.p1Title': 'मरीज हमारी प्राथमिकता',
    'whyUs.p1': 'हम सबसे दयालु देखभाल सुनिश्चित करने के लिए रोगी की प्रतिक्रिया और जरूरतों को बहुत महत्व देते हैं।',
    'whyUs.p2Title': 'स्थायी समाधान',
    'whyUs.p2': 'हमारे उपचार मूल कारण को संबोधित करके स्थायी परिणाम का लक्ष्य रखते हैं।',
    'whyUs.p3Title': 'समर्पण और ईमानदारी',
    'whyUs.p3': 'अधिकतम इलाज के लिए न्यूनतम दवा — नैतिक प्रथाओं और शास्त्रीय होम्योपैथिक सिद्धांतों का पालन।',
    'whyUs.p4Title': 'सबके लिए किफायती',
    'whyUs.p4': 'मानक से समझौता किए बिना उच्च गुणवत्ता वाला होम्योपैथिक उपचार सुलभ।',
    'whyUs.p5Title': 'शास्त्रीय सिद्धांत',
    'whyUs.p5': 'हम होम्योपैथिक नियमों का कड़ाई से पालन करते हैं और प्रत्येक उपचार के लिए व्यक्तिगत उपाय प्रदान करते हैं।',
    'whyUs.p6Title': 'हमेशा उपलब्ध',
    'whyUs.p6': 'जब भी जरूरत हो, मरीजों की सहायता के लिए प्रतिबद्ध।',
    // Doctor
    'doctor.title': 'हमारे विशेषज्ञ चिकित्सक से मिलें',
    'doctor.credentials': 'BHMS (बैचलर ऑफ होम्योपैथिक मेडिसिन एंड सर्जरी)',
    'doctor.bio': 'डॉ. कोखिला एक अत्यधिक योग्य और अनुभवी होम्योपैथिक चिकित्सक हैं। 3 वर्षों के अभ्यास में उन्होंने कई रोगों का सफलतापूर्वक इलाज किया है। वे व्यक्तिगत रोगी देखभाल और दीर्घकालिक कल्याण पर ध्यान केंद्रित करती हैं।',
    // Reviews
    'reviews.title': 'हमारे मरीज क्या कहते हैं',
    'reviews.subtitle': 'असली मरीजों से उनकी उपचार यात्रा के बारे में सुनें।',
    'reviews.googleTitle': 'Google पर और समीक्षाएं देखें',
    // Gallery
    'gallery.title': 'हमारा क्लिनिक और मरीजों की यात्रा',
    'gallery.subtitle': 'हमारे क्लिनिक का माहौल और कुछ प्रेरणादायक मामले देखें।',
    // Contact
    'contact.title': 'हमसे संपर्क करें',
    'contact.subtitle': 'हम आपके प्रश्नों का उत्तर देने और आपकी बेहतर स्वास्थ्य यात्रा शुरू करने में मदद के लिए यहाँ हैं।',
    'contact.phone': 'फ़ोन',
    'contact.email': 'ईमेल',
    'contact.address': 'पता',
    'contact.enquiryBtn': 'जांच सबमिट करें',
    'contact.directionsBtn': 'दिशा-निर्देश',
  }
};

// ── Active language state ──
let currentLang = localStorage.getItem('nhc_lang') || 'en';

// ── Translation Engine ──
function switchLanguage(lang) {
  if (!TRANSLATIONS[lang]) return;
  currentLang = lang;
  localStorage.setItem('nhc_lang', lang);

  // Update all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = TRANSLATIONS[lang][key];
    if (text) el.textContent = text;
  });

  // Update button states
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  // Update html lang attribute for accessibility & font rendering
  document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : lang === 'ta' ? 'ta' : 'hi');

  // Use Google Fonts Noto for Indic scripts
  updateBodyFont(lang);
}

function updateBodyFont(lang) {
  let link = document.getElementById('indic-font');
  if (lang === 'ta') {
    if (!link) {
      link = document.createElement('link');
      link.id = 'indic-font';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;500;600;700&display=swap';
    document.body.style.fontFamily = "'Noto Sans Tamil', 'DM Sans', system-ui, sans-serif";
  } else if (lang === 'hi') {
    if (!link) {
      link = document.createElement('link');
      link.id = 'indic-font';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap';
    document.body.style.fontFamily = "'Noto Sans Devanagari', 'DM Sans', system-ui, sans-serif";
  } else {
    document.body.style.fontFamily = "'DM Sans', system-ui, -apple-system, sans-serif";
  }
}

// ── DOM Ready ──
document.addEventListener('DOMContentLoaded', () => {
  initSplashScreen();
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initActiveNav();
  initLightbox();
  initParticles();
  initWelcomeModal();

  // Apply saved language on page load
  if (currentLang !== 'en') {
    switchLanguage(currentLang);
  }
});

// ══════════════════════════════════════
// ── Splash Screen
// ══════════════════════════════════════
function initSplashScreen() {
  const splash = document.getElementById('splash-screen');
  if (!splash) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      splash.classList.add('hide');
      // Remove from DOM after transition
      setTimeout(() => splash.remove(), 1000);
    }, 2800);
  });
}

// ══════════════════════════════════════
// ── Navbar Scroll Effects
// ══════════════════════════════════════
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Initial check
}

// ══════════════════════════════════════
// ── Mobile Menu Toggle
// ══════════════════════════════════════
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu on link click
  navMenu.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('open')) {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// ══════════════════════════════════════
// ── Scroll-triggered Animations
// ══════════════════════════════════════
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

// ══════════════════════════════════════
// ── Active Navigation Highlight
// ══════════════════════════════════════
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const navHeight = 80;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: `-${navHeight}px 0px -30% 0px`
    }
  );

  sections.forEach(section => observer.observe(section));
}

// ══════════════════════════════════════
// ── Custom Lightbox (using native dialog pattern)
// ══════════════════════════════════════
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  if (!galleryItems.length || !lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let currentIndex = 0;
  const images = Array.from(galleryItems).map(item => ({
    src: item.querySelector('img').src,
    caption: item.dataset.caption || ''
  }));

  function showImage(index) {
    currentIndex = ((index % images.length) + images.length) % images.length;
    lightboxImg.src = images[currentIndex].src;
    lightboxCaption.textContent = images[currentIndex].caption;
  }

  function openLightbox(index) {
    showImage(index);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', () => showImage(currentIndex - 1));
  nextBtn?.addEventListener('click', () => showImage(currentIndex + 1));

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

// ══════════════════════════════════════
// ── Hero Particle Effect
// ══════════════════════════════════════
function initParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;

  const count = 25;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 10;
    const opacity = Math.random() * 0.5 + 0.2;

    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      opacity: ${opacity};
    `;

    container.appendChild(particle);
  }
}

// ══════════════════════════════════════
// ── Welcome Modal (Google Business Style)
// ══════════════════════════════════════
function initWelcomeModal() {
  const welcomeModal = document.getElementById('welcome-modal');
  const welcomeCloseBtn = document.getElementById('welcome-close');
  
  if (!welcomeModal || !welcomeCloseBtn) return;

  // Show modal 3 seconds after load to clear splash screen
  setTimeout(() => {
      welcomeModal.classList.add('active');
  }, 3000); 

  const closeModal = () => {
      welcomeModal.classList.remove('active');
  };

  welcomeCloseBtn.addEventListener('click', closeModal);
  welcomeModal.addEventListener('click', (e) => {
      if (e.target === welcomeModal) closeModal();
  });
  
  document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && welcomeModal.classList.contains('active')) {
          closeModal();
      }
  });
}
