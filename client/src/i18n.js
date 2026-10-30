import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appName: 'Agri-Tech',
      nav: { dashboard: 'Dashboard', farms: 'Farms', crops: 'Crops', weather: 'Weather', alerts: 'Pest Alerts', market: 'Market', orders: 'Orders', consult: 'Experts', forum: 'Community', admin: 'Admin', login: 'Login', register: 'Register', logout: 'Logout' },
      common: { name: 'Name', email: 'Email', password: 'Password', phone: 'Phone', save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit', add: 'Add', loading: 'Loading...', none: 'Nothing here yet.', status: 'Status', actions: 'Actions', confirmDelete: 'Are you sure you want to delete this?', language: 'Language', details: 'Details', submit: 'Submit', search: 'Search', total: 'Total', role: 'Role' },
      auth: { loginTitle: 'Welcome back', registerTitle: 'Create your account', noAccount: "Don't have an account?", haveAccount: 'Already registered?', demo: 'Demo accounts' },
      dash: { hello: 'Hello', farms: 'Farms', crops: 'Active crops', alerts: 'Pest alerts', orders: 'Orders', cropStatus: 'Crops by status', cropSeason: 'Crops by season', yield: 'Expected vs actual yield (kg)', latestAlerts: 'Alerts for you' },
      farm: { title: 'My Farms', add: 'Add farm', area: 'Area (acres)', soil: 'Soil type', irrigation: 'Irrigation', lat: 'Latitude', lon: 'Longitude', village: 'Village', district: 'District', state: 'State', useLocation: 'Use my location' },
      crop: { title: 'Crop Monitoring', add: 'Add crop', farm: 'Farm', season: 'Season', sowing: 'Sowing date', harvest: 'Expected harvest', variety: 'Variety', expYield: 'Expected yield (kg)', actYield: 'Actual yield (kg)', soilTitle: 'Soil health', addReading: 'Add soil reading', score: 'Soil score', recs: 'Recommendations', activities: 'Activity log', addActivity: 'Log activity', type: 'Type', description: 'Description' },
      weather: { title: 'Weather & Advisories', selectFarm: 'Select a farm', now: 'Now', temp: 'Temperature', humidity: 'Humidity', wind: 'Wind', rain: 'Rain', forecast: '7-day forecast', advisories: 'Farm advisories', noFarm: 'Add a farm first to see weather.' },
      alerts: { title: 'Pest Alerts', severity: 'Severity', prevention: 'Prevention', treatment: 'Treatment', crops: 'Affected crops' },
      market: { title: 'Resource Marketplace', addToCart: 'Add to cart', cart: 'Cart', checkout: 'Place order', address: 'Delivery address', stock: 'In stock', empty: 'Cart is empty', placed: 'Order placed!' },
      orders: { title: 'My Orders', cancel: 'Cancel order', items: 'Items' },
      consult: { title: 'Expert Consultation', ask: 'Ask an expert', subject: 'Subject', question: 'Your question', answer: 'Answer', reply: 'Reply', open: 'Open', answered: 'Answered', closed: 'Closed' },
      forum: { title: 'Community Forum', newPost: 'New post', postTitle: 'Title', body: 'Body', tags: 'Tags (comma separated)', comments: 'Comments', comment: 'Write a comment', post: 'Post' },
      admin: { title: 'Admin Dashboard', users: 'Users', resources: 'Resources', orders: 'Orders', alerts: 'Alerts', forum: 'Moderation', revenue: 'Revenue', pending: 'Pending resources', approve: 'Approve', hide: 'Hide', show: 'Show', activate: 'Activate', deactivate: 'Deactivate' },
    },
  },
  hi: {
    translation: {
      appName: 'एग्री-टेक',
      nav: { dashboard: 'डैशबोर्ड', farms: 'खेत', crops: 'फसलें', weather: 'मौसम', alerts: 'कीट चेतावनी', market: 'बाज़ार', orders: 'ऑर्डर', consult: 'विशेषज्ञ', forum: 'समुदाय', admin: 'एडमिन', login: 'लॉगिन', register: 'पंजीकरण', logout: 'लॉगआउट' },
      common: { name: 'नाम', email: 'ईमेल', password: 'पासवर्ड', phone: 'फ़ोन', save: 'सहेजें', cancel: 'रद्द करें', delete: 'हटाएं', edit: 'संपादित करें', add: 'जोड़ें', loading: 'लोड हो रहा है...', none: 'अभी कुछ नहीं है।', status: 'स्थिति', actions: 'कार्य', confirmDelete: 'क्या आप इसे हटाना चाहते हैं?', language: 'भाषा', details: 'विवरण', submit: 'जमा करें', search: 'खोजें', total: 'कुल', role: 'भूमिका' },
      auth: { loginTitle: 'वापसी पर स्वागत है', registerTitle: 'अपना खाता बनाएं', noAccount: 'खाता नहीं है?', haveAccount: 'पहले से पंजीकृत हैं?', demo: 'डेमो खाते' },
      dash: { hello: 'नमस्ते', farms: 'खेत', crops: 'सक्रिय फसलें', alerts: 'कीट चेतावनी', orders: 'ऑर्डर', cropStatus: 'स्थिति के अनुसार फसलें', cropSeason: 'मौसम के अनुसार फसलें', yield: 'अपेक्षित बनाम वास्तविक उपज (किग्रा)', latestAlerts: 'आपके लिए चेतावनियाँ' },
      farm: { title: 'मेरे खेत', add: 'खेत जोड़ें', area: 'क्षेत्रफल (एकड़)', soil: 'मिट्टी का प्रकार', irrigation: 'सिंचाई', lat: 'अक्षांश', lon: 'देशांतर', village: 'गाँव', district: 'ज़िला', state: 'राज्य', useLocation: 'मेरा स्थान उपयोग करें' },
      crop: { title: 'फसल निगरानी', add: 'फसल जोड़ें', farm: 'खेत', season: 'मौसम', sowing: 'बुवाई की तारीख', harvest: 'अपेक्षित कटाई', variety: 'किस्म', expYield: 'अपेक्षित उपज (किग्रा)', actYield: 'वास्तविक उपज (किग्रा)', soilTitle: 'मिट्टी का स्वास्थ्य', addReading: 'मिट्टी की जाँच जोड़ें', score: 'मिट्टी स्कोर', recs: 'सुझाव', activities: 'गतिविधि लॉग', addActivity: 'गतिविधि दर्ज करें', type: 'प्रकार', description: 'विवरण' },
      weather: { title: 'मौसम और सलाह', selectFarm: 'खेत चुनें', now: 'अभी', temp: 'तापमान', humidity: 'आर्द्रता', wind: 'हवा', rain: 'बारिश', forecast: '7 दिन का पूर्वानुमान', advisories: 'खेती सलाह', noFarm: 'मौसम देखने के लिए पहले खेत जोड़ें।' },
      alerts: { title: 'कीट चेतावनी', severity: 'गंभीरता', prevention: 'रोकथाम', treatment: 'उपचार', crops: 'प्रभावित फसलें' },
      market: { title: 'संसाधन बाज़ार', addToCart: 'कार्ट में डालें', cart: 'कार्ट', checkout: 'ऑर्डर दें', address: 'डिलीवरी का पता', stock: 'स्टॉक में', empty: 'कार्ट खाली है', placed: 'ऑर्डर हो गया!' },
      orders: { title: 'मेरे ऑर्डर', cancel: 'ऑर्डर रद्द करें', items: 'सामान' },
      consult: { title: 'विशेषज्ञ परामर्श', ask: 'विशेषज्ञ से पूछें', subject: 'विषय', question: 'आपका प्रश्न', answer: 'उत्तर', reply: 'जवाब दें', open: 'खुला', answered: 'उत्तर दिया गया', closed: 'बंद' },
      forum: { title: 'सामुदायिक मंच', newPost: 'नई पोस्ट', postTitle: 'शीर्षक', body: 'विवरण', tags: 'टैग (अल्पविराम से अलग)', comments: 'टिप्पणियाँ', comment: 'टिप्पणी लिखें', post: 'पोस्ट करें' },
      admin: { title: 'एडमिन डैशबोर्ड', users: 'उपयोगकर्ता', resources: 'संसाधन', orders: 'ऑर्डर', alerts: 'चेतावनियाँ', forum: 'मॉडरेशन', revenue: 'आय', pending: 'लंबित संसाधन', approve: 'स्वीकृत करें', hide: 'छुपाएं', show: 'दिखाएं', activate: 'सक्रिय करें', deactivate: 'निष्क्रिय करें' },
    },
  },
  mr: {
    translation: {
      appName: 'अ‍ॅग्री-टेक',
      nav: { dashboard: 'डॅशबोर्ड', farms: 'शेते', crops: 'पिके', weather: 'हवामान', alerts: 'कीड इशारे', market: 'बाजार', orders: 'ऑर्डर', consult: 'तज्ज्ञ', forum: 'समुदाय', admin: 'अ‍ॅडमिन', login: 'लॉगिन', register: 'नोंदणी', logout: 'लॉगआउट' },
      common: { name: 'नाव', email: 'ईमेल', password: 'पासवर्ड', phone: 'फोन', save: 'जतन करा', cancel: 'रद्द करा', delete: 'हटवा', edit: 'संपादित करा', add: 'जोडा', loading: 'लोड होत आहे...', none: 'अजून काही नाही.', status: 'स्थिती', actions: 'क्रिया', confirmDelete: 'तुम्हाला हे हटवायचे आहे का?', language: 'भाषा', details: 'तपशील', submit: 'सादर करा', search: 'शोधा', total: 'एकूण', role: 'भूमिका' },
      auth: { loginTitle: 'पुन्हा स्वागत आहे', registerTitle: 'तुमचे खाते तयार करा', noAccount: 'खाते नाही?', haveAccount: 'आधीच नोंदणी केली आहे?', demo: 'डेमो खाती' },
      dash: { hello: 'नमस्कार', farms: 'शेते', crops: 'चालू पिके', alerts: 'कीड इशारे', orders: 'ऑर्डर', cropStatus: 'स्थितीनुसार पिके', cropSeason: 'हंगामानुसार पिके', yield: 'अपेक्षित विरुद्ध प्रत्यक्ष उत्पादन (किग्रॅ)', latestAlerts: 'तुमच्यासाठी इशारे' },
      farm: { title: 'माझी शेते', add: 'शेत जोडा', area: 'क्षेत्र (एकर)', soil: 'मातीचा प्रकार', irrigation: 'सिंचन', lat: 'अक्षांश', lon: 'रेखांश', village: 'गाव', district: 'जिल्हा', state: 'राज्य', useLocation: 'माझे स्थान वापरा' },
      crop: { title: 'पीक निरीक्षण', add: 'पीक जोडा', farm: 'शेत', season: 'हंगाम', sowing: 'पेरणीची तारीख', harvest: 'अपेक्षित काढणी', variety: 'वाण', expYield: 'अपेक्षित उत्पादन (किग्रॅ)', actYield: 'प्रत्यक्ष उत्पादन (किग्रॅ)', soilTitle: 'मातीचे आरोग्य', addReading: 'माती तपासणी जोडा', score: 'माती गुण', recs: 'शिफारसी', activities: 'कामांची नोंद', addActivity: 'काम नोंदवा', type: 'प्रकार', description: 'वर्णन' },
      weather: { title: 'हवामान आणि सल्ला', selectFarm: 'शेत निवडा', now: 'आता', temp: 'तापमान', humidity: 'आर्द्रता', wind: 'वारा', rain: 'पाऊस', forecast: '७ दिवसांचा अंदाज', advisories: 'शेती सल्ला', noFarm: 'हवामान पाहण्यासाठी आधी शेत जोडा.' },
      alerts: { title: 'कीड इशारे', severity: 'तीव्रता', prevention: 'प्रतिबंध', treatment: 'उपचार', crops: 'बाधित पिके' },
      market: { title: 'साधन बाजार', addToCart: 'कार्टमध्ये टाका', cart: 'कार्ट', checkout: 'ऑर्डर द्या', address: 'वितरण पत्ता', stock: 'साठा', empty: 'कार्ट रिकामे आहे', placed: 'ऑर्डर दिली!' },
      orders: { title: 'माझे ऑर्डर', cancel: 'ऑर्डर रद्द करा', items: 'वस्तू' },
      consult: { title: 'तज्ज्ञ सल्ला', ask: 'तज्ज्ञांना विचारा', subject: 'विषय', question: 'तुमचा प्रश्न', answer: 'उत्तर', reply: 'उत्तर द्या', open: 'खुले', answered: 'उत्तर दिले', closed: 'बंद' },
      forum: { title: 'समुदाय मंच', newPost: 'नवीन पोस्ट', postTitle: 'शीर्षक', body: 'मजकूर', tags: 'टॅग (स्वल्पविरामाने)', comments: 'टिप्पण्या', comment: 'टिप्पणी लिहा', post: 'पोस्ट करा' },
      admin: { title: 'अ‍ॅडमिन डॅशबोर्ड', users: 'वापरकर्ते', resources: 'साधने', orders: 'ऑर्डर', alerts: 'इशारे', forum: 'मॉडरेशन', revenue: 'उत्पन्न', pending: 'प्रलंबित साधने', approve: 'मंजूर करा', hide: 'लपवा', show: 'दाखवा', activate: 'सक्रिय करा', deactivate: 'निष्क्रिय करा' },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('agri_lang') || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

i18n.on('languageChanged', (l) => localStorage.setItem('agri_lang', l));

export default i18n;
